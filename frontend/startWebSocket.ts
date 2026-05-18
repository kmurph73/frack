import { get_move } from "../pkg/frack.js";
import { dom } from "./domElements.js";
import { globals, isPlayerTurn, state } from "./globals.js";
import { render } from "./main.js";
import { attemptMove, getStockfishConf, then } from "./util.js";

// "info depth 3 seldepth 2 multipv 1 score cp 18 nodes 115 nps 115000 tbhits 0 time 1 pv g8f6"
const parseSf = (msg: string) => {
  const parts = msg.split(" ");
  const depth = then(parseInt(parts[2]), (d) => d || null);
  let score = "?";
  let best: string | null = null;
  let ponder: string | null = null;

  for (let index = 0; index < parts.length; index++) {
    const part = parts[index]!;
    if (part === "pv") {
      best = parts[index + 1];
      ponder = parts[index + 2];
    } else if (/bestmove$/.test(part)) {
      best = parts[index + 1];
      ponder = then(parts[index + 3], (p) => (p ? p.trim() : null));
    } else if (part === "cp") {
      score = parts[index + 1];
    }
  }

  if (best) {
    best = best.split("\n")[0];
  }

  return { depth, score, best, ponder };
};

export const startWebSocket = () => {
  const proto = location.protocol === "https:" ? "wss:" : "ws:";
  let ws: WebSocket;
  try {
    ws = new WebSocket(`${proto}//${location.host}`);
  } catch {
    return;
  }

  ws.onerror = () => {
    // No backend reachable (e.g. static deploy). sf* opponents will fall back
    // to the wasm engine in attemptComputerMove / goFish.
  };

  ws.onmessage = function (event) {
    const data = JSON.parse(event.data);

    const messages = data.msg.split("\n");
    for (let index = 0; index < messages.length; index++) {
      const msg = messages[index]!;
      console.log(msg);

      const { depth, score, best } = parseSf(msg);

      if (dom.msgbox && depth) {
        const str = `depth:${depth} score:${score} <a id='domove' href='#'>${best}</a>`;
        dom.msgbox.innerHTML = str;

        if (best && !isPlayerTurn()) {
          const conf = getStockfishConf();

          if (conf && conf.depth === depth) {
            attemptMove(best);
          }
        }
      }
    }
  };

  ws.onopen = (event) => {
    ws.send(`{"msg": "sup"}`);
  };

  globals.websocket = ws;
};
