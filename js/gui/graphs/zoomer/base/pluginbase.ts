import { Chart, ChartEvent, ChartMeta, ChartTypeRegistry } from "chart.js/auto";
import { ChartType, Plugin } from "chart.js";
import { EventClass, EventClassification, EventList, PluginEvent } from "./pluginbaseevents";
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




export interface AfterEventArgs {
  event: ChartEvent;
  replay: boolean;
  changed?: boolean;
  cancelable: false;
  inChartArea: boolean;
}
export function afterEvent(event : PluginEvent, rep : boolean = false, area: boolean = true) : AfterEventArgs {
  return {
    event: event.wrap(),
    replay: rep,
    inChartArea : area,
    cancelable: false
  };
}

export class PluginBase implements Plugin {
  id: string;
  defaults? = {};
  args: Obj<never>;
  options: Obj<any>;

  events?: EventKind[];
  //element: HTMLElement | null = null;
  activated: boolean;

  constructor(id: string) {
    this.id = id;
    this.activated = false;
  }



  afterInit(chart: Chart<ChartType>, args: Obj<never>, options: Obj<any>) {
    this.events = EventList;
    let canvas = chart.ctx.canvas;
    this.events.forEach((kind) => {
      console.log(`Adding handler for event kind ${kind}`);
      canvas.addEventListener(kind, (ev) => this.handler(chart, ev));
    });
    this.args = args;
    this.options = options;
    this.myInit(chart, args, options);
    this.activated = true;
    console.log(`Initialised plugin ${this.id}`);
  }

  myInit(chart: Chart<ChartType>, args: Obj<never>, options: Obj<any>) {}

  beforeDatasetsDraw(
    chart: Chart<ChartType>,
    args = { cancelable: false },
    options: Obj<never>,
  ): boolean | void {
    console.log(`Before draw ${this.id}`);
  }

  beforeDestroy(chart: Chart<ChartType>, args: Obj<never>, options: Obj<any>) {
    if (!this.activated) {
      return;
    }
    let canvas = chart.ctx.canvas;
    this.events.forEach((kind) => {
      canvas.removeEventListener(kind, (ev) => this.handler(chart, ev));
    });
    this.activated = false;
  }

  afterEvent(chart: Chart<ChartType>, args: AfterEventArgs, options: Obj<any>) {
    let e = args.event.native;
    if (e != null && e instanceof PluginEvent) {
      args.changed = this.myChartEventHandler(chart, e);
    }
  }

  afterDraw(chart: Chart<ChartType>, args: Obj<never>, options: Obj<any>) {

  }

  myChartEventHandler(chart: Chart<ChartType>, event: PluginEvent): boolean {
    return false;
  }

  handler(chart: Chart<ChartType>, event: Event) {
    //console.log(`In event handler, activated ${this.activated}, with event of type ${event.type} : ${event}  `);
    if (!this.activated) {
      return;
    }
    let classification = new EventClassification(event, chart);
    switch (classification.eventClass) {
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





