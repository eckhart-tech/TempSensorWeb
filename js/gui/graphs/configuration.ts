import { ChartType, Tick } from "chart.js";
import { GraphDataSet, Parameter } from "./graphData";
import { Format } from "../../lib";



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





type ZoomRangeValue = number|'original';

interface ZoomRange {
  min: ZoomRangeValue,
  max: ZoomRangeValue
}

type ZoomWheelModifierKey = 'ctrl'|'alt'|'shift'|'meta'|null;

interface ZoomWheel {
  enabled: boolean,
  modifierKey?: ZoomWheelModifierKey
}
type ZoomMode = 'x'|'y'|'xy';

interface ZoomPlugin {
  pan? : {
    enabled: boolean,
    mode: ZoomMode
  },
  limits?: {
    x : ZoomRange,
    y : ZoomRange
  },
  zoom: {
    wheel: ZoomWheel,
    pinch: {
      enabled: boolean
    },
    mode: ZoomMode;
  }
}

function makeZoomRange(min : ZoomRangeValue, max : ZoomRangeValue) : ZoomRange {
  return {
    min: min,
    max: max
  };
}

function makeZoomWheel(enabled: boolean = false, key : ZoomWheelModifierKey = null) {
  let w: ZoomWheel = {
    enabled: enabled
  };
  if(enabled && key!=null) {
    w.modifierKey=key;
  }
  return w;
}

export function makeZoomConfiguration(
  mode: ZoomMode,
  x: ZoomRange|null = null,
  y: ZoomRange|null = null,
  wheel: ZoomWheel|null = null,
  pinch: boolean = false,
  pan: boolean = false
) : ZoomPlugin {
  let z : ZoomPlugin = {
    limits: {
      x: x ?? makeZoomRange('original','original'),
      y: y ?? makeZoomRange(0,100)
    },
    zoom: {
      wheel: wheel ?? makeZoomWheel(),
      pinch: {
        enabled: pinch
      },
      mode: mode
    }
  };
  if(pan) {
    z.pan = {
      enabled: true,
      mode: mode
    };
  }
  return z;
}



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

interface Plugins {
  [index: string]: any
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
    plugins: Plugins
  }
}

export interface GraphicConfiguration    {
  configuration: ChartConfig,
  title: string,
  klass: string
}






// TODO add in plugin for zoom on graphs: chartjs-plugin-zoom: https://www.chartjs.org/chartjs-plugin-zoom/latest/guide/options.html
function MakeGraphicConfiguration(
  data: GraphDataSet,
  parameter:Parameter,
  zoom: ZoomPlugin|null = null
): GraphicConfiguration {
    let datasets = data.dataSet(parameter);
    let beacons = data.beacons.join(', ');

    let plugins: Plugins = {};
    if (zoom != null) {
      plugins.zoom = zoom;
    }
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
        },
        plugins: plugins
      }
    };
    return {
      configuration: configuration,
      title: `${parameter} for ${beacons} (${parameter.units})`,
      klass: parameter.toString()
  };
}

export function  MakeGraphicConfigurations(data: GraphDataSet) : GraphicConfiguration[] {
  let z = makeZoomConfiguration('x',null,null,makeZoomWheel(true),true,true);
  return Parameter.All.map(p => MakeGraphicConfiguration(data,p,z));
}
