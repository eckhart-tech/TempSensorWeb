import { Chart } from 'chart.js/auto';
import { DOM} from '../dom';
import { GraphDataSet, Parameter, ParameterInfo } from "./graphData";
import { GraphicConfiguration } from "./configuration";





class ChartConfiguration {
  private formatter: Intl.DateTimeFormat;
  title: string | null;

  constructor(
        locale : string = 'en-GB'
    ) {
        this.formatter = new Intl.DateTimeFormat(locale);
        this.title=null;
    }


    config(data: GraphDataSet ,parameter:Parameter): GraphicConfiguration {
        let datasets = data.dataSet(parameter);
        let info = new ParameterInfo(parameter);
        let beacons = data.beacons.join(', ');
        this.title = `${parameter} for ${beacons} (${info.units})`;

        return {
            type: 'scatter',
          data: {
              datasets: datasets
          },
            scales : {
                x: {
                    min: data.min.getTime(),
                    max: data.max.getTime(),
                    ticks: {
                        callback: (value: Date | number)  => this.formatter.format(value)
                    }
                },
                y: {
                    min: info.min,
                    max: info.max,
                    ticks: {
                        callback: (value : number ) => `${value}${info.units}`
                    }
                }
            }
        };
    }
}


export class Graphic {
   configuration: ChartConfiguration;
  element: DOM;
    /**
     *
     * @param {string} id
     */
    constructor(id: string) {
        this.configuration = new ChartConfiguration();
        this.element = DOM.withID(id);
    }

    clean() {
        this.element.empty();
    }


    async render(data: GraphDataSet,parameter: Parameter) {
        this.clean();
        let config = this.configuration.config(data,parameter);
        let canvas = new DOM('canvas').addClass(parameter);
        new Chart(canvas.dom as HTMLCanvasElement, config);
        this.element.append(canvas);
        return this.configuration.title;
    }
}



