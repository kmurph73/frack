// https://stackoverflow.com/a/15666143/548170

const PIXEL_RATIO = (function (): number {
  // const ctx = document.createElement('canvas').getContext('2d');
  // if (!ctx) {
  //   throw new Error('wtf');
  // }

  const dpr = window.devicePixelRatio || 1;
  const bsr = 1;

  // ctx.webkitBackingStorePixelRatio ||
  // ctx.mozBackingStorePixelRatio ||
  // ctx.msBackingStorePixelRatio ||
  // ctx.oBackingStorePixelRatio ||
  // ctx.backingStorePixelRatio ||
  // 1;

  return dpr / bsr;
})();

const createHiDPICanvas = function (
  width: number,
  height: number,
  ratio?: number
): HTMLCanvasElement {
  if (!ratio) {
    ratio = PIXEL_RATIO;
  }

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("wtf no context");
  }

  canvas.width = width * ratio;
  canvas.height = height * ratio;
  canvas.style.width = width + "px";
  canvas.style.height = height + "px";
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  return canvas;
};

export default createHiDPICanvas;
