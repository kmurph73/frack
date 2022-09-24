import { Chess, Square, Color, Move } from "./lib/chess.js";
import { Point } from "./types";

declare global {
  interface Window {
    main: () => void;
    yar: boolean;
    App: {
      state: State;
      globals: Globals;
      moves: string[];
    };
  }
}

export const alphabet = "abcdefgh";
export const sizePx = 600;
export const squareSize = sizePx / 8;
export const halfSquare = squareSize / 2;

type Rgba = { r: number; g: number; b: number; a?: number };

export const darkColor: Rgba = { r: 119, g: 153, b: 82 };
export const lightColor: Rgba = { r: 237, g: 238, b: 209 };
export const opaqueGray: Rgba = { r: 49, g: 46, b: 43, a: 125 };
export const lichessTan: Rgba = { r: 240, g: 217, b: 181 };

export const rgbToString = ({ r, g, b, a }: Rgba): string => {
  if (a == null) {
    return `rgb(${r}, ${g}, ${b})`;
  }

  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

type State = {
  selectedSquare: Square | null;
  mousedown: boolean;
  flipped: boolean;
  mousePos: Point | null;
  playerColor: Color;
  moves: Move[];
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
};

export const globals: Globals = {
  atlas: null,
  game: null,
  rng: null,
  pgns: null,
  websocket: null,
};
