import { BaseRecord, Recordable } from "./base";
import { convert, Format } from "../../lib";

export interface TimeRangeValues<T> {
  start: T,
  end: T
};

export class TimeRange extends BaseRecord {
  readonly start: Date;
  readonly end: Date;
  constructor(start: number|string|null=null, end: number|string|null=null) {
    super();
    this.start = (start == null) ? new Date(0) : convert(start).date;
    this.end = (end == null) ? new Date() : convert(end).date;
  }

  get timestamps() : TimeRangeValues<number> {
    return {
      start: this.start.getTime(),
      end: this.end.getTime()
    };
  }

  get dates() : TimeRangeValues<Date> {
    return {
      start: this.start,
      end: this.end
    };
  }

  get jScript() : TimeRangeValues<string> {
    return {
      start: Format.jScriptDate(this.start),
      end: Format.jScriptDate(this.end)
    };
  }

  get array() {
    return [this.jScript.start,this.jScript.end];
  }

  get object() {
    return this;
  }

  get name(): string {
    let a = this.array
    return `${a[0]}-${a[1]}`;
  }

  get raw(): Recordable[] {
    return [this.start, this.end];
  }




  toString(): string {
    return this.name;
  }
}