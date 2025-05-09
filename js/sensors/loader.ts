import {ASRESTApi} from "./structure/restWrapper";
import {Beacon, Beacons} from "./beacons";
import {Record, Records} from './records';



export async function beaconLoader(): Promise<Beacons> {
    let loader = new ASRESTApi();
    let json = await loader.beacons();
    let m = new Map();

    let b = Object.keys(json).map(key => {
      return new Beacon(json[key].toString(), key.toString());
    });
    return new Beacons(b);
}

export async function recordLoader(days: number = 365) {
  let loader = new ASRESTApi();
  let json = await loader.data();

  let data = json.map((item: object) => new Record(item)).filter(
    (r: Record) => r.valid
  );
  return new Records(data);
}


