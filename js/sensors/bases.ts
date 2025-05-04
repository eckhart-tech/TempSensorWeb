import { ESSet } from "../lib/XSet";

export abstract class BaseRecord {

    abstract toString() : string;
    abstract get array() : string[];
    abstract get name() : string;
}

export abstract class BaseRecordSet {
    abstract get items() : BaseRecord[];
    get length(): number { return this.items.length; }
    abstract get keys() : string[];
    abstract filter(key: string) : BaseRecord[];


  get names() : ESSet<string> {
    return new ESSet(this.items.map((b) => b.name));
  }
}