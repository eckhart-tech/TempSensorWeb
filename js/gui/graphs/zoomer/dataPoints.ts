import { ChartType, Point, BubbleDataPoint } from "chart.js";
import { Chart } from "chart.js/auto";

type ChartPointType = number | [number,number] | Point | BubbleDataPoint;
class PointInDataSet {
  readonly label : string;
  readonly value: ChartPointType;

  constructor(chart: Chart<ChartType>, dataset: number, position: number) {
    let ds = chart.data.datasets[dataset];
    this.value = ds.data[position];
    this.label = ds.label;
  }

  get x() : number|null {
    if(typeof this.value === 'number') { return this.value; }
    else if ("length" in this.value) { return this.value[0]; }
    else if("x" in this.value) { return this.value.x; }
    else { return this.value as number; }
  }


}