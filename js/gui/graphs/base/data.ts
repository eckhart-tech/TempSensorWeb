import { Point } from "./geometry";
import { AxisScaler } from "./axes";


export class PlotData {
  name: string;
  data: Point[];
  private readonly indices: number[];
  readonly first : Point;
  readonly last: Point;
  readonly length: number;

  constructor(name: string, data: Point[]) {
    this.name = name;
    this.data = data;
    this.indices = data.map(p => p.x);

    this.length = this.indices.length;
    this.first = this.data[0];
    this.last = this.data[this.length-1];
  }


  inRange(value: number) : boolean { return value>=this.first.x && value<=this.last.x;  }
  value(index: number) : number { return this.indices[index]; }


  filter(
    scaler: AxisScaler
  ): Point[] {
    return this.data.filter((p) => p.x > scaler.start && p.x < scaler.end);
  }
}

export class PlotDataSet {
  readonly name: string;
  datasets: PlotData[];
  readonly globalStart: number;
  readonly globalEnd: number;

  constructor(name: string,datasets: PlotData[]) {
    this.name=name;
    this.datasets=datasets;
    this.globalStart=Math.min(...datasets.map(s => s.first.x));
    this.globalEnd=Math.max(...datasets.map(s => s.last.x));
  }

  data(index: number): PlotData { return this.datasets[index]; }
  scaler(length: number) : AxisScaler { return new AxisScaler(this.globalStart,this.globalEnd,length); }

  filter(scaler: AxisScaler) : PlotData[] {
    return this.datasets
      .map(plot => new PlotData(plot.name,plot.filter(scaler)))
      .filter(plot => plot.length>0);
  }
}
