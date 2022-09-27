import { attemptComputerMove } from "./attemptComputerMove.js";
import { dom } from "./domElements.js";
import { globals, state } from "./globals.js";
import { Move, Piece } from "./lib/chess.js";
import { render } from "./main.js";
import { saveState } from "./localStorage.js";
import { goFish } from "./stockfish.js";
import { FileAndRank } from "./types.js";
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
    state.moves.push(mv);
    saveState();

    const result = attemptComputerMove();
    if (result) {
      setTimeout(() => {
        if (game.isCheckmate()) {
          alert("GG");
        }
      }, 100);
    }
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

  const startBtn = document.getElementById("start") as HTMLButtonElement;
  startBtn.addEventListener("click", () => {
    startGame();
  });

  const startGame = () => {
    state.playing = !state.playing;
    const txt = state.playing ? "stop" : "start";
    startBtn.innerText = txt;
    attemptComputerMove();
    saveState();
    render();
  };
};
