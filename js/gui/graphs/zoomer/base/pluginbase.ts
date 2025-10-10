import { Chart } from "chart.js/auto";
import { ChartType, Plugin } from "chart.js";
import { EventClass, EventClassification, EventList} from "./pluginbaseevents";
import { EventKind } from "../../../dom";


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

export class PluginBase implements Plugin {
  id: string;
  defaults? = {};

  events?: EventKind[];
  chart: Chart | null = null;
  canvas: HTMLCanvasElement | null = null;
  //element: HTMLElement | null = null;
  activated: boolean;

  constructor(id: string) {
    this.id = id;
    this.activated = false;
  }

  afterInit(chart: Chart<ChartType>, args: Obj<never>, options: Obj<any>) {
    this.events = EventList;
    this.chart = chart;
    this.canvas = chart.ctx.canvas;
    this.events.forEach((kind) => {
      console.log(`Adding handler for event kind ${kind}`);
      this.canvas.addEventListener(kind, (ev) => this.handler(ev));
    });
    this.myInit();
    this.activated = true;
    console.log(`Initialised plugin ${this.id}`);

  }

  myInit() {}

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



  handler(event: Event) {
    //console.log(`In event handler, activated ${this.activated}, with event of type ${event.type} : ${event}  `);
    if (!this.activated) {
      return;
    }
    let classification = new EventClassification(event,this.chart);
    switch(classification.eventClass) {
      case EventClass.Keyboard:
        this.keypressHandler(classification);
        break;
      case EventClass.Pointer:
        this.pointerHandler(classification);
        break;
      case EventClass.Click:
        this.clickHandler(classification);
        break;
      default:
        break;
    }

  }

  clickHandler(info: EventClassification) {
    console.log(info);
  }

  keypressHandler(info: EventClassification) {
    console.log(info);
  }

  pointerHandler(info: EventClassification) {
    console.log(info);
  }

  /*
  get pluginInterface(): {} {
    return {
      id: this.id,
      afterInit: (chart: Chart<ChartType>, args: Obj<never>, options: Obj<any>) => { this.afterInit(chart,args,options); },
      beforeDatasetsDraw: (chart: Chart<ChartType>, args: { cancelable: true }, options: Obj<never>) => { this.beforeDatasetsDraw(chart,args,options); },
      beforeDestroy: (chart: Chart<ChartType>, args: Obj<never>, options: Obj<any>) => { this.beforeDestroy(chart,args,options); }
    };
  }
  */
}





