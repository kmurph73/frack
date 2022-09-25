import { get_move } from "../pkg/frack.js";
import { globals, state } from "./globals.js";
import { Move } from "./lib/chess.js";
import { saveState } from "./localStorage.js";

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
  if (!state.playing) {
    return null;
  }

  const game = globals.game!;
  if (game.turn() === state.playerColor) {
    return null;
  }

  const rng = globals.rng!;

  const mv = get_move(rng, game.fen());

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
    state.moves.push(castle);
    return game.move(castle);
  }

  saveState();

  return null;
};
