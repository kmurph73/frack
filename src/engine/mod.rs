use cozy_chess::*;

use crate::{book::book_entry, game::ChessGame};
use heapless::Vec;

mod eval;

type History = Vec<u64, 150>;

// Max legal moves in any chess position is 218.
const MAX_MOVES: usize = 218;
const MAX_PLY: usize = 64;
// Power of two so we can mask the zobrist into an index. ~16K entries → ~400KB.
const TT_SIZE: usize = 1 << 14;

const TT_EMPTY: u8 = 0;
const TT_EXACT: u8 = 1;
const TT_LOWER: u8 = 2;
const TT_UPPER: u8 = 3;

#[derive(Clone, Copy, Default)]
struct TtEntry {
    key: u64,
    best_move: Option<Move>,
    score: i16,
    depth: i8,
    flag: u8,
}

struct SearchCtx {
    history: History,
    killers: [Option<Move>; MAX_PLY],
    tt: Box<[TtEntry]>,
    strong: bool,
}

impl SearchCtx {
    fn new(history: History, strong: bool) -> Self {
        // Only the strong path uses the TT — weak/normal keep zero-cost
        // allocation to stay byte-for-byte equivalent to the pre-Claude build.
        let tt: Box<[TtEntry]> = if strong {
            vec![TtEntry::default(); TT_SIZE].into_boxed_slice()
        } else {
            std::vec::Vec::new().into_boxed_slice()
        };
        Self {
            history,
            killers: [None; MAX_PLY],
            tt,
            strong,
        }
    }
}

fn piece_value(p: Piece) -> i16 {
    match p {
        Piece::Pawn => 1,
        Piece::Knight => 3,
        Piece::Bishop => 3,
        Piece::Rook => 5,
        Piece::Queen => 9,
        Piece::King => 0,
    }
}

fn is_capture(board: &Board, mv: Move) -> bool {
    !(board.colors(!board.side_to_move()) & mv.to.bitboard()).is_empty()
}

// MVV-LVA + queen promo, with TT move and killer surfaced ahead of normal
// captures. En passant captures fall through as quiet for scoring (rare).
fn ordered_moves(
    board: &Board,
    tt_move: Option<Move>,
    killer: Option<Move>,
) -> Vec<(Move, i16), MAX_MOVES> {
    let mut out: Vec<(Move, i16), MAX_MOVES> = Vec::new();
    let them = board.colors(!board.side_to_move());
    board.generate_moves(|piece_moves| {
        let attacker_val = piece_value(piece_moves.piece);
        for mv in piece_moves {
            let to_bb = mv.to.bitboard();
            let is_cap = !(them & to_bb).is_empty();
            let mut score: i16 = 0;
            if is_cap {
                for &p in &Piece::ALL {
                    if !(board.pieces(p) & to_bb).is_empty() {
                        score = 1000 + piece_value(p) * 10 - attacker_val;
                        break;
                    }
                }
            }
            if mv.promotion == Some(Piece::Queen) {
                score += 800;
            }
            if !is_cap && mv.promotion.is_none() && Some(mv) == killer {
                score = 900;
            }
            if Some(mv) == tt_move {
                score = 30_000;
            }
            let _ = out.push((mv, score));
        }
        false
    });
    out.sort_unstable_by(|a, b| b.1.cmp(&a.1));
    out
}

pub fn best_move(
    game: &ChessGame,
    random: u64,
    history: &History,
    depth: u8,
    strong: bool,
) -> (Option<Move>, i16) {
    let moves = book_entry(game.board());
    if !moves.is_empty() {
        let mv: Option<Move> = Some(moves[(random % moves.len() as u64) as usize]);
        return (mv, -3);
    }

    let mut hist = History::from_slice(history).unwrap();
    hist.pop();
    let mut ctx = SearchCtx::new(hist, strong);
    search(&mut ctx, game.board(), depth, 0, -15_000, 15_000)
}

fn search(
    ctx: &mut SearchCtx,
    board: &Board,
    depth: u8,
    ply: u8,
    mut alpha: i16,
    beta: i16,
) -> (Option<Move>, i16) {
    match board.status() {
        GameStatus::Won => return (None, -10_000 + ply as i16),
        GameStatus::Drawn => return (None, 0),
        GameStatus::Ongoing => {}
    }
    let key = board.hash();
    // Repetition check must precede the TT probe — a path-dependent draw
    // should override any score cached from a different path.
    let repetitions = ctx.history.iter().filter(|&&h| h == key).count();
    if repetitions >= 2 {
        return (None, 0);
    }

    if !ctx.strong {
        // Pre-Claude path: native generation order, buggy qsearch bounds, no
        // TT, no killers. Keeps gf and gfw byte-for-byte identical.
        if depth == 0 {
            return (None, qsearch(board, ply + 1, -beta, -alpha));
        }
        ctx.history.push(key).unwrap();
        let mut best_move = None;
        let mut value = i16::MIN;
        board.generate_moves(|moves| {
            for mv in moves {
                let mut child = board.clone();
                child.play_unchecked(mv);
                let (_, mut child_value) =
                    search(ctx, &child, depth - 1, ply + 1, -beta, -alpha);
                child_value *= -1;
                if child_value > value {
                    value = child_value;
                    best_move = Some(mv);
                    if value > alpha {
                        alpha = value;
                        if alpha >= beta {
                            return true;
                        }
                    }
                }
            }
            false
        });
        ctx.history.pop();
        return (best_move, value);
    }

    // Strong path: qsearch fix + MVV-LVA ordering + killers + TT.
    let alpha_orig = alpha;
    let tt_idx = (key as usize) & (ctx.tt.len() - 1);
    let entry = ctx.tt[tt_idx];
    let mut tt_move: Option<Move> = None;
    if entry.flag != TT_EMPTY && entry.key == key {
        tt_move = entry.best_move;
        // Skip TT cutoff at root so we always return a concrete move.
        if entry.depth >= depth as i8 && ply > 0 {
            match entry.flag {
                TT_EXACT => return (entry.best_move, entry.score),
                TT_LOWER if entry.score >= beta => return (entry.best_move, entry.score),
                TT_UPPER if entry.score <= alpha => return (entry.best_move, entry.score),
                _ => {}
            }
        }
    }

    if depth == 0 {
        return (None, qsearch(board, ply + 1, alpha, beta));
    }

    ctx.history.push(key).unwrap();
    let killer = if (ply as usize) < ctx.killers.len() {
        ctx.killers[ply as usize]
    } else {
        None
    };
    let moves = ordered_moves(board, tt_move, killer);

    let mut best_move = None;
    let mut value = i16::MIN;

    for &(mv, _) in moves.iter() {
        let mut child = board.clone();
        child.play_unchecked(mv);
        let (_, child_value) = search(ctx, &child, depth - 1, ply + 1, -beta, -alpha);
        let child_value = child_value.saturating_neg();
        if child_value > value {
            value = child_value;
            best_move = Some(mv);
            if value > alpha {
                alpha = value;
                if alpha >= beta {
                    if !is_capture(board, mv) && mv.promotion.is_none() {
                        if (ply as usize) < ctx.killers.len() {
                            ctx.killers[ply as usize] = Some(mv);
                        }
                    }
                    break;
                }
            }
        }
    }
    ctx.history.pop();

    let flag = if value >= beta {
        TT_LOWER
    } else if value <= alpha_orig {
        TT_UPPER
    } else {
        TT_EXACT
    };
    ctx.tt[tt_idx] = TtEntry {
        key,
        best_move,
        score: value,
        depth: depth as i8,
        flag,
    };

    (best_move, value)
}

fn qsearch(board: &Board, ply_index: u8, mut alpha: i16, beta: i16) -> i16 {
    match board.status() {
        GameStatus::Won => return -10_000 + ply_index as i16,
        GameStatus::Drawn => return 0,
        GameStatus::Ongoing => {}
    }
    let mut best_eval = eval::evaluate(board);
    if ply_index >= 20 {
        return best_eval;
    }
    alpha = alpha.max(best_eval);
    if alpha >= beta {
        return best_eval;
    }

    let victims = board.colors(!board.side_to_move());
    'search: for &victim in Piece::ALL.iter().rev() {
        if victim == Piece::King {
            continue;
        }
        let victims = victims & board.pieces(victim);
        for &attacker in &Piece::ALL {
            let attackers = board.pieces(attacker);
            let stop = board.generate_moves_for(attackers, |mut moves| {
                moves.to &= victims;
                for mv in moves {
                    let mut child = board.clone();
                    child.play_unchecked(mv);
                    let eval = -qsearch(&child, ply_index + 1, -beta, -alpha);

                    if eval > best_eval {
                        best_eval = eval;
                    }

                    alpha = alpha.max(best_eval);
                    if alpha >= beta {
                        return true;
                    }
                }
                false
            });
            if stop {
                break 'search;
            }
        }
    }
    best_eval
}
