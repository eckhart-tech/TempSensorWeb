import { Chart } from "chart.js/auto";
import { Point } from "chart.js";
import { getRelativePosition } from "chart.js/helpers";

export type EventKind = keyof HTMLElementEventMap;
export type EventTranslations = { [key: string]: EventKind[] };
export type EventEntry = [string, string[]];

export const EventTranslation: EventTranslations = {
  up: ["keyup", "mouseup", "pointerup", "touchend"],
  down: ["keydown", "mousedown", "pointerdown", "touchstart"],
  move: ["mousemove", "pointermove", "touchmove"],
  cancel: ["mouseleave", "pointerleave", "pointercancel", "touchcancel"],
  click: ["click"]
};
export const EventEntries : EventEntry[] = Object.entries(EventTranslation);
export const EventList : EventKind[] = [].concat(...EventEntries.map((value) => value[1]));


export enum EventClass {
  Keyboard,
  Pointer,
  Click,
}
export enum EventSource {
  Key,
  Mouse,
  Pointer,
  Touch
}


export enum EventAction {
  Null,
  Down,
  Up,
  Move
}

export class EventClassification {
  canvas: HTMLCanvasElement;
  eventTarget: EventTarget;
  eventType: string;
  timestamp: number;
  readonly eventClass : EventClass|null;
  source: EventSource|null;
  action: EventAction|null;
  readonly key : string|null;
  readonly position : Point|null;

  constructor(event: Event, chart: Chart) {
    this.canvas = chart.ctx.canvas;
    this.eventTarget = event.target;
    this.timestamp = event.timeStamp;
    this.eventType = event.type;

    if (event instanceof KeyboardEvent) {
      this.eventClass = EventClass.Keyboard;
      this.source = EventSource.Key;
      this.key = event.key;
    }
    else if (event instanceof PointerEvent || event instanceof MouseEvent || event instanceof TouchEvent) {
      if(event.type==="click") {
        this.eventClass = EventClass.Click;
      }
      else {
        let point = getRelativePosition(event, chart);
        this.eventClass = EventClass.Pointer;
        this.position = point;

        let source: RegExpMatchArray | null = event.type.match(/^(mouse|pointer|touch).*/);
        if(source!=null) {
          let s = source[1];
          if (s === "mouse") {
            this.source = EventSource.Mouse;
          } else if (s === "pointer") {
            this.source = EventSource.Pointer;
          } else if (s === "touch") {
            this.source = EventSource.Touch;
          }
        }

        let translations: EventEntry | undefined = EventEntries.find((value) => {
          return value[1].includes(event.type);
        });
        if (translations !== undefined) {
          let t = translations[0];
          if(t==="up") { this.action = EventAction.Up; }
          else if(t==="down") { this.action = EventAction.Down; }
          else if(t==="move") { this.action = EventAction.Move; }
          else if(t==="cancel") { this.action = EventAction.Null; }
          else { this.action = null;}
        }
      }
    }
    else {
      this.eventClass = null;
    }
  }

  comparable(other: EventClassification) : boolean {
    return (this.eventClass === other.eventClass) && (this.action===other.action);
  }
  distance(other: EventClassification) : number {
    if(this.comparable(other) && this.eventClass===EventClass.Pointer) {
      let p1 = this.position;
      let p2 = other.position;
      return (p1 === null || p2 === null) ? NaN : Math.hypot(p1.x - p2.x, p1.y - p2.y);
    }
  }
  timeDelta(other: EventClassification) : number {
    return Math.abs(this.timestamp-other.timestamp)/1.0e6;
  }
}

export class PluginEvent extends Event {
  readonly classification: EventClassification;

  constructor(event: EventClassification, type: string = 'plugin') {
    super(`${type}-event`);
    this.classification = event;
  }
}

export function fire(event: EventClassification, target: Element, type: string = 'plugin') {
  target.dispatchEvent(new PluginEvent(event,type));
}

export class Debouncer {
  private readonly distance : number;
  private readonly time: number;

  constructor(distance: number = 1.0e-6,time: number = 2.0e-3) {
    this.distance=distance;
    this.time=time;
  }

  duplicate(e1: EventClassification,e2: EventClassification) : boolean {
    return e1.comparable(e2) && e1.distance(e2) < this.distance && e1.timeDelta(e2) < this.time;
  }
}
