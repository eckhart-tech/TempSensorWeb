import { Chart } from 'chart.js/auto';
//import { Chart, ScatterController, PointElement, LinearScale, Colors, Legend, Title } from "chart.js";
import zoomPlugin from 'chartjs-plugin-zoom';
import {Zoomer} from './zoomer';


import { DOM, DOMButton } from "../dom";
import { GraphDataSet } from "./graphData";
import { GraphicConfiguration, MakeGraphicConfigurations } from "./configuration";


//Chart.register(
//  ScatterController, PointElement, LinearScale, Colors, Legend, Title
//);


export class Graphic {
  static {
    Chart.register(zoomPlugin);
    Chart.register(new Zoomer());
    Chart.defaults.animation = false;
    Chart.defaults.plugins.legend.display = true;
    Chart.defaults.plugins.title.display = false;
  }
  element: DOM;
  charts: Chart[];

  constructor(id: string) {
    this.element = DOM.withID(id);
    this.charts = [];

  }

  clean() {
    this.charts = [];
    this.element.empty();
  }

  /*async renderParameter(data: GraphDataSet,parameter: Parameter) {
      this.clean();
      let {
        configuration: config,
        title: title
      }
        = MakeGraphicConfiguration(data, parameter);
      let canvas = new DOM('canvas').addClass(parameter);
      new Chart(canvas.dom as HTMLCanvasElement, config);
      return new DOM('figure').addClass(parameter).appendAll([
        new DOM('h1').text(title), canvas
      ]);
    } */

  async renderChart(c : GraphicConfiguration) {
    let canvas = new DOM("canvas").addClass(c.klass);
    this.charts.push(new Chart(canvas.dom as HTMLCanvasElement, c.configuration));
    let dom = new DOM("figure")
      .appendAll([
        new DOM("h1").text(c.title),
        canvas
      ]);
    let cb = (event: Event) => { console.log(`Event {event} on chart`); }
    canvas.dom.addEventListener('Mouse',cb,null)
    this.element.append(dom);

  }

  async render(data: GraphDataSet) {
    this.clean();
    let reset = new DOMButton('Reset Zoom');
    reset.addListener(_ => { this.reset(); });
    this.element.append(reset.dom);

    let configurations = MakeGraphicConfigurations(data);
    console.log(configurations);
    for (const c of configurations) {
      await this.renderChart(c);
    }

  }

  reset() {
    this.charts.forEach(c => c.resetZoom());
  }
}



