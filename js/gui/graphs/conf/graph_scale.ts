import { Tick } from "chart.js";

export interface GraphicScale {
  beginAtZero?: boolean,
  min?: number,
  max?: number,
  ticks: {
    callback: (value : number, index : number , ticks : Tick[]) => string,
    color? : string
  }
}