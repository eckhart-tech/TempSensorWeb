



import { BaseRecord, BaseRecordSet, Beacon, Beacons, Records } from "../sensors";
import {BeaconEvent, BeaconTable, RecordTable} from './lists';
import { XSet } from "./lists/XSet";


class XBeacons extends BaseRecordSet {
  allBeacons: Beacon[];

  constructor(beacons: Beacons, records: Records) {
    super();
    let standard = new XSet(beacons.items.map((b) => b.name));
    let present = new XSet(records.items.map((r) => r.sensor));
    let anomalous = present.difference(standard);
    let anomalousBeacons = [...anomalous].map((n) => new Beacon(n, "", true));

    this.allBeacons = beacons.items.concat(anomalousBeacons);
  }

  get items() {
    return this.allBeacons;
  }

  get keys(): string[] {
    return this.allBeacons.map((b) => b.name).toSorted();
  }

  filter(key: string): BaseRecord[] {
    return [];
  }
}


export class ApplicationGUI {
  private records: Records;
  private beacons: XBeacons | null;
  private beaconTable : BeaconTable | null;
  private recordTable : RecordTable | null;

  constructor() {
    this.records = new Records();
    this.beacons = null;



  }

  /**
   *
   * @param {BeaconEvent} event
   */
  callback(event: BeaconEvent) {
    console.log(event);
    console.log('Payload is', event, 'Table is', this.recordTable);

    this.recordTable?.filter(event.activeBeacons);
  }

  async load() {
    let beacons = new Beacons();
    await beacons.load();
    await this.records.load();
    this.beacons = new XBeacons(beacons,this.records);

    this.beaconTable = new BeaconTable();
    this.recordTable = new RecordTable();

    this.beaconTable.render(this.beacons);
    this.recordTable.render(this.records);


    document.addEventListener("beacon-list", e => this.callback(e));
    this.callback(new BeaconEvent());
  }
}
