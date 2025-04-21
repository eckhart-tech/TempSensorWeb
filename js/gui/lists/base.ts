import {DOM, DOMTable} from "../dom";
import {BaseRecord, BaseRecordSet} from "../../sensors";



export abstract class Table<TAB extends DOMTable> {
    tag : string;
    base : DOM;
    rows : BaseRecord[];
    table: TAB;

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

    protected constructor(tag: string) {
        this.tag = tag;
        this.base = DOM.withID(this.tag);
        this.rows = [];
        this.table = null;
    }

    abstract callback(event: MouseEvent) : void;
    abstract getNew(...args: any[]) : TAB;

    render(data: BaseRecordSet): void {
        this.rows = data.items;
        let trs = this.rows.map((b) => b.array);
        this.table = this.getNew(this.Headers, trs, this.Klass);
        this.table.load()
        this.table.addListener((ev) => this.callback(ev as MouseEvent));
        this.base.empty().append(this.table.dom);
    }
}