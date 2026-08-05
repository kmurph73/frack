import { Chess, Square, Color, Move } from "chess.js";
import { Point } from "./types";

declare global {
  interface Window {
    yar: boolean;
    App: {
      state: State;
      globals: Globals;
      moves: string[];
      export: () => string;
      import: (json: string) => void;
    };
  }
}

export const alphabet = "abcdefgh";
export const sizePx = 600;
export const squareSize = sizePx / 8;
export const halfSquare = squareSize / 2;

export const rgbToString = ({ r, g, b, a }: Rgba): string => {
  if (a == null) {
    return `rgb(${r}, ${g}, ${b})`;
  }

  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

type Rgba = { r: number; g: number; b: number; a?: number };

export const darkColor: Rgba = { r: 119, g: 153, b: 82 };
export const lightColor: Rgba = { r: 237, g: 238, b: 209 };
export const opaqueGray: Rgba = { r: 49, g: 46, b: 43, a: 0.5 };
export const lichessTan: Rgba = { r: 240, g: 217, b: 181 };
export const neonGreen: Rgba = { r: 0, g: 250, b: 50 };
export const opaqueNeonGreen: Rgba = { ...neonGreen, a: 0.5 };
export const neonGreenStr = rgbToString(neonGreen);
export const opaqueNeonGreenStr = rgbToString(opaqueNeonGreen);
export const captureRed: Rgba = { r: 190, g: 30, b: 30, a: 0.85 };
export const captureRedStr = rgbToString(captureRed);
// backdrop for the captured-piece badge — mid-tone so both the black and the
// white sprite (each outlined in the opposite color) stay legible on it
export const captureBadge: Rgba = { ...lichessTan, a: 0.95 };
export const captureBadgeStr = rgbToString(captureBadge);

export const skillLevels: Record<string, { level: number; depth: number }> = {
  sf1: { level: -9, depth: 5 },
  sf2: { level: -5, depth: 5 },
  sf3: { level: -1, depth: 5 },
  sf4: { level: 3, depth: 5 },
  sf5: { level: 7, depth: 5 },
  sf6: { level: 11, depth: 8 },
  sf7: { level: 16, depth: 13 },
  sf8: { level: 20, depth: 22 },
};

type State = {
  selectedSquare: Square | null;
  mousedown: boolean;
  flipped: boolean;
  mousePos: Point | null;
  playerColor: Color;
  moves: Array<Move | "O-O" | "O-O-O">;
  opponent: string;
  autoplay: boolean;
};

type Globals = {
  atlas: HTMLImageElement | null;
  game: Chess | null;
  rng: bigint | null;
  pgns: string[] | null;
  websocket: WebSocket | null;
};

export const state: State = {
  selectedSquare: null,
  mousedown: false,
  flipped: true,
  mousePos: null,
  playerColor: "b",
  moves: [],
  opponent: "gf",
  autoplay: false,
};

export const globals: Globals = {
  atlas: null,
  game: null,
  rng: null,
  pgns: null,
  websocket: null,
};

export const isPlayerTurn = (): boolean => {
  return state.playerColor === globals.game!.turn();
};
