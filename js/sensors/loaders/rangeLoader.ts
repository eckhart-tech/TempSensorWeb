import { TimeRange } from "../items";
import { ASRESTApi } from "./restWrapper";

export async function rangeLoader() : Promise<TimeRange> {
  let loader = new ASRESTApi();
  let json = await loader.range();
  return new TimeRange(json['start'],json['end']);
}