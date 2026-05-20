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
  safeMove,
} from "./util.js";

const pointerDown = (clientX: number, clientY: number) => {
  const pos = getCursorPosition(dom.canvas!, clientX, clientY);
  const chessPos = chessPosFromPoint(pos);
  if (!chessPos) {
    return;
  }

  state.mousedown = true;
  state.mousePos = pos;
  state.selectedSquare = squareFromPos(chessPos);
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

const pointerUp = (clientX: number, clientY: number) => {
  if (!state.selectedSquare) {
    return;
  }

  const pos = getCursorPosition(dom.canvas!, clientX, clientY);
  const chessPos = chessPosFromPoint(pos);
  state.mousedown = false;
  if (!chessPos) {
    state.selectedSquare = null;
    render();
    return;
  }

  const game = globals.game!;

  const square = squareFromPos(chessPos);
  if (square === state.selectedSquare) {
    state.selectedSquare = null;
    render();
    return;
  }
  const piece = game.get(state.selectedSquare);
  if (!piece) {
    state.selectedSquare = null;
    render();
    return;
  }
  const promote = isPromotionAttempt(piece, chessPos);

  let mv: Move | null = null;

  if (promote) {
    const choice = prompt(`promote ${promotions.join(", ")}`);

    if (choice && promotions.includes(choice as any)) {
      mv = safeMove(game, state.selectedSquare, square, choice);
    }
  } else {
    mv = safeMove(game, state.selectedSquare, square);
  }

  if (mv) {
    state.moves.push(mv);
    saveState();

    if (state.autoplay && game.turn() !== state.playerColor) {
      const result = attemptComputerMove();
      saveState();
      state.selectedSquare = null;
      render();
      if (result && game.isCheckmate()) {
        setTimeout(() => alert("GG"), 100);
      }
      return;
    }
  }

  state.selectedSquare = null;
  render();
};

const pointerMove = (clientX: number, clientY: number) => {
  if (state.selectedSquare && state.mousedown) {
    state.mousePos = getCursorPosition(dom.canvas!, clientX, clientY);
    render();
  }
};

const mousedown = (e: MouseEvent) => {
  if (!isWithinCanvas(e)) {
    return;
  }
  pointerDown(e.clientX, e.clientY);
};

const mouseup = (e: MouseEvent) => {
  pointerUp(e.clientX, e.clientY);
};

const mousemove = (e: MouseEvent) => {
  if (!isWithinCanvas(e)) {
    return;
  }
  pointerMove(e.clientX, e.clientY);
};

const touchstart = (e: TouchEvent) => {
  if (!isWithinCanvas(e)) {
    return;
  }
  const touch = e.touches[0];
  if (!touch) {
    return;
  }
  e.preventDefault();
  pointerDown(touch.clientX, touch.clientY);
};

const touchmove = (e: TouchEvent) => {
  if (!state.selectedSquare || !state.mousedown) {
    return;
  }
  const touch = e.touches[0];
  if (!touch) {
    return;
  }
  e.preventDefault();
  pointerMove(touch.clientX, touch.clientY);
};

const touchend = (e: TouchEvent) => {
  if (!state.selectedSquare) {
    return;
  }
  const touch = e.changedTouches[0];
  if (!touch) {
    return;
  }
  e.preventDefault();
  pointerUp(touch.clientX, touch.clientY);
};

const touchcancel = () => {
  if (state.selectedSquare || state.mousedown) {
    state.selectedSquare = null;
    state.mousedown = false;
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
  state.flipped = state.playerColor === "b";
  saveState();
  render();
};

export const attachEvents = () => {
  document.body.addEventListener("mousedown", mousedown);
  document.body.addEventListener("mouseup", mouseup);
  document.body.addEventListener("mousemove", mousemove);

  document.body.addEventListener("touchstart", touchstart, { passive: false });
  document.body.addEventListener("touchmove", touchmove, { passive: false });
  document.body.addEventListener("touchend", touchend, { passive: false });
  document.body.addEventListener("touchcancel", touchcancel);

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

  const autoplayChk = document.getElementById("autoplay") as HTMLInputElement;
  autoplayChk.checked = state.autoplay;
  autoplayChk.addEventListener("change", () => {
    state.autoplay = autoplayChk.checked;
    saveState();
  });

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
      saveState();
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
    saveState();
    render();
    if (globals.game!.turn() !== state.playerColor) {
      const result = attemptComputerMove();
      saveState();
      render();
      if (result && globals.game!.isCheckmate()) {
        setTimeout(() => alert("GG"), 100);
      }
    }
  });

  const newGameBtn = document.getElementById("newgame") as HTMLButtonElement;
  newGameBtn.addEventListener("click", () => {
    globals.game!.reset();
    state.moves = [];
    state.playerColor = Math.random() < 0.5 ? "w" : "b";
    state.flipped = state.playerColor === "b";
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
