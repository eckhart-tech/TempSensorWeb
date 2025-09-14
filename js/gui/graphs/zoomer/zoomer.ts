import { ChartMeta, ChartType } from "chart.js";
import { Chart } from "chart.js/auto";
import { getRelativePosition } from 'chart.js/helpers';
import { PluginBase, EventData, Obj, makePluginInterface } from "./pluginbase";



export class Zoomer extends PluginBase {
  constructor() {
    super("zoomer");
  }



  pointerHandler(info: EventData) {
    switch(info.action) {
      case 'up':
        this.pointerUp(info.raw);
        break;
      case 'down':
        this.pointerDown(info.raw);
        break;
      case 'move':
        break;
      case 'cancel':
        break;
      case 'click':
        break;
      default:
        break;
    }
  }

  keypressHandler(info: EventData) {
    switch(info.action) {
      case 'up':
        break;
      case 'down':
        break;
      default:
        break;
    }
  }

  pointerUp(event: Event) {
    console.log(`Event is {event}`);

    const canvasPosition = getRelativePosition(event, this.chart);

    // Substitute the appropriate scale IDs
    const dataX = this.chart.scales.x.getValueForPixel(canvasPosition.x);
    const dataY = this.chart.scales.y.getValueForPixel(canvasPosition.y);

    console.log(`Mouseup at ${dataX}, ${dataY}`);

  }

  pointerDown(event: Event) {
    console.log(`Event is {event}`);
    const canvasPosition = getRelativePosition(event, this.chart);

    // Substitute the appropriate scale IDs
    const dataX = this.chart.scales.x.getValueForPixel(canvasPosition.x);
    const dataY = this.chart.scales.y.getValueForPixel(canvasPosition.y);

    console.log(`Mousedown at ${dataX}, ${dataY}`);
  }

}

let _zoomer = new Zoomer();
export const zoomer = makePluginInterface(_zoomer);
Chart.register(_zoomer);


