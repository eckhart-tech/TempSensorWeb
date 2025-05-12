import { DOMElement } from "./base";
import { DOM } from "../dom";

export enum TableUnit {
  Header = 'th',
  Data = 'td'
}


export class DOMTableBase extends DOMElement {
  readonly rows: DOMElement[];
  body: DOM;
  dataRows: DOM[];
  readonly event : string = "click";

  constructor(tag: string,
                        body: string,
                        headers: DOMElement|null = null,
                        rows: DOMElement[] = [],
                        title: string | null = null,
                        klass: string | null = null,
  ) {
    super(tag);
    this.body = new DOM(body);
    let headerItems : DOM[] = (headers===null) ? [] : [headers.dom];
    if(title!==null) {
      headerItems.splice(0,0,new DOM('h1').text(title));
    }
    this.dom.appendAll([
      new DOM('header').appendAll(headerItems),
      this.body
    ]);
    if (klass !== null) {
      this.dom.addClass(klass);
    }
    this.rows = rows;
    this.dataRows = [];
  }

  get length() {
    return this.rows.length;
  }

  load(first: number = 0, last: number = Number.POSITIVE_INFINITY) {
    let range = this.rows.filter((_, idx) => idx >= first && idx < last);
    this.dataRows = range.map((row, idx) => {
      return row.dom.setAttrs({index: idx});
    });
    this.body.empty().appendAll(this.dataRows);
  }

  addListener(
    listener: EventListenerOrEventListenerObject,
    options: AddEventListenerOptions = null,
  ) {
    this.body.addEventListener("click",listener,options);
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
