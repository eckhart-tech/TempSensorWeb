
import { Graphic } from "../graph";


export type EventKey = keyof HTMLElementEventMap;

export class GraphicEvent extends Event {
  base: Graphic;
  canvas: HTMLCanvasElement;
  x : number;
  y : number;
  readonly raw : Event|null;

  constructor(name='GraphicEvent', base: Graphic, x: number, y: number, raw : Event|null) {
    super(name);
    this.base=base;
    this.canvas=base.canvas;
    this.x=x;
    this.y=y;
    this.raw=raw;
  }
}












