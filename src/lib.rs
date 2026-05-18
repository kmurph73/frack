mod book;
mod engine;
mod game;
mod rng;

use game::ChessGame;
use rng::Rng;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn get_rng() -> u64 {
    let mut rng = Rng::new();
    return rng.next();
}

#[wasm_bindgen]
pub fn get_move(n: u64, fen: &str, depth: u8) -> String {
    let mut rng = Rng::new_with(n.into());
    let game = ChessGame::from_fen(fen);
    let vec = heapless::Vec::new();
    let result: (Option<cozy_chess::Move>, i16) =
        engine::best_move(&game, rng.next(), &vec, depth);
    let str: String = match result.0 {
        Some(mv) => format!("{},{}", mv.from, mv.to),
        None => format!("{}", result.1),
    };

    return str;
}

// #[wasm_bindgen]
// pub fn start(name: &str) {
//     let mut rng = Rng::new();
//     let player_color = cozy_chess::Color::Black;

//     let mut game = ChessGame::new();

//     if game.board().side_to_move() == player_color {
//         let mv = engine::best_move(&game, rng.next());
//         game.try_play(mv);
//     }
// }
