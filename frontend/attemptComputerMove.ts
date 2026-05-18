import { get_move } from "../pkg/frack.js";
import { globals, isPlayerTurn, state } from "./globals.js";
import { Move } from "chess.js";
import { saveState } from "./localStorage.js";
import { goFish } from "./stockfish.js";

// e1,a1
const checkIfCastling = (
  { from, to }: { from: string; to: string },
  color: "w" | "b"
) => {
  if (color === "w" && from === "e1") {
    return to === "a1" ? "O-O-O" : to === "h1" ? "O-O" : null;
  } else if (color === "b" && from === "e8") {
    return to === "a8" ? "O-O-O" : to === "h8" ? "O-O" : null;
  }

  return null;
};

export const attemptComputerMove = (): Move | null => {
  const game = globals.game!;
  if (game.turn() === state.playerColor) {
    return null;
  }

  if (/^sf/.test(state.opponent)) {
    const ws = globals.websocket;
    if (ws && ws.readyState === WebSocket.OPEN) {
      goFish();
      return null;
    }
    // Backend unavailable: fall through to the wasm engine.
  }

  const rng = globals.rng!;

  const depth = state.opponent === "gfw" ? 1 : state.opponent === "gfs" ? 3 : 2;
  const mv = get_move(rng, game.fen(), depth);

  if (!mv.includes(",")) {
    return null;
  }

  const [from, to] = mv.split(",");

  let move = game.move({ from, to });
  if (move != null) {
    state.moves.push(move);
    return move;
  }

  const castle = checkIfCastling({ from, to }, game.turn());
  if (castle) {
    const result = game.move(castle);
    if (result) {
      state.moves.push(result);
    }
  }

  saveState();

  return null;
};
