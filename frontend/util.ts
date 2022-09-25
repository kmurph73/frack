import { alphabet, squareSize, state } from "./globals.js";
import { Color, Square } from "./lib/chess.js";
import { ChessFile, FileAndRank, Point } from "./types";

export const flipRank = (rank: number) => {
  return Math.abs(8 - rank);
};

export const isWithinCanvas = (e: MouseEvent): boolean => {
  return (e.composedPath()[0] as HTMLElement).nodeName === "CANVAS";
};

/**
 * transform a value via callback
 *
 * @doctest
 * ```js
 * t.is(then(1, (n) => n + 1), 2)
 * ```
 */
export const then = <A, B>(a: A, cb: (a: A) => B): B => {
  return cb(a);
};

// https://stackoverflow.com/a/18053642/548170
export function getCursorPosition(
  canvas: HTMLCanvasElement,
  event: MouseEvent
) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  return { x, y };
}

export const chessPosFromPoint = (pos: Point): FileAndRank | null => {
  let x = Math.floor(pos.x / squareSize);
  let y = Math.floor(pos.y / squareSize);
  y = Math.abs(7 - y);
  if (x >= 0 && x < 8 && y >= 0 && y < 8) {
    if (state.flipped) {
      x = Math.abs(7 - x);
      y = Math.abs(7 - y);
    }

    const file = alphabet[x] as unknown as ChessFile;

    return { file, rank: y + 1 };
  }

  return null;
};

export const squareFromPos = ({ rank, file }: FileAndRank): Square => {
  return `${file}${rank}` as Square;
};

export const getPieceFromPos = (pos: Point) => {
  const p = chessPosFromPoint(pos);
  // squareFromPos(p);
};

export const posFromSquare = (square: Square): Point => {
  const [letter, n] = square.split("");

  const x = alphabet.indexOf(letter);
  const y = parseInt(n);

  return { x, y };
};

export const fileAndRankToPos = ({ rank, file }: FileAndRank): Point => {
  let y = rank - 1;
  let x = alphabet.indexOf(file);

  if (state.flipped) {
    x = Math.abs(7 - x);
  } else {
    y = Math.abs(7 - y);
  }

  return { x, y };
};
/**
 * map & compact an array in one go
 *
 * @doctest
 * ```js
 * const arr = [1, 2, 3, 4];
 * const r = mapCompact(arr, n => n % 2 === 0 ? n * 2 : null);
 * t.deepEqual(r, [4, 8]);
 * ```
 */
export const mapCompact = <A, B>(arr: A[], cb: (t: A) => B | null): B[] => {
  const b = [];

  for (let index = 0; index < arr.length; index++) {
    const a = arr[index]!;

    const r = cb(a);

    if (r) {
      b.push(r);
    }
  }

  return b;
};
