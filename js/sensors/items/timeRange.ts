import { BaseRecord } from "./base";
import { convert, Format } from "../../lib";

export class TimeRange extends BaseRecord {
  readonly start: Date;
  readonly end: Date;
  constructor(start: number|string, end: number|string) {
    super();
    this.start = convert(start).date;
    this.end = convert(end).date;
  }

  get timestamps() : number[] {
    return [this.start.getTime(), this.end.getTime()];
  }

  get dates() : Date[] {
    return [this.start,this.end]
  }

  get array() {
    return this.dates.map(d => Format.date(d));
  }

  get object() {
    return this;
  }

  get name(): string {
    return "range";
  }


  toString(): string {
    return this.array.join(' ');
  }
}