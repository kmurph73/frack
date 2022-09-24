import { globals } from "./globals.js";

export const goFish = () => {
  const data = { fen: globals.game!.fen() };
  globals.websocket!.send(JSON.stringify(data));
};
