import { ChartType } from "chart.js";
import { EventKey, GraphicScale, Plugins, RecordItem } from "./configurations";

export interface GraphicOptions {
  scales: {
    x: GraphicScale,
    y: GraphicScale
  },
  events: EventKey[],
  plugins: Plugins
}

export interface ChartConfig {
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