import { ChartType } from "chart.js";
import { Chart } from "chart.js/auto";

export function chartInit() {
  Chart.defaults.animation = false;
  Chart.defaults.plugins.legend.display = true;
  Chart.defaults.plugins.title.display = false;
}

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


export interface GraphicConfiguration    {
  type: ChartType,
  data: {
    datasets: RecordItem[]
  },

  scales: {
    x: GraphicScale,
    y: GraphicScale
  }
}