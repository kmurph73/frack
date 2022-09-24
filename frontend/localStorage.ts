import { globals, state } from "./globals.js";
import { Color } from "./lib/chess.js";

type LocalState = {
  playerColor: Color;
  flipped: boolean;
  pgn: string;
};

export const saveState = () => {
  const pgn = globals.game!.pgn();
  const s = { playerColor: state.playerColor, flipped: state.flipped, pgn };

  localStorage.setItem("state", JSON.stringify(s));
};

export const loadState = () => {
  const str = localStorage.getItem("state");
  if (str == null) {
    return;
  }

  const { playerColor, flipped, pgn } = JSON.parse(str) as LocalState;

  state.playerColor = playerColor;
  state.flipped = flipped;
  globals.game!.loadPgn(pgn);
};
