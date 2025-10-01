import { Point } from "chart.js";
import { Chart } from "chart.js/auto";
import { getRelativePosition } from "chart.js/helpers";


export enum ZoomerEventState {
  NULL,
  DOWN,
  UP,
  MOVE,
  NOTHING
}







function pointFromEvent(chart: Chart, event: Event): Point {
  const canvasPosition = getRelativePosition(event, chart);

  // Substitute the appropriate scale IDs
  const dataX = chart.scales.x.getValueForPixel(canvasPosition.x);
  const dataY = chart.scales.y.getValueForPixel(canvasPosition.y);
  console.log(`${event.type} at ${dataX}, ${dataY}`);
  return { x : dataX, y : dataY };
}

export class ZoomerState {
  readonly position: Point|null;
  readonly target: Element;
  readonly timestamp: number;
  readonly state : ZoomerEventState;

  constructor(chart : Chart, event: Event, state: ZoomerEventState) {
    this.state = state;
    this.target = chart.ctx.canvas;
    this.timestamp = event.timeStamp;
    this.position = (this.state===ZoomerEventState.NULL) ? null : pointFromEvent(chart,event);
  }

  distance(other: ZoomerState) : number {
    let p1=this.position;
    let p2 = other.position;
    if(p1===null || p2===null) { return NaN; }
    return Math.hypot(p1.x-p2.x,p1.y-p2.y);
  }
  timeDelta(other: ZoomerState) : number {
    return Math.abs(this.timestamp-other.timestamp)/1.0e6;
  }

  duplicates(other: ZoomerState) : boolean {
    return this.state===other.state && this.distance(other)<1.0e6 && this.timeDelta(other) < 2.0e3;
  }


  toString() : string {
    return `Position (${this.position?.x},${this.position?.y}) @ ${this.timestamp} : ${this.state} on ${this.target}`;
  }
}

export class ZoomerEvent extends Event {
  readonly state : ZoomerState;
  constructor(chart : Chart, event: Event, state: ZoomerEventState) {
    super('zoomer-event');
    this.state = new ZoomerState(chart,event,state);
  }
}

export const ZoomerEventTarget : Element = document.body;


