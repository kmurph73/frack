import { dom } from "./domElements.js";
import {
  alphabet,
  captureBadgeStr,
  captureRedStr,
  darkColor,
  globals,
  lightColor,
  neonGreen,
  neonGreenStr,
  opaqueNeonGreenStr,
  rgbToString,
  squareSize,
  state,
} from "./globals.js";
import { Color, PieceSymbol, Square } from "chess.js";
import { ChessFile, FileAndRank, Point } from "./types.js";
import { fileAndRankToPos, mapCompact, then } from "./util.js";
import { getAtlasCoords } from "./getAtlasCoords.js";

type Thing = {
  colorType: "dark" | "light";
  file: ChessFile;
  rank: number;
};

const drawSquare = ({ x, y }: Point, color: string) => {
  const ctx = dom.canvasContext!;

  let xOffset = x * squareSize;
  let yOffset = y * squareSize;

  ctx.fillStyle = color;
  ctx.fillRect(xOffset, yOffset, squareSize, squareSize);
};

const getSquareColor = ({ file, rank }: FileAndRank): Color => {
  const fileNum = alphabet.indexOf(file);
  const rankNum = rank - 1;
  const rankEven = rankNum % 2 === 0;
  const fileEven = fileNum % 2 === 0;

  if ((rankEven && fileEven) || (!rankEven && !fileEven)) {
    return "b";
  } else {
    return "w";
  }
};

const squareToPos = (square: string): Point => {
  const [file, rankStr] = square.split("");

  return fileAndRankToPos({ file: file as ChessFile, rank: parseInt(rankStr) });
};

const highlightSquare = (square: string) => {
  const [file, rankStr] = square.split("");
  const rank = parseInt(rankStr);

  const color = getSquareColor({ file: file as ChessFile, rank });
  const squareColor = color === "b" ? neonGreenStr : opaqueNeonGreenStr;

  drawSquare(squareToPos(square), squareColor);
};

type Capture = {
  square: string;
  piece: PieceSymbol;
  color: Color;
  latest: boolean;
};

// how much the previous ply's capture is dimmed relative to the latest one
const staleAlpha = 0.6;

const getCapture = (index: number): Capture | null => {
  const move = state.moves.at(index);
  if (move == null || typeof move === "string" || !move.captured) {
    return null;
  }

  const { from, to, captured, color, flags } = move;

  // en passant takes a pawn that never stood on `to` — it sat on the
  // destination file, back on the rank the capturing pawn came from.
  const square = flags?.includes("e") ? `${to[0]}${from[1]}` : to;

  return {
    square,
    piece: captured,
    color: color === "w" ? "b" : "w",
    latest: index === -1,
  };
};

// the last two plies, not just the last: the opponent answers instantly, so
// marking only the last move means you never see the capture you just made
const getRecentCaptures = (): Capture[] => mapCompact([-1, -2], getCapture);

// wedges in the four corners, so the piece standing on the square doesn't hide them
const drawCaptureMarker = ({ square, latest }: Capture) => {
  const ctx = dom.canvasContext!;
  const { x, y } = squareToPos(square);

  const left = x * squareSize;
  const top = y * squareSize;
  const right = left + squareSize;
  const bottom = top + squareSize;
  const size = squareSize / 3.5;

  const corners = [
    [left, top, 1, 1],
    [right, top, -1, 1],
    [left, bottom, 1, -1],
    [right, bottom, -1, -1],
  ];

  ctx.globalAlpha = latest ? 1 : staleAlpha;
  ctx.fillStyle = captureRedStr;

  for (const [cornerX, cornerY, xDir, yDir] of corners) {
    ctx.beginPath();
    ctx.moveTo(cornerX, cornerY);
    ctx.lineTo(cornerX + xDir * size, cornerY);
    ctx.lineTo(cornerX, cornerY + yDir * size);
    ctx.closePath();
    ctx.fill();
  }

  ctx.globalAlpha = 1;
};

// the piece that was taken, as a badge in the corner of the square it died on
const drawCaptureBadge = (
  img: HTMLImageElement,
  { square, piece, color, latest }: Capture
) => {
  const ctx = dom.canvasContext!;
  const { x, y } = squareToPos(square);

  const radius = squareSize / 4.6;
  const inset = radius + 2;
  // latest on the right, the ply before it on the left — a recapture puts both
  // on the same square, and opposite corners keep them from colliding
  const centerX = latest
    ? (x + 1) * squareSize - inset
    : x * squareSize + inset;
  const centerY = (y + 1) * squareSize - inset;

  ctx.globalAlpha = latest ? 1 : staleAlpha;

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.fillStyle = captureBadgeStr;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = captureRedStr;
  ctx.stroke();

  const { x: sx, y: sy, w, h } = getAtlasCoords(color, piece);
  const iconSize = radius * 1.7;

  ctx.drawImage(
    img,
    sx,
    sy,
    w,
    h,
    centerX - iconSize / 2,
    centerY - iconSize / 2,
    iconSize,
    iconSize
  );

  ctx.globalAlpha = 1;
};

// drawn after the pieces, otherwise the capturing piece covers the badge
export const drawCapturedPiece = (img: HTMLImageElement) => {
  for (const capture of getRecentCaptures()) {
    drawCaptureBadge(img, capture);
  }
};

export const drawLastMove = () => {
  const lastMove = state.moves.at(-1);

  if (lastMove != null && typeof lastMove !== "string") {
    highlightSquare(lastMove.from);
    highlightSquare(lastMove.to);
  }

  for (const capture of getRecentCaptures()) {
    drawCaptureMarker(capture);
  }
};

export const drawBoard = () => {
  const ctx = dom.canvasContext!;
  const canvas = dom.canvas!;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const light = rgbToString(lightColor);
  const dark = rgbToString(darkColor);

  const rows: Thing[][] = [];

  ctx.font = "24px serif";

  for (let x = 0; x < 8; x++) {
    const row: Thing[] = [];
    rows.push(row);

    for (let y = 0; y < 8; y++) {
      const chess_y = Math.abs(8 - y);
      let xEven = x % 2 == 0;
      let yEven = y % 2 == 0;
      let xOdd = !xEven;
      let yOdd = !yEven;
      let color = (yEven && xEven) || (yOdd && xOdd) ? light : dark;

      const colorType = color === light ? "light" : "dark";
      color = color === light ? dark : light;

      ctx.fillStyle = color;
      let file = alphabet[x] as ChessFile;
      let rank = chess_y;

      row.push({ colorType, file, rank });
    }
  }

  for (let x = 0; x < rows.length; x++) {
    const row = rows[x];

    for (let y = 0; y < row.length; y++) {
      const { colorType, file, rank } = row[y];
      const color = colorType === "light" ? light : dark;

      let xOffset = x * squareSize;
      let yOffset = y * squareSize;

      ctx.fillStyle = color;
      ctx.fillRect(xOffset, yOffset, squareSize, squareSize);

      ctx.fillStyle = color === light ? dark : light;

      if (x === 0) {
        const rankStr = then(state.flipped, (flip) => {
          if (flip) {
            return Math.abs(9 - rank).toString();
          } else {
            return rank.toString();
          }
        });

        ctx.fillText(rankStr, xOffset, yOffset + 20);
      }

      if (y === 7) {
        const fileStr = then(state.flipped, (flip) => {
          if (flip) {
            let i = alphabet.indexOf(file);
            i = Math.abs(7 - i);
            return alphabet[i];
          } else {
            return file;
          }
        });

        ctx.fillText(fileStr, xOffset + squareSize - 12, yOffset + squareSize);
      }
    }
  }
};
