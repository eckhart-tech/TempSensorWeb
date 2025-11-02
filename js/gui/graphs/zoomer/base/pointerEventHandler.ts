import { DOM, EventKind } from "../../../dom";

import { ChartEvent, Point } from "chart.js";
import { Chart } from "chart.js/auto";
import { getRelativePosition } from "chart.js/helpers";
import { EventClassification } from "./pluginbaseevents";


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



export class ManagedPointerEvent extends Event {
  readonly eventClass: EventClass;
  readonly eventAction: EventAction;
  readonly eventSource: EventSource;
  readonly chart: Chart | null;
  key : string|null;
  position : Point|null;


  constructor(
    eventClass: EventClass,
    eventAction: EventAction,
    eventSource: EventSource,
    chart: Chart | null = null,
    type: string = "plugin",
  ) {
    super(`${type}-event`);
    this.eventClass = eventClass;
    this.eventSource = eventSource;
    this.eventAction = eventAction;
    this.chart = chart;
  }

  wrap(): ChartEvent {
    return {
      type: "click",
      native: this,
      x: null,
      y: null
    };
  }
}

class PointerEventManager {
  static eventSourceMapper : Map<string,EventSource>;
  static eventActionMapper : Map<string,EventAction>;
  eventType: string;
  eventTarget: EventTarget;
  activated : boolean;
  chart : Chart;


  static {
    PointerEventManager.eventSourceMapper = new Map<string,EventSource>;
    PointerEventManager.eventSourceMapper.set('mouse',EventSource.Mouse);
    PointerEventManager.eventSourceMapper.set('pointer',EventSource.Pointer);
    PointerEventManager.eventSourceMapper.set('touch',EventSource.Touch);

    PointerEventManager.eventActionMapper = new Map<string,EventAction>;
    PointerEventManager.eventActionMapper.set('up',EventAction.Up);
    PointerEventManager.eventActionMapper.set('down',EventAction.Down);
    PointerEventManager.eventActionMapper.set('move',EventAction.Move);
    PointerEventManager.eventActionMapper.set('cancel',EventAction.Null);
  }

  constructor(eventType: string,chart: Chart) {
    this.eventType = eventType;
    this.chart = chart;
    this.activated = false;
  }


  private handleKeys(event : KeyboardEvent): ManagedPointerEvent {
    let e = new ManagedPointerEvent(EventClass.Keyboard, EventAction.Null, EventSource.Key, this.chart);
    e.key = event.key;
    return e;
  }

  private handlePointerMouseTouch(event: PointerEvent|MouseEvent|TouchEvent) : ManagedPointerEvent {

    let source: RegExpMatchArray | null = event.type.match(/^(mouse|pointer|touch).*/);
    let eventSource : EventSource = (source!=null) ? PointerEventManager.eventSourceMapper.get(source[1]) : EventSource.Pointer;


    if (event.type === "click") {
      return new ManagedPointerEvent(EventClass.Click, EventAction.Null,eventSource);
    } else {



      let translations: EventEntry | undefined = EventEntries.find((value) => {
        return value[1].includes(event.type);
      });
      if (translations !== undefined) {
        let action = PointerEventManager.eventActionMapper.get(translations[0]);
        let e = new ManagedPointerEvent(EventClass.Pointer,action,eventSource);
        e.position = getRelativePosition(event, this.chart);
      }
      else {
        return new ManagedPointerEvent(EventClass.Pointer,EventAction.Null,eventSource);
      }
    }
  }




  private process(event: Event) : ManagedPointerEvent|null {
    if (event instanceof KeyboardEvent) {
      return this.handleKeys(event);
    }
    else if (event instanceof PointerEvent || event instanceof MouseEvent || event instanceof TouchEvent) {
      return this.handlePointerMouseTouch(event);
    }
    else {
      return null;
    }
  }

  handleEvent(event: Event) {
    //console.log(`In event handler, activated ${this.activated}, with event of type ${event.type} : ${event}  `);
    if (!this.activated) {
      return;
    }
    let pEvent : ManagedPointerEvent|null = this.process(event);
    if(pEvent !=null) { this.eventTarget.dispatchEvent(pEvent); }
  }

  activate() {
    this.activated=true;
  }

  listen(dom: DOM) {
    dom.addEventListener(this.eventType, (e: Event) => this.handleEvent(e));
  }
  unlisten(dom: DOM) {
    dom.removeEventListener(this.eventType, (e: Event) => this.handleEvent(e));
  }


}