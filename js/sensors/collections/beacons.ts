import { BaseRecordSet } from "./bases";
import { BaseRecord, Beacon } from "../items";
import { Records } from "./records";

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



export class ExtraBeacons extends BaseRecordSet {
  extraBeacons : Beacon[];

  constructor(records: Records, beacons: Beacons) {
    super();

    let extraNames = records.names.difference(beacons.names);
    this.extraBeacons = [...extraNames].map((n) => new Beacon(n, n, false));
  }

  setCounts(m : Map<string,number>) {
    this.extraBeacons.forEach(b => b.count = m.get(b.name) ?? 0);
  }

  get items() {
    return this.extraBeacons;
  }

  filter(_: string): BaseRecord[] {
    return [];
  }
}

