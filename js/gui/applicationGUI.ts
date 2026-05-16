



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
import { Downloader } from "../lib";
import { Graphic } from "./graphs";
import { GraphDataSet } from "./graphs/graphData";
import { DOM, DOMButton } from "./dom";
import { DateRangeEvent, TimeRangeControl } from "./lists/TimeRangeDisplay";


export class Notifications {
  static base : DOM;
  static {
    this.base = DOM.withID('notifications');
  }

  static reset() {
    this.base.empty();
  }

  static load(tag : string, lines : string[]) {
    this.reset();
    let paragraphs = lines.map(text => new DOM('p').text(text));
    this.base.append(new DOM('div').addClass(tag).appendAll(paragraphs));
  }
}


const SHOW_TABLE = false;

export class ApplicationGUI {
  private records: Records;
  private beacons: Beacons;
  private extraBeacons : ExtraBeacons | null;
  private beaconTable : BeaconTable;
  private recordTable : RecordTable | null;
  private rangeTable : TimeRangeDisplay;
  private rangeControls : TimeRangeControl;
  graphic : Graphic | null;
  controls: DOMButton;
  timeRange : TimeRanges;


  private daysToDisplay: number = 30;

  constructor() {
    this.records = new Records();
    this.beacons = new Beacons();
    this.timeRange = new TimeRanges();

    this.controls = new DOMButton('Download CSV','download');
    this.rangeTable = new TimeRangeDisplay('dates');
    this.rangeControls = new TimeRangeControl('ranges');
    this.beaconTable = new BeaconTable('beacons','Beacons','bcn-known');
    if(SHOW_TABLE) { this.recordTable = new RecordTable('records'); }
  }

  /**
   *
   * @param {BeaconEvent} event
   */
  async callback(event: BeaconEvent) {
    console.log(event);
    await this.reload();
  }

  async adjust(event: DateRangeEvent) {
    this.daysToDisplay=event.nDays;
    await this.reload();
  }

  async download() {
    let csv = new CSVData(RecordHeaders);
    csv.append(this.records.items);
    let d = new Downloader(csv.raw,'records.csv');
    await d.download();

    console.log('Callback for downloading CSV');
  }

  async reload() {
    let temps = new GraphDataSet(
      this.records,
      this.beaconTable.active,
      this.daysToDisplay,
    );
    await this.graphic.render(temps);
  }

  async load() {
    Notifications.load('waiting',['Loading...'])

    this.timeRange = await rangeLoader();
    this.records = await recordLoader();
    this.beacons = await beaconLoader();

    console.log(this.timeRange.toString(),this.timeRange.items[0].dates, this.timeRange.items[0].timestamps);
    this.rangeTable.render(this.timeRange);
    this.rangeControls.render();

    this.extraBeacons = new ExtraBeacons(this.records,this.beacons);

    console.log('Extra',this.extraBeacons);
    let c = this.records.counts;
    this.beacons.setCounts(c);
    this.extraBeacons.setCounts(c);

    Notifications.reset();

    this.beaconTable.render(this.beacons,this.extraBeacons);
    if(SHOW_TABLE) { this.recordTable.render(this.records); }

    this.controls.addListener(_ => this.download());
    this.controls.add('data');

    this.graphic = new Graphic('graph');

    document.addEventListener("beacon-list", e => this.callback(e));
    document.addEventListener("date-range", e => this.adjust(e as DateRangeEvent));
    this.rangeControls.fire();


  }
}
