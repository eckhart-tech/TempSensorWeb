import {DOM, DOMTable, SelectableDOMTable} from '../dom';
import {Beacon, Record} from '../../sensors';
import {Table} from './base';




export class RecordTable extends Table<DOMTable> {
    tag: string;
    base: DOM;
    rows: Record[];
    table: DOMTable;

    Headers = ["Name", "MAC", "Time", "Temperature (C)", "Humidity (%)", "Battery (%)"];
    Klass = "rec";



    constructor(tag = "records") {
        super(tag);
    }

    getNew(...args: any[]): DOMTable {
        return new DOMTable(...args);
    }

    callback(event: MouseEvent) {
        try {
            let row = RecordTable.eventTargetParent(event);
            let index = RecordTable.check(parseInt(new DOM(row).getAttr("index")));
            console.log(`Clicked on row ${index}`);
        } catch (e) {
            console.error(`Bad click : ${e.toString()}`);
        }
    }
}