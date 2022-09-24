use cozy_chess::*;

pub struct ChessGame {
    board: Board,
}

impl ChessGame {
    pub fn board(&self) -> &Board {
        &self.board
    }

    pub fn from_fen(fen: &str) -> Self {
        let board = Board::from_fen(fen, false).unwrap();
        let game = ChessGame { board };
        return game;
    }

    pub fn try_play(&mut self, mv: Move) -> bool {
        if self.status() != GameStatus::Ongoing {
            return false;
        }

        if let Err(cozy_chess::IllegalMoveError) = self.board.try_play(mv) {
            return false;
        }

        true
    }

    pub fn status(&self) -> GameStatus {
        let bishops = self.board.pieces(Piece::Bishop);
        let knights = self.board.pieces(Piece::Knight);
        let num_occupied = self.board.occupied().len();

        match num_occupied {
            2 => return GameStatus::Drawn,
            3 => {
                if !(bishops | knights).is_empty() {
                    return GameStatus::Drawn;
                }
            }
            _ => {}
        }

        // let current = *self.history.last().unwrap();
        // let repetitions = self.history.iter().filter(|&&h| h == current).count();
        // if repetitions >= 3 {
        //     return GameStatus::Drawn;
        // }
        self.board.status()
    }
}
