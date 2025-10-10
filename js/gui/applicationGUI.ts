



import {
  Beacons,
  ExtraBeacons,
  Records,
  beaconLoader,
  recordLoader,
  TimeRanges,
  rangeLoader,
  CSVData
} from "../sensors";
import { BeaconEvent, BeaconTable, RecordHeaders, RecordTable, TimeRangeDisplay } from "./lists";
import { ESSet, Downloader } from "../lib";
import { Graphic } from "./graphs";
import { GraphDataSet } from "./graphs/graphData";
import { DOM, DOMButton } from "./dom";





const SHOW_TABLE = false;

export class ApplicationGUI {
  private records: Records;
  private beacons: Beacons;
  private extraBeacons : ExtraBeacons | null;
  private beaconTable : BeaconTable;
  private recordTable : RecordTable | null;
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
    if(SHOW_TABLE) { this.recordTable = new RecordTable('records'); }
  }

  /**
   *
   * @param {BeaconEvent} event
   */
  async callback(event: BeaconEvent) {
    console.log(event);

    let filter = new ESSet(this.beaconTable.active.map(b => b.name));
    if(SHOW_TABLE) {
      console.log('Payload is', filter, 'Table is', this.recordTable);
      this.recordTable?.filter(filter);
    }
    let temps = new GraphDataSet(this.records,[...filter]);
    await this.graphic.render(temps);
  }

  async download() {
    let csv = new CSVData(RecordHeaders);
    csv.append(this.records.items);
    let d = new Downloader(csv.raw,'records.csv');
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
    if(SHOW_TABLE) { this.recordTable.render(this.records); }

    this.controls.addListener(_ => this.download());
    this.controls.add('data');

    this.graphic = new Graphic('graph');

    document.addEventListener("beacon-list", e => this.callback(e));
    await this.callback(new BeaconEvent());
  }
}
