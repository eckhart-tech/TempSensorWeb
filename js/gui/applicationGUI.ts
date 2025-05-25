



import { BaseRecord, BaseRecordSet, Beacon, Beacons, Records, beaconLoader, recordLoader } from "../sensors";
import {BeaconEvent, BeaconTable, RecordTable} from './lists';
import { ESSet } from "../lib/XSet";
import { Graphic } from "./graphs";
import { GraphDataSet } from "./graphs/graphData";
import { DOMButton } from "./dom";



class ExtraBeacons extends BaseRecordSet {
  extraBeacons : Beacon[];

  constructor(records: Records, beacons: Beacons) {
    super();

    let extraNames = records.names.difference(beacons.names);
    this.extraBeacons = [...extraNames].map((n) => new Beacon(n, n, false));


  }

  setCounts(m : Map<string,number>) {
    this.extraBeacons.forEach(b => b.count = m.get(b.name) ?? 0);
  }

  get items() {
    return this.extraBeacons;
  }



  filter(_: string): BaseRecord[] {
    return [];
  }
}


export class ApplicationGUI {
  private records: Records;
  private beacons: Beacons;
  private extraBeacons : ExtraBeacons | null;
  private beaconTable : BeaconTable;
  private recordTable : RecordTable;
  graphic : Graphic | null;
  controls: DOMButton;

  constructor() {
    this.records = new Records();
    this.beacons = new Beacons();
    this.controls = new DOMButton('Download CSV','download');


    this.beaconTable = new BeaconTable('Beacons','bcn-known');
    this.recordTable = new RecordTable();
  }

  /**
   *
   * @param {BeaconEvent} event
   */
  async callback(event: BeaconEvent) {
    console.log(event);

    let filter = new ESSet(this.beaconTable.active.map(b => b.name));
    console.log('Payload is', filter, 'Table is', this.recordTable);
    this.recordTable?.filter(filter);

    let temps = new GraphDataSet(this.records,[...filter]);
    await this.graphic.render(temps);
  }

  download() {
    console.log('Callback for downloading CSV');
  }

  async load() {
    this.records = await recordLoader();
    this.beacons = await beaconLoader();

    this.extraBeacons = new ExtraBeacons(this.records,this.beacons);
    console.log('Extra',this.extraBeacons);
    let c = this.records.counts;
    this.beacons.setCounts(c);
    this.extraBeacons.setCounts(c);


    this.beaconTable.render(this.beacons,this.extraBeacons);
    this.recordTable.render(this.records);

    this.controls.addListener(_ => this.download());
    this.controls.add('data');

    this.graphic = new Graphic('graph');


    document.addEventListener("beacon-list", e => this.callback(e));
    await this.callback(new BeaconEvent());
  }
}
