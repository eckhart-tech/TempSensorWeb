import { BaseRecordSet } from "./bases";
import { TimeRange} from "../items";

export class TimeRanges extends BaseRecordSet {
  data: TimeRange[];

  constructor(...ranges: TimeRange[]) {
    super();
    this.data = ranges;
  }

  get items(): TimeRange[] { return this.data; }
  filter(key: string) : TimeRange[] { return this.data; }



}