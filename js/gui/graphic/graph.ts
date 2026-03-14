// define custom Event Type ThermoGraphEvent

import { GraphicConfiguration } from "../graphs/base";
import { GraphDataSet } from "../graphs/graphData";

class GraphBase {
  canvas : HTMLCanvasElement;
  configuration : GraphicConfiguration;

  constructor(canvas : HTMLCanvasElement,configuration: GraphicConfiguration) {
    this.canvas = canvas;
    this.configuration = configuration;
    this.canvas.addEventListener('PointerEvent',this.onPointerEvent);
    this.canvas.addEventListener('ThermoGraphEvent',this.onGraphEvent);
  }

  async render(data: GraphDataSet) {

  }

  async draw() {}

  onPointerEvent(event: Event) {

  }

  onGraphEvent(event: Event) {}

}