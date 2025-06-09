import { ChartType, Tick } from "chart.js";
import { GraphDataSet, Parameter } from "./graphData";
import { Format } from "../../lib";



interface GraphicScale {
  beginAtZero?: boolean,
  min?: number,
  max?: number,
  ticks: {
    callback: (value : number, index : number , ticks : Tick[]) => string,
    color? : string
  }
}

export interface RecordValue {
  x: number,
  y: number
}

export interface RecordItem {
  label: string,
  data: RecordValue[]
}

interface ChartConfig {
  type: ChartType,
  data: {
    datasets: RecordItem[]
  },
  options : {
    scales: {
      x: GraphicScale,
      y: GraphicScale
    }
  }
}

export interface GraphicConfiguration    {
  configuration: ChartConfig,
  title: string,
  klass: string
}


// TODO add in plugin for zoom on graphs: chartjs-plugin-zoom: https://www.chartjs.org/chartjs-plugin-zoom/latest/guide/options.html
function MakeGraphicConfiguration(data: GraphDataSet ,parameter:Parameter): GraphicConfiguration {
    let datasets = data.dataSet(parameter);
    let beacons = data.beacons.join(', ');

    let configuration : ChartConfig = {
      type: 'scatter',
      data: {
        datasets: datasets
      },
      options : {
        scales: {
          x: {
            beginAtZero: false,
            //min: data.min.getTime(),
            //max: data.max.getTime(),
            ticks: {
              callback: function(value, index, ticks) {
                return Format.date(value);
              }
            }
          },
          y: {
            beginAtZero: false,
            //min: parameter.min,
            //max: parameter.max,
            ticks: {
              callback: function(value, index, ticks) {
                return `${value}${parameter.units}`;
              }
            }
          }
        }
      }
    };
    return {
      configuration: configuration,
      title: `${parameter} for ${beacons} (${parameter.units})`,
      klass: parameter.toString()
  };
}

export function  MakeGraphicConfigurations(data: GraphDataSet) : GraphicConfiguration[] {
  return Parameter.All.map(p => MakeGraphicConfiguration(data,p));
}
