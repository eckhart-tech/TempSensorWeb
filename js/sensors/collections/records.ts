
import { BaseRecordSet } from "./bases";
import { Record, Beacon } from "../items";
import { ESSet , InitListDict } from "../../lib";

  export class Records extends BaseRecordSet {

  data : Record[];
  beacons : Beacon[];

  beaconData : InitListDict<string,Record>;
  min: Date;
  max: Date;
  constructor(records: Record[] = [],beacons: Beacon[] = []) {
    super();
    this.data = records;
    let times = records.map(r => r.timestamp.getTime());
    this.min = new Date(Math.min(...times));
    this.max = new Date(Math.max(...times));

    this.beacons = [];
    this.beaconData = new InitListDict();

    this.data.forEach(record => {
      this.beaconData.set(record.sensor,record);
    });

    let bNames = new ESSet(beacons.map(b => b.name));
    let extraNames = new ESSet(this.beaconData.keys).difference(bNames);
    this.beacons = [...extraNames].map(n => {
      return new Beacon(n, n, false);
    });
  }

  get items() { return this.data; }
  get count() : Map<string,number> {
    return this.beaconData.map(rs => rs.length);
  }


  get keys(): string[] {
    return this.beaconData.keys;
  }

  filter(key: string): Record[] {
    if(this.beaconData.has(key)) {
      return this.beaconData.get(key);
    }
    else {
      return [];
    }
  }








}

