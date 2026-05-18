import { dom } from "./domElements.js";
import {
  alphabet,
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
import { Color, Square } from "chess.js";
import { ChessFile, FileAndRank, Point } from "./types.js";
import { fileAndRankToPos, then } from "./util.js";

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

export const drawLastMove = () => {
  const lastMove = state.moves.at(-1);
  if (lastMove == null || lastMove === "O-O" || lastMove === "O-O-O") {
    return;
  }

  const { from, to } = lastMove;
  let [file, rankStr] = from.split("");

  let rank = parseInt(rankStr);

  let color = getSquareColor({ file: file as ChessFile, rank });
  let squareColor = color === "b" ? neonGreenStr : opaqueNeonGreenStr;

  let pos = fileAndRankToPos({
    rank,
    file: file as ChessFile,
  });

  drawSquare(pos, squareColor);

  [file, rankStr] = to.split("");

  rank = parseInt(rankStr);

  color = getSquareColor({ file: file as ChessFile, rank });
  squareColor = color === "b" ? neonGreenStr : opaqueNeonGreenStr;

  pos = fileAndRankToPos({
    rank,
    file: file as ChessFile,
  });

  drawSquare(pos, squareColor);
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
