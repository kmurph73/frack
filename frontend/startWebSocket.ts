import { dom } from "./domElements.js";
import { globals } from "./globals.js";

// "info depth 3 seldepth 2 multipv 1 score cp 18 nodes 115 nps 115000 tbhits 0 time 1 pv g8f6"
const parseSf = (msg: string) => {
  const parts = msg.split(" ");
  console.log(parts);
  const depth = parts[2];
  const score = parts[9];
  let best: string | null = null;
  let ponder: string | null = null;

  for (let index = 0; index < parts.length; index++) {
    const part = parts[index]!;
    if (part === "pv") {
      best = parts[index + 1];
      ponder = parts[index + 2];
    } else if (/bestmove$/.test(part)) {
      best = parts[index + 1];
      ponder = parts[index + 3].trim();
    }
  }

  // ponder = ponder ? ponder.trim() : ponder;

  return { depth, score, best, ponder };
};

export const startWebSocket = () => {
  const ws = new WebSocket(`ws://${location.host}`);

  ws.onmessage = function (event) {
    const data = JSON.parse(event.data);

    const { depth, score, best, ponder } = parseSf(data.msg);

    const str = `depth:${depth} score:${score} ${best}`;

    if (dom.msgbox && ponder) {
      dom.msgbox.innerText = str;
    }
  };

  ws.onopen = (event) => {
    ws.send(`{"msg": "sup"}`);
  };

  globals.websocket = ws;
};
