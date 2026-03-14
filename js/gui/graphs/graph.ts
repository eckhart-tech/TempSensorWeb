import { Chart, ChartItem } from "chart.js/auto";
//import { Chart, ScatterController, PointElement, LinearScale, Colors, Legend, Title } from "chart.js";
//import zoomPlugin from 'chartjs-plugin-zoom';
//import { Zoomer } from "./zoomer";


import { DOM, DOMButton } from "../dom";
import { GraphDataSet } from "./graphData";
import { ChartConfig, GraphicConfiguration } from "./base";
//import { ZoomerEvent } from "./zoomer/zoomer";
import { MakeGraphicConfigurations } from "./configuration";



interface Size {
  width: number;
  height: number;
}




export class Graphic {

  canvas: HTMLCanvasElement

  static {
    //Chart.register(Graphic.zoomer);
    Chart.defaults.animation = false;
    Chart.defaults.plugins.legend.display = true;
    Chart.defaults.plugins.title.display = false;
  }
  root: DOM;
  charts: Chart[];
  alive: boolean;
  
  windows: ZoomWindow[];

  constructor(id: string) {
    this.root = DOM.withID(id);
    let canvas = new DOM('canvas');
    this.root.append(canvas)
    this.canvas=canvas.dom as HTMLCanvasElement;
    this.windows=[];

    this.charts = [];
    this.alive = false;

  }

  get context() { return this.canvas.getContext('2d'); }
  get size() : Size { return { width: this.canvas.width, height: this.canvas.height} }

  clear() {
    let sz=this.size;
    this.context.clearRect(0,0,sz.width,sz.height);
  }

  load() {
    this.windows=[{start: 0, end: 100}]; //TODO : put in actual count of points in datasets
  }

  private zoomIn(start: number,end: number) {
    this.windows.unshift({start:start,end:end});
  }

  private zoomOut() {
    if (this.windows.length>1) {
      this.windows.shift();
    }
  }

  get window() : ZoomWindow {
    if (this.windows.length>0) { return this.windows[0]; }
    else { return {start:0,end:0}; }

  }


  clean() {
    this.alive = false;
    this.charts = [];
    this.element.empty();

  }

  /*
  zoomHandler(e : Event) {
    if(this.alive) {
      console.log(`Got zoom-event ${e}`);
    }
    else {
      console.log('dead graphic getting zoomer-event');
    }
  }
  */


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
    let chart = new Chart(canvas.dom as HTMLCanvasElement, c);
    this.charts.push(chart);
    let dom = new DOM("figure")
      .appendAll([
        new DOM("h1").text(c.title),
        canvas
      ]);
    //let cb = (event: Event) => { console.log(`Event ${event} on chart`); }
    //canvas.dom.addEventListener('Mouse',cb,null)
    this.element.append(dom);

  }

  async render(data: GraphDataSet) {
    this.clean();
    let reset = new DOMButton('Reset Zoom');
    reset.addListener(_ => { this.reset(); });
    this.element.append(reset.dom);
    // this.element.addEventListener('zoomer-event', e => this.globalHandler(e));

    let configurations = MakeGraphicConfigurations(data,this.element);
    console.log(configurations);
    for (const c of configurations) {
      await this.renderChart(c);
    }
    this.alive=true;
  }

  reset() {
    //this.charts.forEach(c => c.resetZoom());
  }

  /*
  globalHandler(event: Event) {
    if(event instanceof ZoomerEvent) {
      console.log(`>>> ZOOMER EVENT ${event}`);
      let ce = event.wrap();
      this.charts.forEach(chart => {
        chart.notifyPlugins('afterEvent',{ event: ce });
      });
    }
  }
  */

}



