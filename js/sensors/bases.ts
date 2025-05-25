import { ESSet } from "../lib/XSet";



export abstract class BaseRecord {

    abstract toString() : string;
    abstract get array() : string[];
    abstract get name() : string;
}

export abstract class BaseRecordSet {
    abstract get items() : BaseRecord[];
    get length(): number { return this.items.length; }
    abstract filter(key: string) : BaseRecord[];


  get names() : ESSet<string> {
    return new ESSet(this.items.map((b) => b.name));
  }

  get counts() : Map<string,number> {
    let map = new Map<string,number>();
    this.items.forEach(b => {
      let n=b.name;
      if(!map.has(n)) {
        map.set(n,0);
      }
      map.set(n,map.get(n)+1);
    });
    return map;
  }
}