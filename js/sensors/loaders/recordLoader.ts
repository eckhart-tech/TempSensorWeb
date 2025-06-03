import { ASRESTApi } from "./restWrapper";
import { Record } from "../items";
import { Records } from "../collections";

export async function recordLoader(days: number = 365) {
  let loader = new ASRESTApi();
  let json = await loader.data();

  let data = json.map((item: object) => new Record(item)).filter(
    (r: Record) => r.valid
  );
  return new Records(data);
}