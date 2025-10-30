import {
  Chart,
  ChartData,
  ChartDataset,
  ChartEvent,
  ChartType,
  ChartTypeRegistry,
  LegendElement,
  LegendItem,
  PluginOptionsByType,
  Point,
  Tick,
} from "chart.js";

export type EventKey = keyof HTMLElementEventMap;

export interface RecordItem {
  label: string;
  data: Point[];
}

export function ToRecordItem(s: ChartDataset<ChartType, Point[]>): RecordItem {
  return {
    label: s.label,
    data: s.data,
  };
}




export interface Plugins  {
  [index: string]: any;
}




export type GraphicScaleTicks = (value : number, index : number , ticks : Tick[]) => string;
export interface GraphicScale {
  beginAtZero?: boolean,
  min?: number,
  max?: number,
  ticks: {
    callback: GraphicScaleTicks,
    color? : string
  }
}

export function makeGraphicScale(ticks: GraphicScaleTicks,beginAtZero: boolean = false) : GraphicScale {
  return {
    beginAtZero: beginAtZero,
    ticks: {
      callback: ticks
    }
  };
}




