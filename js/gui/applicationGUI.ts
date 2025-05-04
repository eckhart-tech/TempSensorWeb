



import { BaseRecord, BaseRecordSet, Beacon, Beacons, Records } from "../sensors";
import {BeaconEvent, BeaconTable, RecordTable} from './lists';



class ExtraBeacons extends BaseRecordSet {
  extraBeacons : Beacon[];

  constructor(records: Records, beacons: Beacons) {
    super();

    let extraNames = records.names.difference(beacons.names);
    this.extraBeacons = [...extraNames].map((n) => new Beacon(n, n));
  }

  get items() {
    return this.extraBeacons;
  }


  get keys(): string[] {
    return this.extraBeacons.map((b) => b.name).toSorted();
  }

  filter(key: string): BaseRecord[] {
    return [];
  }
}


export class ApplicationGUI {
  private records: Records;
  private beacons: Beacons;
  private extraBeacons : ExtraBeacons | null;
  private beaconTable : BeaconTable | null;
  private extraTable : BeaconTable | null;
  private recordTable : RecordTable | null;

  constructor() {
    this.records = new Records();
    this.beacons = new Beacons();



  }

  /**
   *
   * @param {BeaconEvent} event
   */
  callback(event: BeaconEvent) {
    console.log(event);

    let filter = new XSet(this.beaconTable.active.concat(this.extraTable.active).map(b => b.name));
    console.log('Payload is', filter, 'Table is', this.recordTable);
    this.recordTable?.filter(filter);
  }

  async load() {
    await this.records.load();
    await this.beacons.load();

    this.extraBeacons = new ExtraBeacons(this.records,this.beacons);
    console.log('Extra',this.extraBeacons);

    this.beaconTable = new BeaconTable('Known beacons','bcn-known');
    this.extraTable = new BeaconTable('Additional beacons','bcn-extra');
    this.recordTable = new RecordTable();

    this.beaconTable.render(this.beacons);
    if(this.extraBeacons.length>0) {
      this.extraTable.render(this.extraBeacons,false);
    }
    this.recordTable.render(this.records);


    document.addEventListener("beacon-list", e => this.callback(e));
    this.callback(new BeaconEvent());
  }
}
