import { Chart } from 'chart.js/auto';
import { DOM} from '../dom';
import { GraphDataSet } from "./graphData";
import { GraphicConfiguration, MakeGraphicConfigurations } from "./configuration";

export class Graphic {
  element: DOM;

  constructor(id: string) {
    this.element = DOM.withID(id);
  }

  clean() {
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
    new Chart(canvas.dom as HTMLCanvasElement, c.configuration);
    let dom = new DOM("figure")
      .appendAll([
        new DOM("h1").text(c.title),
        canvas
      ]);
    this.element.append(dom);

  }

  async render(data: GraphDataSet) {
    this.clean();
    let configurations = MakeGraphicConfigurations(data);
    for (const c of configurations) {
      await this.renderChart(c);
    }

  }
}



