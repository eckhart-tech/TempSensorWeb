import { Beacons } from "../collections";
import { ASRESTApi } from "./restWrapper";
import { Beacon } from "../items";


export async function beaconLoader(): Promise<Beacons> {
  let loader = new ASRESTApi();
  let json = await loader.beacons();

  let b = Object.keys(json).map(key => {
    return new Beacon(json[key].toString(), key.toString());
  });
  return new Beacons(b);
}