import { Tick } from "chart.js";
import { Format } from "../../../lib";

export interface GraphicScale {
  beginAtZero?: boolean,
  min?: number,
  max?: number,
  ticks: {
    callback: (value : number, index : number , ticks : Tick[]) => string,
    color? : string
  }
}

export type AxisRule = (value: number) => string;
const DefaultRule : AxisRule = (v) => v.toString();

export class AxisScaler {
  rule : AxisRule;


  constructor(rule: AxisRule = DefaultRule) {
    this.rule = rule;
  }

  get scale() : GraphicScale {
    return {
      ticks:  {
        callback: (value : number, index : number , ticks : Tick[]) => this.rule(value)
      }
    };
  }

}

export class UnitAxisScaler extends AxisScaler {

  constructor(unit: string) {
    super((v) => `${v}${unit}`);
  }
}

export class DateAxisScaler extends AxisScaler {
  constructor() {
    super((v) => Format.date(v));
  }
}




