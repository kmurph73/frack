import { globals, skillLevels, state } from "./globals.js";

export const goFish = () => {
  if (globals.game!.turn() === state.playerColor) {
    const data = { fen: globals.game!.fen(), level: 20 };
    globals.websocket!.send(JSON.stringify(data));
  } else {
    const skill = skillLevels[state.opponent];
    if (!skill) return;
    const data = { fen: globals.game!.fen(), level: skill.level, depth: skill.depth };
    globals.websocket!.send(JSON.stringify(data));
  }
};
