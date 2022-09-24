import { dom } from "./domElements.js";
import { getAtlasCoords } from "./getAtlasCoords.js";
import { halfSquare, squareSize, state } from "./globals.js";
import { Chess, getFile, getRank, Move, Square, SQUARES } from "./lib/chess.js";
import { Point } from "./types.js";
import { flipRank, mapCompact, posFromSquare, squareFromPos } from "./util.js";

export const drawPieces = (img: HTMLImageElement, chess: Chess) => {
  let board = chess.board();
  const ctx = dom.canvasContext!;

  const destSize = squareSize / 1.1;

  if (state.flipped) {
    board = [...board].reverse();
  }

  for (let index = 0; index < board.length; index++) {
    const row = board[index];

    for (let index = 0; index < row.length; index++) {
      const element = row[index];
      if (element == null) {
        continue;
      }

      const { square, type, color, squareNum } = element;

      // let x = square.file() as i32;
      // let y = square.rank().flip() as i32;

      let file = getFile(squareNum);
      let rank = getRank(squareNum);
      // rank = flipRank(rank);
      if (state.flipped) {
        file = Math.abs(7 - file);
        rank = Math.abs(7 - rank);
      }

      const destX = file * squareSize;
      let destY = rank * squareSize;

      const { x, y, h, w } = getAtlasCoords(color, type);

      if (
        state.mousePos &&
        state.selectedSquare &&
        state.selectedSquare == square
      ) {
        const { x: destX, y: destY } = state.mousePos;

        ctx.drawImage(
          img,
          x,
          y,
          w,
          h,
          destX - halfSquare,
          destY - halfSquare,
          destSize,
          destSize
        );

        const moves = chess.moves({ square });

        for (let index = 0; index < moves.length; index++) {
          let move = moves[index]!;

          if (typeof move !== "string") {
            continue;
          }

          if (/=/.test(move)) {
            move = move.split("=")[0];
          } else {
            move = move.replace("+", "").slice(-2);
          }

          let { x, y } = posFromSquare(move as Square);
          if (state.flipped) {
            x = Math.abs(7 - x);
            y -= 1;
          } else {
            y = Math.abs(8 - y);
          }
          x = x * squareSize;
          y = y * squareSize;

          ctx.fillStyle = "rgba(5, 5, 5, 0.5)";
          ctx.beginPath();
          ctx.arc(
            x + halfSquare,
            y + halfSquare,
            squareSize / 4,
            0,
            2 * Math.PI
          );
          ctx.fill();
        }

        continue;
      }

      ctx.drawImage(img, x, y, w, h, destX, destY, destSize, destSize);
    }
  }
};
