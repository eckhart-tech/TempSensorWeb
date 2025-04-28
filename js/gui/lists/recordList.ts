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

    reset() {
      this.tableRows.forEach(row => row.removeClass('hide'));
    }

    filter(names : string[]=[]) {
      console.log('Filtering with', names);
      if(names.length===0) { this.reset(); }
      else {
        let filters = new Set(names);
        this.tableRows.forEach((row, idx) => {
          let check = filters.has(this.rows[idx].sensor);
          (check) ? row.removeClass('hide') : row.addClass('hide');
        });

      }
    }
}