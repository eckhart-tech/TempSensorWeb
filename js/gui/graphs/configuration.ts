import { ChartType } from "chart.js";
import { Chart } from "chart.js/auto";
import { GraphDataSet, Parameter } from "./graphData";

export function chartInit() {
  Chart.defaults.animation = false;
  Chart.defaults.plugins.legend.display = true;
  Chart.defaults.plugins.title.display = false;
}
chartInit();

interface GraphicScale {
  min: number,
  max: number,
  ticks: {
    callback: (value: Date | number) => string
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

  scales: {
    x: GraphicScale,
    y: GraphicScale
  }
}

export interface GraphicConfiguration    {
  configuration: ChartConfig,
  title: string,
  klass: string
}

let formatter : Intl.DateTimeFormat;
export function SetLocale(locale : string = 'en-GB') {
  formatter = new Intl.DateTimeFormat(locale);
}
SetLocale();

function MakeGraphicConfiguration(data: GraphDataSet ,parameter:Parameter): GraphicConfiguration {
    let datasets = data.dataSet(parameter);
    let beacons = data.beacons.join(', ');

    let configuration : ChartConfig = {
      type: 'scatter',
      data: {
        datasets: datasets
      },
      scales : {
        x: {
          min: data.min.getTime(),
          max: data.max.getTime(),
          ticks: {
            callback: (value: number)  => formatter.format(new Date(value))
          }
        },
        y: {
          min: parameter.min,
          max: parameter.max,
          ticks: {
            callback: (value : number ) => `${value}${parameter.units}`
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
