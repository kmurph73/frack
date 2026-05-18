import { attemptComputerMove } from "./attemptComputerMove.js";
import { dom } from "./domElements.js";
import { globals, state } from "./globals.js";
import { Move, Piece } from "chess.js";
import { render } from "./main.js";
import { saveState } from "./localStorage.js";
import { goFish } from "./stockfish.js";
import { FileAndRank } from "./types.js";
import { get_rng } from "../pkg/frack.js";
import { generateRandomBigInt } from "./lib/randomBigInt.js";
import {
  getCursorPosition,
  chessPosFromPoint,
  squareFromPos,
  isWithinCanvas,
  attemptMove,
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
  render();
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
  if (square === state.selectedSquare) {
    state.selectedSquare = null;
    render();
    return;
  }
  const piece = game.get(state.selectedSquare);
  if (!piece) {
    return;
  }
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
    state.moves.push(mv);
    saveState();
  }

  state.selectedSquare = null;
  render();
};

const mousemove = (e: MouseEvent) => {
  if (!isWithinCanvas(e)) {
    return;
  }

  if (state.selectedSquare && state.mousedown) {
    const pos = getCursorPosition(dom.canvas!, e);
    state.mousePos = pos;
    render();
  }
};

const clickBox = (e: MouseEvent) => {
  e.preventDefault();
  if (!e.target) {
    return;
  }

  const target = e.target as HTMLElement;
  if (target.getAttribute("id") === "domove") {
    const move = target.innerText.trim();
    attemptMove(move);
  }
};

const newGame = () => {
  state.moves = [];
  globals.game!.reset();
  saveState();
  render();
};

export const attachEvents = () => {
  document.body.addEventListener("mousedown", mousedown);
  document.body.addEventListener("mouseup", mouseup);
  document.body.addEventListener("mousemove", mousemove);

  const msgbox = document.getElementById("msgbox") as HTMLDivElement;
  msgbox.addEventListener("click", clickBox);

  const selectOppo = document.getElementById("oppo") as HTMLSelectElement;
  if (!__HAS_BACKEND__) {
    for (const opt of Array.from(selectOppo.options)) {
      if (opt.value.startsWith("sf")) opt.remove();
    }
    if (state.opponent.startsWith("sf")) state.opponent = "gf";
  }
  selectOppo.addEventListener("change", (e) => {
    state.opponent = selectOppo.value;
    saveState();
  });
  selectOppo.value = state.opponent;

  const flipBtn = document.getElementById("flip") as HTMLButtonElement;
  flipBtn.addEventListener("click", () => {
    state.flipped = !state.flipped;
    render();
  });

  const undoBtn = document.getElementById("undo") as HTMLButtonElement;
  undoBtn.addEventListener("click", () => {
    const mv = globals.game!.undo();
    if (mv) {
      state.moves.pop();
      render();
    } else {
      alert("couldnt undo");
    }
  });

  const fishBtn = document.getElementById("fish") as HTMLButtonElement;
  if (__HAS_BACKEND__) {
    fishBtn.addEventListener("click", () => {
      goFish();
    });
  } else {
    fishBtn.remove();
  }

  const newBtn = document.getElementById("new") as HTMLButtonElement;
  newBtn.addEventListener("click", () => {
    newGame();
  });

  const playasBtn = document.getElementById("playas") as HTMLButtonElement;
  const refreshPlayasText = () => {
    const color = state.playerColor === "b" ? "white" : "black";
    playasBtn.innerText = `play as ${color}`;
  };
  refreshPlayasText();
  playasBtn.addEventListener("click", () => {
    state.playerColor = state.playerColor === "b" ? "w" : "b";
    refreshPlayasText();
  });

  const newGameBtn = document.getElementById("newgame") as HTMLButtonElement;
  newGameBtn.addEventListener("click", () => {
    globals.game!.reset();
    state.moves = [];
    state.playerColor = Math.random() < 0.5 ? "w" : "b";
    globals.rng = generateRandomBigInt(1n, get_rng());
    refreshPlayasText();
    saveState();
    render();
  });

  const nextBtn = document.getElementById("next") as HTMLButtonElement;
  nextBtn.addEventListener("click", () => {
    const result = attemptComputerMove();
    saveState();
    render();
    if (result) {
      setTimeout(() => {
        if (globals.game!.isCheckmate()) {
          alert("GG");
        }
      }, 100);
    }
  });
};
