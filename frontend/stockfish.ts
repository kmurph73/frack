import { globals, skillLevels, state } from "./globals.js";

export const goFish = () => {
  if (globals.game!.turn() === state.playerColor) {
    const data = { fen: globals.game!.fen(), level: 20 };
    globals.websocket!.send(JSON.stringify(data));
  } else {
    const { level, depth } = skillLevels[state.opponent];
    const data = { fen: globals.game!.fen(), level, depth };
    globals.websocket!.send(JSON.stringify(data));
  }
};
