import {DOM, DOMTable} from "../dom/dom";
import {BaseRecord, BaseRecordSet} from "../../sensors";



export abstract class Table {
    tag : string;
    base : DOM;
    rows : BaseRecord[];
    table: DOMTable;

    abstract Headers :string[];
    abstract Klass : string;

    /**
     * @template {string|number|Element} T
     * @param {T} x
     * @returns {T}
     */
    static check<T>(x: T): T {
        if (x === null || x === undefined || Number.isNaN(x)) {
            throw new Error("undefined");
        }
        return x;
    }

    static eventTargetParent(e: MouseEvent): Element {
        let target = Table.check(e.target as Element);
        let tag = Table.check(target.tagName).toUpperCase();
        switch (tag) {
            case "TD":
                return Table.check(target.parentElement);
            case "TR":
                return target;
            default:
                throw new Error(`Unexpected event source ${tag}`);
        }
    }

    constructor(tag: string) {
        this.tag = tag;
        this.base = DOM.withID(this.tag);
        this.rows = [];
        this.table = null;
    }

    abstract callback(event: MouseEvent) : void;

    render(data: BaseRecordSet): void {
        this.rows = data.items;
        let trs = this.rows.map((b) => b.array);
        this.table = new DOMTable(this.Headers, trs, this.Klass);
        let t = this.table
            .render()
            .addEventListener("click", (ev) => this.callback(ev as MouseEvent));
        this.base.empty().append(t);
    }
}