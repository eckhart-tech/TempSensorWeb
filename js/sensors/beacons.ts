import { BaseRecord, BaseRecordSet } from "./bases";

export class Beacon extends BaseRecord {
  readonly name: string;
  readonly mac : string;
  readonly known: boolean;
  count : number;

  constructor(name: string, mac: string, known: boolean=true, count: number = 0) {
    super();
    this.name = name;
    this.mac = mac;
    this.known = known;
    this.count = count;
  }

  toString() {
    return `${this.name} [${this.mac}]'`;
  }

  get array() {
    return [this.name, this.mac];
  }

  get object() {
    return this;
  }
}

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

  /**
   *
   * @param {string} mac
   * @returns {Beacon}
   */
  get(mac: string): Beacon {
    let idx = this.beacons.findIndex((b) => b.mac === mac);
    if (idx < 0) {
      return new Beacon(mac, mac);
    } else {
      return this.beacons[idx];
    }
  }

  /**
   *
   * @param {number} idx
   * @returns {Beacon}
   */
  at(idx: number): Beacon {
    return this.beacons[idx];
  }

  filter(key: string): BaseRecord[] {
    return [];
  }
}
