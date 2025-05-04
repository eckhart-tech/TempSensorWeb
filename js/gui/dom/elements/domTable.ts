import {DOM} from "../dom";
import {DOMElement} from "./base";


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
    title: string | null = null,
    klass: string | null = null
  ) {
    super("table");
    this.body = new DOM("tbody");
    if(title!==null) {
      this.dom.append(new DOM('caption').text(title));
    }
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

