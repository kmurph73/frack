import { globals, state } from "./globals.js";
import { Color, Move } from "chess.js";

type LocalState = {
  playerColor: Color;
  flipped: boolean;
  pgn: string;
  moves: Array<Move | "O-O" | "O-O-O">;
  oppo: string | undefined;
  autoplay: boolean | undefined;
};

export const saveState = () => {
  const pgn = globals.game!.pgn();
  const moves = state.moves;
  const s: LocalState = {
    playerColor: state.playerColor,
    flipped: state.flipped,
    pgn,
    moves,
    oppo: state.opponent,
    autoplay: state.autoplay,
  };

  localStorage.setItem("state", JSON.stringify(s));
};

export const loadState = () => {
  const str = localStorage.getItem("state");
  if (str == null) {
    return;
  }

  const { playerColor, flipped, pgn, moves, oppo, autoplay } = JSON.parse(
    str
  ) as LocalState;

  state.moves = moves || [];
  state.playerColor = playerColor;
  state.flipped = flipped;
  state.opponent = oppo || "gf";
  state.autoplay = autoplay ?? false;
  globals.game!.loadPgn(pgn);
};
