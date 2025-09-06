import {
  ChartType,
  Plugin
} from "chart.js";
import { Chart } from "chart.js/auto";
import { getRelativePosition } from 'chart.js/helpers';
import { Handlers, PluginEventHandlers } from "./pluginbase";



type Obj<T> = Record<string,T>|null;

class PluginBase implements Plugin {
  id: string;
  defaults? = {};
  events?: (keyof HTMLElementEventMap)[];
  chart: Chart | null = null;
  handlers: PluginEventHandlers;

  constructor(id: string) {
    this.id = id;
    this.handlers = new PluginEventHandlers();
  }

  init(chart: Chart<ChartType>, handlers: Handlers) {
    this.chart = chart;
    this.events = handlers.map((info) => info.event);
    this.handlers.load(this.chart,handlers);
  }

}



export class Zoomer extends PluginBase {

  constructor() {
    super('zoomer');
  }

  afterInit(chart: Chart<ChartType>, args: Obj<never>, options: Obj<any>) {
    this.init(chart,[
      { event: 'pointerup', handler: this.pointerUpHandler },
      { event: 'pointerdown', handler: this.pointerDownHandler }
    ]);
    console.log("Initialised zoomer");
  }

  pointerUpHandler(chart: Chart, event: Event) {
    console.log(`Event is {event}`);
    if (event.type === "pointerup") {
      const canvasPosition = getRelativePosition(event, this.chart);

      // Substitute the appropriate scale IDs
      const dataX = this.chart.scales.x.getValueForPixel(canvasPosition.x);
      const dataY = this.chart.scales.y.getValueForPixel(canvasPosition.y);

      console.log(`Mouseup at ${dataX}, ${dataY}`);
    }
  }

  pointerDownHandler(chart: Chart, event: Event) {
    console.log(`Event is {event}`);
    if (event.type === "pointerdown") {
      const canvasPosition = getRelativePosition(event, this.chart);

      // Substitute the appropriate scale IDs
      const dataX = this.chart.scales.x.getValueForPixel(canvasPosition.x);
      const dataY = this.chart.scales.y.getValueForPixel(canvasPosition.y);

      console.log(`Mousedown at ${dataX}, ${dataY}`);
    }
  }



  beforeDatasetsDraw(
    chart: Chart<ChartType>,
    args: { cancelable: true },
    options: Obj<any>,
  ): boolean | void {}



}