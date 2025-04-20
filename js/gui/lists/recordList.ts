import {DOM, DOMTable} from '../dom';
import {Beacon, Record} from '../../sensors';
import {Table} from './base';




export class RecordTable extends Table {
    tag: string;
    base: DOM;
    rows: Record[];
    table: DOMTable;

    Headers = ["Name", "MAC", "Time", "Temperature", "Humidity", "Battery"];
    Klass = "rec";



    constructor(tag = "records") {
        super(tag);
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