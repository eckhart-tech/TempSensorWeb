import { DOM, DOMElement, DOMTableBase } from "../dom";
import {BaseRecord, BaseRecordSet} from "../../sensors";

export abstract class Table {
  tag: string;

  base: DOM;
  rows: BaseRecord[];
  table: DOMTableBase;

  abstract Headers: string[];
  Klass: string;
  title : string | null;



  protected constructor(
    tag: string,
    klass: string,
    title : string|null = null) {
    this.base = DOM.withID(tag);
    this.rows = [];
    this.table = null;
    this.Klass = klass;
    this.title = title;

  }

  abstract callback(event: MouseEvent): void;

  abstract makeRow(row: BaseRecord) : DOM[];

  render(...data: BaseRecordSet[]): void {



    this.rows = [].concat(...data.map(d => d.items));
    let trs = this.rows.map((b) => this.makeRow(b));
    this.table = new DOMTableBase(
      this.Headers,
      trs,
      this.Klass
    );
    this.table.load();
    this.table.addListener((ev) => this.callback(ev as MouseEvent));
    this.base.empty();
    if(this.title!==null) {
      this.base.append(new DOM('h1').text(this.title));
    }
    this.base.append(this.table.dom);
  }

  get tableRows(): DOM[] {
    return this.table.dataRows;
  }

  get activeRows(): DOM[] {
    return this.table.activeRows;
  }

  get activeIndices(): number[] {
    return this.table.activeIndices;
  }
}