import { dom } from "./domElements.js";
import { globals } from "./globals.js";

export const drawMoves = () => {
  const g = globals.game!;

  const moves = g.history();
  const html: string[] = [];
  let cnt = 1;
  for (let index = 0; index < moves.length; index += 2) {
    const mv1 = moves[index];
    const mv2 = moves[index + 1];

    const num = Math.ceil((index + 1) / 2);

    html.push(
      `<div class='d-flex'>
        <div class="me-1 num">${num}: </div>
        <div class="white me-1">${mv1}</div>
        ${mv2 ? `<div class="black me-1">${mv2}</div>` : ""}
      </div>`
    );
  }

  dom.turns!.innerHTML = html.join("");
  const color = g.turn() === "b" ? "black" : "white";
  dom.info!.innerHTML = `<span class="${color}">${color}'s turn</span>`;
};
