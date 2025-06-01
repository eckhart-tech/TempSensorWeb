import { BaseRecord } from "./base";
import { convert, Format } from "../../lib";

export class TimeRange extends BaseRecord {
  readonly start: number;
  readonly end: number;
  constructor(start: number, end: number) {
    super();
    this.start = start;
    this.end = end;
  }

  get timestamps() : number[] {
    return [this.start, this.end];
  }

  get dates() : Date[] {
    return [convert(this.start).date, convert(this.end).date]
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