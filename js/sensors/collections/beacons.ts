import { BaseRecordSet } from "./bases";
import { Beacon} from "../items";

export class Beacons extends BaseRecordSet {
  beacons: Beacon[];
  constructor(beacons : Beacon[] = []) {
    super();
    this.beacons = beacons;
  }

  get items() {
    return this.beacons;
  }

  setCounts(m : Map<string,number>) {
    this.beacons.forEach(b => b.count = m.get(b.name) ?? 0);
  }




  filter(key: string): Beacon[] {
    return [];
  }
}
