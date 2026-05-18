import { globals, skillLevels, state } from "./globals.js";

export const goFish = () => {
  const ws = globals.websocket;
  if (!ws || ws.readyState !== WebSocket.OPEN) return;

  if (globals.game!.turn() === state.playerColor) {
    const data = { fen: globals.game!.fen(), level: 20 };
    ws.send(JSON.stringify(data));
  } else {
    const skill = skillLevels[state.opponent];
    if (!skill) return;
    const data = { fen: globals.game!.fen(), level: skill.level, depth: skill.depth };
    ws.send(JSON.stringify(data));
  }
};
