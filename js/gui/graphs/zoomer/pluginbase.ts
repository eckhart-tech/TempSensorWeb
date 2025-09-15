import { Chart } from "chart.js/auto";
import { ChartType, Plugin } from "chart.js";
import { getRelativePosition } from "chart.js/helpers";


type EventKind = keyof HTMLElementEventMap;
type EventAction = { [key: string]: EventKind[] };
type EventEntry = [string, string[]];

export interface EventData {
  raw: Event,
  event: string | null,
  target: EventTarget,
  action: string | null,
  key?: string,
  x?: number,
  y?: number
}



export type Obj<T> = Record<string, T> | null;

interface IConstructor<T> {
  new(...args: any[]) : T;
}

interface IActivatable {}

function construct<T extends IActivatable>(type: IConstructor<T>) : T {
  return new type();
}

export class PluginBase implements Plugin {
  id: string;
  defaults? = {};
  static EventEntries: EventEntry[];
  static EventTranslation: EventAction = {
    up: ["keyup", "mouseup", "pointerup", "touchend"],
    down: ["keydown", "mousedown", "pointerdown", "touchstart"],
    move: ["mousemove", "pointermove", "touchmove"],
    cancel: ["mouseleave", "pointerleave", "pointercancel", "touchcancel"],
    click: ["click"]
  };
  static EventList: EventKind[];
  static {
    PluginBase.EventEntries = Object.entries(PluginBase.EventTranslation);
    PluginBase.EventList = [].concat(
      ...PluginBase.EventEntries.map((value) => value[1])
    );
  }
  events?: EventKind[];
  chart: Chart | null = null;
  canvas: HTMLCanvasElement | null = null;
  activated: boolean;

  constructor(id: string) {
    this.id = id;
    this.activated = false;
  }

  afterInit(chart: Chart<ChartType>, args: Obj<never>, options: Obj<any>) {
    this.events = PluginBase.EventList;
    this.chart = chart;
    this.canvas = chart.ctx.canvas;
    this.events.forEach((kind) => {
      console.log(`Adding handler for event kind ${kind}`);
      this.canvas.addEventListener(kind, (ev) => this.handler(ev));
    });
    this.activated = true;
    console.log(`Initialised plugin ${this.id}`);
  }

  beforeDatasetsDraw(chart: Chart<ChartType>, args: { cancelable: true }, options: Obj<never>): boolean | void {
    console.log(`Before draw ${this.id}`);
  }

  beforeDestroy(chart: Chart<ChartType>, args: Obj<never>, options: Obj<any>) {
    if (!this.activated) {
      return;
    }
    this.events.forEach((kind) => {
      this.canvas.removeEventListener(kind, (ev) => this.handler(ev));
    });
    this.canvas = null;
    this.chart = null;
    this.activated = false;
  }

  translateEventKind(kind: string): string | null {
    let translations: [string, string[]] | undefined =
      PluginBase.EventEntries.find((value) => {
        return value[1].includes(kind);
      });
    if (translations === undefined) {
      return null;
    }
    return translations[0];
  }

  handler(event: Event) {
    console.log(`In event handler, activated ${this.activated}, with event of type ${event.type} : ${event}  `);
    if (!this.activated) {
      return;
    }
    let translation: string | null = this.translateEventKind(event.type);
    let source: RegExpMatchArray | null = event.type.match(
      /^(key|mouse|pointer|touch).*/
    );

    let info: EventData = {
      raw: event,
      event: source == null ? null : source[1],
      target: event.currentTarget,
      action: translation
    };

    if (event instanceof KeyboardEvent) {
      info.key = event.key;
      this.keypressHandler(info);
    } else if (
      event instanceof PointerEvent ||
      event instanceof MouseEvent ||
      event instanceof TouchEvent
    ) {
      let pos = getRelativePosition(event, this.chart);
      info.x = pos.x;
      info.y = pos.y;
      this.pointerHandler(info);
    }
  }

  keypressHandler(info: EventData) {
    console.log(info);
  }

  pointerHandler(info: EventData) {
    console.log(info);
  }

  get pluginInterface(): {} {
    return {
      id: this.id,
      afterInit: (chart: Chart<ChartType>, args: Obj<never>, options: Obj<any>) => { this.afterInit(chart,args,options); },
      beforeDatasetsDraw: (chart: Chart<ChartType>, args: { cancelable: true }, options: Obj<never>) => { this.beforeDatasetsDraw(chart,args,options); },
      beforeDestroy: (chart: Chart<ChartType>, args: Obj<never>, options: Obj<any>) => { this.beforeDestroy(chart,args,options); }
    };
  }
}





