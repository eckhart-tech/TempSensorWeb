import { ChartType } from "chart.js";
import { GraphDataSet } from "./graphData";
import { Parameter } from "./graphParameter";
import { Format } from "../../lib";

//import { zoomerOptions } from "./zoomer";
import { DOM } from "../dom";
import {
  ChartConfig,
  GraphicConfiguration,
  GraphicOptions,
  Plugins,
  EventKey,
  makeGraphicScale
} from "./base";



function MakeGraphicOptions(
  parameter:Parameter,
  events : EventKey[],
  plugins: Plugins
) : GraphicOptions {
  return {
    scales: {
      x: makeGraphicScale(function(value, index, ticks) {
          return Format.date(value);
        }
      ),
      y: makeGraphicScale(function(value, index, ticks) {
          return `${value}${parameter.units}`;
        }
      )
    },
    events: events,
    plugins: plugins
  };
}

function MakeGraphicConfiguration(
  type: ChartType,
  data: GraphDataSet,
  parameter:Parameter,
  plugins: Plugins = {}
): GraphicConfiguration {
    let datasets = data.dataSet(parameter);
    let beacons = data.beacons.map( b => b.beacon).join(', ');

    let configuration : ChartConfig = {
      type: type,
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


export function  MakeGraphicConfigurations(type: ChartType,data: GraphDataSet,element: DOM|null=null) : GraphicConfiguration[] {
  return Parameter.All.map(p => MakeGraphicConfiguration(type,data,p));
}
