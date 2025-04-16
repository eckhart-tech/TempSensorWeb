import {DOM, DOMTable} from './dom';
import {Beacons} from '../sensors/loader';

export { BeaconTable };

class BeaconTable {
    constructor(tag='beacons') {
        this.tag = tag;
        this.base = DOM.withID(this.tag);
        this.rows = [];



    }

    /**
     *
     * @param {MouseEvent} event
     */
    callback(event) {
        let idx = -1;

        let target = event.target;
        let tag = target.tagName.toUpperCase();
        let r = (tag==='TD') ? target.parentElement : ((tag==='TR') ? target : null);
        if(r===null) {
            console.log('Not a a data item or row');
            return;
        }
        let index = new DOM(r).getAttr('index');
        if(index===null) {
            console.log('Not a data row');
        }
        let row = this.rows[index];
        console.log(`Clicked on row ${index} :`,row);

    }

    /**
     *
     * @param {Beacons} data
     */
    render(data) {
        this.rows = data.keys.map(key => {
            let value = data.get(key);
            return [value,key];
        });
        let table = new DOMTable(['Name','MAC'],this.rows, 'bcn');
        let dom = table.render().addEventListener('click',ev => this.callback(ev));
        this.base.empty().append(dom);
    }
}