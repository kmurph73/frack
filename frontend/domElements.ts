export type DomElements = {
  canvas: HTMLCanvasElement | null;
  startBtn: HTMLButtonElement | null;
  canvasContext: CanvasRenderingContext2D | null;
  sidebar: HTMLDivElement | null;
  msgbox: HTMLDivElement | null;
  info: HTMLDivElement | null;
  turns: HTMLDivElement | null;
};

export const dom: DomElements = {
  canvas: null,
  startBtn: null,
  canvasContext: null,
  sidebar: null,
  msgbox: null,
  info: null,
  turns: null,
};
