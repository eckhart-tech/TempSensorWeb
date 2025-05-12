



import { BaseRecord, BaseRecordSet, Beacon, Beacons, Records, beaconLoader, recordLoader } from "../sensors";
import {BeaconEvent, BeaconTable, RecordTable} from './lists';
import { ESSet } from "../lib/XSet";
import { Graphic } from "./graphs";
import { GraphDataSet } from "./graphs/graphData";



class ExtraBeacons extends BaseRecordSet {
  extraBeacons : Beacon[];

  constructor(records: Records, beacons: Beacons) {
    super();

    let extraNames = records.names.difference(beacons.names);
    this.extraBeacons = [...extraNames].map((n) => new Beacon(n, n, false));
  }

  get items() {
    return this.extraBeacons;
  }




  filter(key: string): BaseRecord[] {
    return [];
  }
}


export class ApplicationGUI {
  private records: Records;
  private beacons: Beacons;
  private extraBeacons : ExtraBeacons | null;
  private beaconTable : BeaconTable;
  private extraTable : BeaconTable;
  private recordTable : RecordTable;
  graphic : Graphic | null;

  constructor() {
    this.records = new Records();
    this.beacons = new Beacons();


    this.beaconTable = new BeaconTable('Known beacons','bcn-known');
    this.extraTable = new BeaconTable('Additional beacons','bcn-extra');
    this.recordTable = new RecordTable();
  }

  /**
   *
   * @param {BeaconEvent} event
   */
  async callback(event: BeaconEvent) {
    console.log(event);

    let filter = new ESSet(this.beaconTable.active.concat(this.extraTable.active).map(b => b.name));
    console.log('Payload is', filter, 'Table is', this.recordTable);
    this.recordTable?.filter(filter);

    let temps = new GraphDataSet(this.records,[...filter]);
    await this.graphic.render(temps);
  }

  async load() {
    this.records = await recordLoader();
    this.beacons = await beaconLoader();

    this.extraBeacons = new ExtraBeacons(this.records,this.beacons);
    console.log('Extra',this.extraBeacons);


    this.beaconTable.render(this.beacons);
    if(this.extraBeacons.length>0) {
      this.extraTable.render(this.extraBeacons,false);
    }
    this.recordTable.render(this.records);

    this.graphic = new Graphic('graph');


    document.addEventListener("beacon-list", e => this.callback(e));
    await this.callback(new BeaconEvent());
  }
}
