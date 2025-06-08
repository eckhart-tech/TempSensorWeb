import { DOM, DOMElement, DOMTableBase } from "../dom";
import {BaseRecord, BaseRecordSet} from "../../sensors";

export abstract class GUIBase {
  Klass: string;
  title : string | null;
  base: DOM;

  protected constructor(
    id: string,
    klass: string,
    title : string|null = null) {
    this.base = DOM.withID(id);
    this.Klass = klass;
    this.title = title;
  }

  abstract render(...data: BaseRecordSet[]): void;
}

export abstract class Table extends GUIBase {



  rows: BaseRecord[];
  table: DOMTableBase;

  abstract Headers: string[];




  /**
   *
    * @param {string} id The ID of the HTML element to which the structure should be attached
   * @param klass The class (if any) to be attached to the object
   * @param title The title to attach to it
   * @protected
   */
  protected constructor(
    id: string,
    klass: string,
    title : string|null = null) {
    super(id,klass,title);
    this.rows = [];
    this.table = null;

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