import { ChartArea, Point } from "chart.js";

interface Interval {
  start: number,
  end: number
}

export class OrderedInterval implements Interval {
  readonly start: number;
  readonly end: number;

  constructor(start: number = 0, end: number = 0) {
    this.start = Math.min(start,end);
    this.end = Math.max(start,end);
  }

  get length() : number { return this.end-this.start; }

  contains(n : number) : boolean {
    return (this.start <= n) && (n <= this.end);
  }
}

export class Region implements ChartArea {
  xAxis: OrderedInterval;
  yAxis: OrderedInterval;

  constructor(p1: Point, p2: Point) {
    this.xAxis=new OrderedInterval(p1.x,p2.x);
    this.yAxis=new OrderedInterval(p1.y,p2.y);
  }

  get left() : number { return this.xAxis.start; }
  get right() : number { return this.xAxis.end; }
  get bottom() : number { return this.yAxis.start; }
  get top() : number { return this.yAxis.end; }

  get width() : number { return this.xAxis.length; }
  get height() : number { return this.yAxis.length; }

  contains(p : Point) : boolean {
    return this.xAxis.contains(p.x) && this.yAxis.contains(p.y);
  }
}

