import { TimeRange } from "../items";
import { TimeRanges } from "../collections";
import { ASRESTApi } from "./restWrapper";

export async function rangeLoader() : Promise<TimeRanges> {
  let loader = new ASRESTApi();
  let json = await loader.range();
  let r = new TimeRange(json['start'],json['end']);
  return new TimeRanges(r);
}