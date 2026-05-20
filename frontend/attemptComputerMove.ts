import { get_move } from "../pkg/frack.js";
import { globals, isPlayerTurn, state } from "./globals.js";
import { Move, Square } from "chess.js";
import { saveState } from "./localStorage.js";
import { goFish } from "./stockfish.js";
import { safeMove } from "./util.js";

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
  const strong = state.opponent === "gfs";
  const mv = get_move(rng, game.fen(), depth, strong);

  if (!mv.includes(",")) {
    return null;
  }

  const [from, to] = mv.split(",") as [Square, Square];

  const move = safeMove(game, from, to);
  if (move != null) {
    state.moves.push(move);
    saveState();
    return move;
  }

  saveState();
  return null;
};
