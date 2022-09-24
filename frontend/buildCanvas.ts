import { dom } from "./domElements.js";
import createHiDPICanvas from "./createHiDpiCanvas.js";
import { sizePx } from "./globals.js";

export const buildCanvas = () => {
  const canvas = createHiDPICanvas(sizePx, sizePx);
  dom.canvas = canvas;
  const canvashold = document.getElementById("canvashold");

  if (!canvashold) {
    throw new Error("wtf ele should be here");
  }

  canvashold.append(canvas);
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("wft no contexst");
  }

  dom.canvasContext = ctx;

  // ctx.translate(0.5, 0.5);

  // ctx.font = "12px Arial";
  // ctx.strokeStyle = "green";

  // ctx.fillRect(20, 20, 50, 50);
  // ctx.beginPath();
  // ctx.rect(20, 20, 150, 100);
  // ctx.stroke();
};
