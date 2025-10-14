import { Point, ChartDataset, ChartType } from "chart.js";
import { GraphDataSet, Parameter } from "./graphData";
import { Format } from "../../lib";

import { GraphicScale, Plugins, EventKey, ZoomPlugin, makeZoomConfiguration, makeZoomWheel } from "./conf";
import { zoomerOptions, ZoomerOptions } from "./zoomer";
import { DOM } from "../dom";


/*
zoom: {

            limits: {
              x: { min: 'original', max: 'original' },
              y: { min: 'original', max: 'original' },
            },
            zoom: {
              wheel: {
                enabled: true,
                modifierKey: 'shift'
              },
              mode: 'xy'
            }
          }
 */







// export interface RecordValue {
//  x: number,
//  y: number
// }

export interface RecordItem {
  label: string,
  data: Point[];
}

export function ToRecordItem(s :ChartDataset<ChartType,Point[]>): RecordItem {
  return {
    label: s.label,
    data: s.data
  };
}



interface GraphicOptions {
  scales: {
    x: GraphicScale,
    y: GraphicScale
  },
  events: EventKey[],
  plugins: Plugins
}

interface ChartConfig {
  type: ChartType,
  data: {
    datasets: RecordItem[]
  },
  options : GraphicOptions
}

export interface GraphicConfiguration    {
  configuration: ChartConfig,
  title: string,
  klass: string
}



function MakeGraphicOptions(
  parameter:Parameter,
  events : EventKey[],
  plugins: Plugins
) : GraphicOptions {
  return {
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
    },
    events: events,
    plugins: plugins
  };
}






// TODO add in plugin for zoom on graphs: chartjs-plugin-zoom: https://www.chartjs.org/chartjs-plugin-zoom/latest/guide/options.html
function MakeGraphicConfiguration(
  data: GraphDataSet,
  parameter:Parameter,
  zoom: ZoomerOptions|null = null
): GraphicConfiguration {
    let datasets = data.dataSet(parameter);
    let beacons = data.beacons.join(', ');

    let plugins: Plugins = {};
    if (zoom != null) {
      plugins.zoomer = zoom;
    }
    let configuration : ChartConfig = {
      type: 'scatter',
      data: {
        datasets: datasets
      },
      options : MakeGraphicOptions(parameter,[],plugins)
    };
    return {
      configuration: configuration,
      title: `${parameter} for ${beacons} (${parameter.units})`,
      klass: parameter.toString()
  };
}

export function  MakeGraphicConfigurations(data: GraphDataSet,element: DOM|null=null) : GraphicConfiguration[] {
  //let z = makeZoomConfiguration('x',null,null,makeZoomWheel(true),true,true);
  return Parameter.All.map(p => MakeGraphicConfiguration(data,p,zoomerOptions(element)));
}
