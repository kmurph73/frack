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

type Snapshot = LocalState & {
  version: 1;
  rng: string;
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

export const exportSnapshot = (): string => {
  const snap: Snapshot = {
    version: 1,
    playerColor: state.playerColor,
    flipped: state.flipped,
    pgn: globals.game!.pgn(),
    moves: state.moves,
    oppo: state.opponent,
    autoplay: state.autoplay,
    rng: globals.rng!.toString(),
  };
  return JSON.stringify(snap);
};

export const importSnapshot = (json: string): void => {
  const snap = JSON.parse(json) as Snapshot;
  if (snap.version !== 1) {
    throw new Error(`unsupported snapshot version: ${snap.version}`);
  }
  state.moves = snap.moves || [];
  state.playerColor = snap.playerColor;
  state.flipped = snap.flipped;
  state.opponent = snap.oppo || "gf";
  state.autoplay = snap.autoplay ?? false;
  globals.game!.loadPgn(snap.pgn);
  globals.rng = BigInt(snap.rng);
  saveState();
};
