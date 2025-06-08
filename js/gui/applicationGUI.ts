



import {
  BaseRecord,
  BaseRecordSet,
  Beacon,
  Beacons,
  Records,
  beaconLoader,
  recordLoader,
  TimeRanges,
  rangeLoader
} from "../sensors";
import {BeaconEvent, BeaconTable, RecordTable} from './lists';
import { ESSet } from "../lib";
import { Graphic } from "./graphs";
import { GraphDataSet } from "./graphs/graphData";
import { DOM, DOMButton } from "./dom";
import { CSVData, Downloader } from "../lib/file";
import { TimeRangeDisplay } from "./lists/TimeRangeDisplay";



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
  private rangeTable : TimeRangeDisplay;
  graphic : Graphic | null;
  controls: DOMButton;
  timeRange : TimeRanges;

  constructor() {
    this.records = new Records();
    this.beacons = new Beacons();
    this.timeRange = new TimeRanges();



    this.controls = new DOMButton('Download CSV','download');

    this.rangeTable = new TimeRangeDisplay('dates');
    this.beaconTable = new BeaconTable('beacons','Beacons','bcn-known');
    this.recordTable = new RecordTable('records');
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

  async download() {
    let csv = new CSVData(this.recordTable.Headers)
    csv.append(this.records.items)
    let d = new Downloader(csv.data,'records.csv');
    await d.download();

    console.log('Callback for downloading CSV');
  }

  async load() {
    this.timeRange = await rangeLoader();
    this.records = await recordLoader();
    this.beacons = await beaconLoader();

    console.log(this.timeRange.toString(),this.timeRange.items[0].dates, this.timeRange.items[0].timestamps);
    this.rangeTable.render(this.timeRange);

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
