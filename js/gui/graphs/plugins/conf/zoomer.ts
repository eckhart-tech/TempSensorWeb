import { AxisScaler, PlotDataSet } from "../../base";
import { Stack } from "../../../../lib";






export class ZoomManager {
  readonly plots: PlotDataSet;
  readonly root: AxisScaler;
  private stack: Stack<AxisScaler>;

  constructor(plots: PlotDataSet,length: number=1000) {
    this.plots=plots;
    this.root=plots.scaler(length);
    this.stack=new Stack<AxisScaler>;
  }

  get current() : AxisScaler {
    return this.stack.peek() ?? this.root;
  }

  zoomIn(start: number,end: number) {
    let s = this.current.part(start,end);
    if(s!==null) this.stack.push(s)
  }

  zoomOut() {
    this.stack.pop()
  }

  reset() {
    this.stack.empty();
  }

  filtered() {
    return this.plots.filter(this.current);
  }


}



