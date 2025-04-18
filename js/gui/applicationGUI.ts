



import { Beacons, Records } from "../sensors/loader";
import {BeaconEvent, BeaconTable} from './beaconList';

export class ApplicationGUI {
  private records: Records;
  private beacons: Beacons;

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
  }

  async load() {
    await this.beacons.load();
    await this.records.load();

    let b = new BeaconTable();
    b.render(this.beacons);

    document.addEventListener("beacon-list", this.callback);
  }
}
