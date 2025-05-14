import { DOMElement } from "./base";
import { DOM } from "../dom";

export enum TableUnit {
  Header = 'th',
  Data = 'td'
}


export class DOMTableBase extends DOMElement {
  headers: string[];
  klass : string | null;
  readonly rows: DOM[][];
  dataRows: DOM[];
  readonly event : string = "click";

  constructor(
                        headers: string[] = [],
                        rows: DOM[][] = [],
                        klass: string | null = null,
  ) {
    super('table');
    this.headers=headers;
    this.klass=klass;


    this.rows = rows;
    this.dataRows = [];
  }

  get length() {
    return this.rows.length;
  }

  load(first: number = 0, last: number = Number.POSITIVE_INFINITY) {

    this.dom.empty();
    if(this.headers.length>0) {
      let headerItems : DOM[] = this.headers.map(h => new DOM('th').text(h));
      this.dom.append(new DOM('tr').appendAll(headerItems));
    }
    if (this.klass !== null) {
      this.dom.addClass(this.klass);
    }

    let range = this.rows.filter((_, idx) => idx >= first && idx < last);
    this.dataRows = range.map((row, idx) => {
      return new DOM('tr').setAttrs({index: idx}).appendAll(row);
    });
    this.dom.appendAll(this.dataRows);
  }

  addListener(
    listener: EventListenerOrEventListenerObject,
    options: AddEventListenerOptions = null,
  ) {
    this.dom.addEventListener("click",listener,options);
    return this.dom;
  }

  toggleRow(idx: number): boolean {
    let row = this.dataRows[idx];
    return row.toggleClass("active");
  }

  get activeRows(): DOM[] {
    return this.dataRows.filter((row) => row.hasClass("active"));
  }

  get activeIndices(): number[] {
    return this.activeRows.map((row) => parseInt(row.getAttr("index")));
  }

  resetRows() {
    this.dataRows.forEach((r) => r.removeClass("active"));
  }
  setRows() {
    this.dataRows.forEach((r) => r.addClass("active"));
  }
}
