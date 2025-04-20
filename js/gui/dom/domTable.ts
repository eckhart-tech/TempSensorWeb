import {DOM} from "./dom";
import {DOMHelper} from "./helper";
import {PaginatorEvent} from "../lists/events";

class Paginator {
    readonly total : number;
    readonly pageSize : number;
    readonly nPages : number;
    page: number;
    base : DOM;


    constructor(total : number, pageSize : number = 10) {
        this.total = total;
        this.pageSize = pageSize;
        this.nPages = Math.ceil(this.total / this.pageSize);
        this.base = new DOM('nav');
        this.page = 0;
    }

    get first() { return this.page*this.pageSize; }
    get last() { return Math.min(this.first+this.pageSize, this.total); }

    up() {
        this.page = Math.min(this.page+1,this.nPages-1);
    }
    down() {
        this.page = Math.max(this.page-1,0);
    }

    reset() {
        this.page=0;
    }

    fire() {
        this.base.fire(new PaginatorEvent(this.first,this.last));
    }






    callback(event: Event) {
        let dir = new DOM(event.target as Element).getAttr("button");
        if (dir==='up') { this.up(); }
        else if (dir==='down') { this.down(); }
        this.fire();

    }

    render(table : DOMTable) {
        let u = DOMHelper.Button('Next','up');
        let d = DOMHelper.Button('Previous','down');
        this.base.append(u).append(d).addEventListener('click',this.callback);
        table.paginate(this);
        return this.base;
    }

}

export class DOMTable {
    /**
     *
     * @param {[string]} headers
     * @param {[[string]]} rows
     * @param klass
     */

    headers : string[];
    rows : string[][];
    header : DOM;
    table : DOM;
    dataRows : DOM[];
    range : number[]

    constructor(
        headers: string[] = [],
        rows: string[][] = [],
        klass: string = null
    ) {
        this.headers = headers.map((h) => h.toString());
        this.rows = rows;
        this.table = new DOM("table");
        this.header= this.makeRow("th", this.headers);
        this.dataRows = [];
        if (klass !== null) {
            this.table.addClass(klass);
        }
        this.range = this.rows.map((_,idx) => idx);

    }

    paginate(paginator : Paginator) {
        this.table.addEventListener('paginator',this.rangeCallback);
        paginator.fire();
    }

    reload(rows: string[][] = []) {
        this.rows = rows;
        this.range = this.rows.map((_,idx) => idx);
        this.render();
    }

    /**
     *
     * @param {string} tag
     * @param {[string]} values
     * @returns {DOM}
     */
    makeRow(tag: string, values: string[]): DOM {
        return new DOM("tr").appendAll(values.map((v) => new DOM(tag).text(v)));
    }

    rangeCallback(e : PaginatorEvent) {
        this.range = e.range;
        this.render();
    }

    render(): DOM {
        this.dataRows = this.range.map(idx => {
            return this.makeRow("td",this.rows[idx]).setAttrs({
                index: idx,
            });
        });
        this.table.empty().append(this.header).appendAll(this.dataRows);
        return this.table;
    }

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

    get dom(): DOM {
        return this.table;
    }

}

