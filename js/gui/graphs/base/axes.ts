
import {Point} from './geometry';

export type GraphicScaleTickLabeller = (
  value: any,
  index: any,
) => string;

export class GraphicAxis {
  name: string;
  labeller: GraphicScaleTickLabeller;
  colour: string;

  constructor(name: string,labeller: GraphicScaleTickLabeller,colour: string = 'black') {
    this.name=name;
    this.labeller=labeller;
    this.colour=colour;
  }

  label(value: any,index: any) : string {
    return this.labeller(value,index);
  }
}

export class AxisScaler {
  readonly length : number;
  readonly start : number;
  readonly end : number;

  private scale : number;

  constructor(start: number, end: number, length: number) {
    this.length=Math.max(length-1,0);

    this.start=start;
    this.end=end;
    this.scale=(this.length<1) ? 0 : (this.end-this.start)/this.length;
  }
  value(index: number) : number {
    let v = this.start + index * this.scale;
    return Math.max(this.start,Math.min(this.end,v)); }

  index(value: number) : number {
    let v = Math.round((value - this.start) / this.scale);
    return Math.max(0,Math.min(this.length,v)); }

  contains(value : number) : boolean {
    return this.start <= value && value <=this.end;
  }

  part(start: number, end: number) : AxisScaler|null {
    let s = this.index(start);
    let e = this.index(end);
    if(0<=s && s<=e) { return new AxisScaler(s, e, e - s); }
    else { return null; }
  }
}




