



import { Beacons, Records } from "../sensors";
import {BeaconEvent, BeaconTable, RecordTable} from './lists';

export class ApplicationGUI {
  private records: Records;
  private beacons: Beacons;
  private beaconTable : BeaconTable;
  private recordTable : RecordTable;

  constructor() {
    this.records = new Records();
    this.beacons = new Beacons();
    this.beaconTable = new BeaconTable();
    this.recordTable = new RecordTable();

  }

  /**
   *
   * @param {BeaconEvent} event
   */
  callback(event: BeaconEvent) {
    console.log(event);
    let filter = event.active.map(beacon => beacon.name);
    console.log('Filter is', filter, 'Table is', this.recordTable);

    this.recordTable.filter(filter);
  }

  async load() {
    await this.beacons.load();
    await this.records.load();


    this.beaconTable.render(this.beacons);
    this.recordTable.render(this.records);

    document.addEventListener("beacon-list", e => this.callback(e));
  }
}
