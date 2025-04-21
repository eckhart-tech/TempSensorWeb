import {DOM} from "./dom";
import {DOMElement, DOMButton} from "./helper";
import {PaginatorEvent} from "../lists/events";

class Paginator extends DOMElement {
    total : number;
    pageSize : number;
    nPages : number;
    page: number;
    readonly event = 'paginator';


    constructor(resettable : boolean = true) {
        super('nav',{});
        this.total = 1;
        this.pageSize = 1;
        this.page = 0;
        this.nPages = 1;

        this.dom.append(new DOMButton('up').addListener(this.up));
        if(resettable) {
            this.dom.append(new DOMButton('reset').addListener(this.reset));
        }
        this.dom.append(new DOMButton('down').addListener(this.down));
    }

    load(total : number, pageSize : 100, zero: boolean = true) {
        this.total = total;
        this.pageSize = pageSize;
        this.nPages = Math.ceil(this.total / this.pageSize);
        this.page = (zero) ? 0 : Math.min(this.page,this.nPages-1);
        this.fire();
    }

    get first() { return this.page*this.pageSize; }
    get last() { return Math.min(this.first+this.pageSize, this.total); }

    up(_ : Event) {
        this.page = Math.min(this.page+1,this.nPages-1);
        this.fire();
    }
    down(_ : Event) {
        this.page = Math.max(this.page-1,0);
    }

    reset(_ : Event) {
        this.page=0;
        this.fire();
    }

    fire() {
        let first = this.page*this.pageSize;
        let last = Math.min(this.first+this.pageSize, this.total);
        this.dom.fire(new PaginatorEvent(this.first,this.last));
    }



}

export class DOMTable extends DOMElement {
  /**
   *
   * @param {[string]} headers
   * @param {[[string]]} rows
   * @param klass
   */


  readonly rows: string[][];
  body: DOM;
  dataRows: DOM[];
  readonly event : string = "click";

  constructor(
    headers: string[] = [],
    rows: string[][] = [],
    klass: string = null,
  ) {
    super("table");
    this.body = new DOM("tbody");
    this.dom
      .append(new DOM("thead").append(this.makeRow("th",headers)))
      .append(this.body);
    if (klass !== null) {
      this.dom.addClass(klass);
    }
    this.rows = rows;
    this.dataRows = [];
  }

  get length() {
    return this.rows.length;
  }

  /**
   *
   * @param {string} tag
   * @param {[string]} values
   * @returns {DOM}
   */
  private makeRow(tag: string, values: string[]): DOM {
    return new DOM("tr").appendAll(values.map((v) => new DOM(tag).text(v)));
  }

  load(first: number = 0, last: number = Number.POSITIVE_INFINITY) {
    let range = this.rows.filter((_, idx) => idx >= first && idx < last);
    this.dataRows = range.map((row, idx) => {
      return this.makeRow("td", row).setAttrs({index: idx});
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

}

type Constructible = new (...args : any[]) => {};
function Make<T extends Constructible>(Base : T) {
    return class S extends Base {};
}



export class SelectableDOMTable extends DOMTable {
    /**
     *
     * @param {number} idx
     * @returns {boolean}
     */
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

