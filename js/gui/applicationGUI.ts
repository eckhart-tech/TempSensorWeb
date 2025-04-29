



import { Beacons, Records } from "../sensors";
import {BeaconEvent, BeaconTable, RecordTable} from './lists';

export class ApplicationGUI {
  private records: Records;
  private beacons: Beacons;
  private beaconNames : Set<string>;
  private beaconTable : BeaconTable | null;
  private recordTable : RecordTable | null;

  constructor() {
    this.records = new Records();
    this.beacons = new Beacons();
    this.beaconNames = new Set();


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
    await this.beacons.load();
    await this.records.load();

    this.beaconNames = new Set(this.beacons.beacons.map(b => b.name));
    this.beaconTable = new BeaconTable();
    this.recordTable = new RecordTable(this.beaconNames);

    this.beaconTable.render(this.beacons);
    this.recordTable.render(this.records);


    document.addEventListener("beacon-list", e => this.callback(e));
    this.callback(new BeaconEvent());
  }
}
