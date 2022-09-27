import init, { get_rng } from "../pkg/frack.js";
import { attachEvents } from "./handleEvents.js";
import { buildCanvas } from "./buildCanvas.js";
import { drawBoard, drawLastMove } from "./drawBoard.js";
import { drawPieces } from "./drawPieces.js";
import { globals, state } from "./globals.js";
import { Chess } from "./lib/chess.js";
import { generateRandomBigInt } from "./lib/randomBigInt.js";
import { attemptComputerMove } from "./attemptComputerMove.js";
import { dom } from "./domElements.js";
import { drawMoves } from "./drawMoves.js";
import { startWebSocket } from "./startWebSocket.js";
import { loadState } from "./localStorage.js";

const moves: string[] = [];
window.App = { state, globals, moves };

export const render = () => {
  const g = globals.game!;
  drawBoard();
  drawLastMove();
  drawPieces(globals.atlas!, g);
  drawMoves();
};

const pgn = `1. Nf3 d5 2. g3 c5 3. d4 Qa5+ 4. Nbd2 e6 5. a3 c4 6. Ne5 f6 7. b4 Qc7 8. Nef3 c3 9. Nb3 b6 10. Bh3 Bd6 11. O-O Ne7 12. Bg2 O-O 13. Qd3 Ng6 14. e4 Nd7 15. Re1 Bb7 16. exd5 Bxd5 17. Qa6 Bxb3 18. cxb3 c2 19. Bh3 e5 20. Bf5 exd4 21. Be6+ Kh8 22. Bf5 Qc3 23. Qb7 Qxa1 24. Qxd7 d3 25. Bh6`;

const main = async () => {
  await init();

  startWebSocket();

  const file = await fetch("pgns.txt");
  const txt = await file.text();
  globals.pgns = txt.split("\n\n");

  dom.info = document.getElementById("info") as HTMLDivElement;
  dom.turns = document.getElementById("turns") as HTMLDivElement;

  const sidebar = document.getElementById("sidebar") as HTMLDivElement;
  if (!sidebar) {
    throw new Error("no sidebar");
  }
  dom.sidebar = sidebar;

  const msgbox = document.getElementById("msgbox") as HTMLDivElement;
  dom.msgbox = msgbox;

  const chess = new Chess();
  // chess.loadPgn(pgn);
  // const fen = "r1b4B/ppp4p/3kp3/8/4p3/2P3P1/P1P1PP1P/R3K2R w KQ - 1 15";
  // chess.load(fen);
  // state.playerTurn = "w";

  let rng = get_rng();
  rng = generateRandomBigInt(1n, rng);

  globals.rng = rng;
  globals.game = chess;

  loadState();

  buildCanvas();
  drawBoard();
  drawLastMove();
  drawMoves();

  const imgAtlas = new Image();
  globals.atlas = imgAtlas;

  attachEvents();

  imgAtlas.onload = () => {
    drawPieces(imgAtlas, chess);
  };

  imgAtlas.src = "/chesspieces.png";
};

window.main = main;

await init();
