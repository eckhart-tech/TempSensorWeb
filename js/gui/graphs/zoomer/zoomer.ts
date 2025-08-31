import {
  Point,
  ChartArea,
  ChartConfiguration,
  ChartEvent,
  ChartType,
  Plugin
} from "chart.js";
import { Chart } from "chart.js/auto";
import { getRelativePosition } from 'chart.js/helpers';



type Obj<T> = Record<string,T>|null;
interface ChartEventArgs {
  event: ChartEvent;
  replay: boolean;
  cancelable: true;
  inChartArea: boolean;
}

export class Zoomer implements Plugin {
  id: string = "zoomer";
  defaults? = {};
  events?: (keyof HTMLElementEventMap)[] = [
    "mouseup",
    "mousedown",
    "mousemove",
    "mouseenter",
    "mouseleave",
    "click",
    "touchstart",
    "touchend",
    "touchmove",
    "touchcancel",
    "keyup",
    "keydown",
    "keypress",
  ];
  area: ChartArea;
  point1: Point;
  point2: Point;
  initialised: boolean;



  /*
  private eventToDataPoint(
    chart: Chart<ChartType>,
    event: ChartEvent,
  ): PointInDataSet[] {
    let items = chart.getElementsAtEventForMode(
      event,
      "dataset",
      { axis: "xy" },
      true,
    );
    return items.map((i) => new PointInDataSet(chart, i.datasetIndex, i.index));
  }
*/


  constructor() {
    this.initialised=false;
  }

  install(chart: Chart<ChartType>) {
    if ((chart.config as ChartConfiguration).type !== "scatter") {
      throw new Error("Plugin only for scatter graphs");
    }
    this.point1 = { x: 0, y: 0 };
    this.point2 = { x: 0, y: 0 };
    this.area = chart.chartArea;
    this.initialised=true;
  }

  afterInit(chart: Chart<ChartType>, args: Obj<never>, options: Obj<any>) {
    this.install(chart);
  }

  beforeEvent(chart: Chart<ChartType>, args: ChartEventArgs, options: Obj<any>): boolean | void {
    if(!this.initialised) {
      console.error('Attempt to interact with uninitialised plugin');
      return;
    }

    let event = args.event
    if(event.type==="mouseup") {
      const canvasPosition = getRelativePosition(event, chart);

      // Substitute the appropriate scale IDs
      const dataX = chart.scales.x.getValueForPixel(canvasPosition.x);
      const dataY = chart.scales.y.getValueForPixel(canvasPosition.y);

      console.log(`Mouseup at ${dataX}, ${dataY}`);
    }
  }

  beforeDatasetsDraw(
    chart: Chart<ChartType>,
    args: { cancelable: true },
    options: Obj<any>,
  ): boolean | void {}
}