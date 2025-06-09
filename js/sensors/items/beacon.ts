import { BaseRecord, Recordable } from "./base";

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

  get raw() : Recordable[] {
    return [
      this.name,
      this.mac,
      this.known,
      this.count
    ];
  }
}
