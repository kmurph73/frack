import { Color, Piece, PieceSymbol } from "chess.js";
import { Rect } from "./types";

let x = 675;

const vec: number[] = [];
for (let index = 0; index < 6; index++) {
  vec.push(x);
  x -= 135;
}

const size = 125;

export const getAtlasCoords = (color: Color, piece: PieceSymbol): Rect => {
  const xPos = (() => {
    switch (piece) {
      case "p":
        return vec[0]! - 7.5;
      case "r":
        return vec[1]!;
      case "n":
        return vec[2]!;
      case "b":
        return vec[3]!;
      case "q":
        return vec[4]!;
      case "k":
        return vec[5]!;
    }
  })();

  const yPos = color == "b" ? 135 : 5;

  return {
    x: xPos,
    y: yPos,
    w: size,
    h: size,
  };
};
// fn get_image_coords(color: &cozy_chess::Color, piece: &cozy_chess::Piece) -> Rect {
//     let mut vec: Vec<f32> = Vec::with_capacity(6);
//     let mut x = 675.0;

//     for _ in 0..6 {
//         vec.push(x);

//         x -= 135.0;
//     }

//     let x_pos = match piece {
//         Piece::Pawn => vec[0] - 7.5,
//         Piece::Rook => vec[1],
//         Piece::Knight => vec[2],
//         Piece::Bishop => vec[3],
//         Piece::Queen => vec[4],
//         Piece::King => vec[5],
//     };

//     let y_pos = if color == &cozy_chess::Color::Black {
//         135.0
//     } else {
//         5.0
//     };

//     let size = 125.0;

//     Rect {
//         x: x_pos,
//         y: y_pos,
//         w: size,
//         h: size,
//     }

// }
