import { attemptComputerMove } from "./attemptComputerMove.js";
import { dom } from "./domElements.js";
import { drawMoves } from "./drawMoves.js";
import { globals, state } from "./globals.js";
import { Move, Piece, Square } from "./lib/chess.js";
import { rerender } from "./main.js";
import { saveState } from "./localStorage.js";
import { goFish } from "./stockfish.js";
import { FileAndRank } from "./types.js";
import {
  getCursorPosition,
  chessPosFromPoint,
  squareFromPos,
  isWithinCanvas,
} from "./util.js";

const mousedown = (e: MouseEvent) => {
  if (!isWithinCanvas(e)) {
    return;
  }

  const pos = getCursorPosition(dom.canvas!, e);
  const chessPos = chessPosFromPoint(pos);
  if (!chessPos) {
    return;
  }

  state.mousedown = true;
  state.mousePos = pos;
  const square = squareFromPos(chessPos);
  state.selectedSquare = square;
  rerender();
};

const isPromotionAttempt = (
  { type, color }: Piece,
  { rank }: FileAndRank
): boolean => {
  if (type !== "p") {
    return false;
  }

  return (color === "b" && rank === 1) || (color === "w" && rank === 8);
};

const promotions = ["q", "n", "b", "r"] as const;

const mouseup = (e: MouseEvent) => {
  if (!state.selectedSquare) {
    return;
  }

  const pos = getCursorPosition(dom.canvas!, e);
  const chessPos = chessPosFromPoint(pos);
  if (!chessPos) {
    return;
  }

  const game = globals.game!;
  const rng = globals.rng!;

  const square = squareFromPos(chessPos);
  const piece = game.get(state.selectedSquare);
  const promote = isPromotionAttempt(piece, chessPos);

  let mv: Move | null = null;

  if (promote) {
    const choice = prompt(`promote ${promotions.join(", ")}`);

    if (choice && promotions.includes(choice as any)) {
      mv = game.move({
        from: state.selectedSquare,
        to: square,
        promotion: choice,
      });
    }
  } else {
    mv = game.move({ from: state.selectedSquare, to: square });
  }

  if (mv) {
    saveState();

    const result = attemptComputerMove();
    if (result) {
      drawMoves();

      setTimeout(() => {
        if (game.isCheckmate()) {
          alert("GG");
        }
      }, 100);
    }
  }

  state.selectedSquare = null;
  rerender();
};

const mousemove = (e: MouseEvent) => {
  if (!isWithinCanvas(e)) {
    return;
  }

  if (state.selectedSquare && state.mousedown) {
    const pos = getCursorPosition(dom.canvas!, e);
    state.mousePos = pos;
    rerender();
  }
};

const newGame = () => {
  globals.game!.reset();
  saveState();
  rerender();
};

export const attachEvents = () => {
  document.body.addEventListener("mousedown", mousedown);
  document.body.addEventListener("mouseup", mouseup);
  document.body.addEventListener("mousemove", mousemove);

  const flipBtn = document.getElementById("flip") as HTMLButtonElement;
  flipBtn.addEventListener("click", () => {
    state.flipped = !state.flipped;
    rerender();
  });

  const undoBtn = document.getElementById("undo") as HTMLButtonElement;
  undoBtn.addEventListener("click", () => {
    globals.game!.undo();
    rerender();
  });

  const fishBtn = document.getElementById("fish") as HTMLButtonElement;
  fishBtn.addEventListener("click", () => {
    goFish();
  });

  const newBtn = document.getElementById("new") as HTMLButtonElement;
  newBtn.addEventListener("click", () => {
    newGame();
  });

  const playasBtn = document.getElementById("playas") as HTMLButtonElement;
  const getTxt = () => {
    const color = state.playerColor === "b" ? "white" : "black";
    return `play as ${color}`;
  };
  playasBtn.innerText = getTxt();
  playasBtn.addEventListener("click", () => {
    state.playerColor = state.playerColor === "b" ? "w" : "b";
    playasBtn.innerText = getTxt();
  });
};
