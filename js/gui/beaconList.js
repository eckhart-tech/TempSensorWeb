import {DOM, DOMTable} from './dom';
import {Beacon, Beacons} from '../sensors/loader';

export { BeaconTable };

/**
 * @template {string|number|Element} T
 * @param {T} x
 * @returns {T}
 */
function check(x) {
    if ((x===null) || (x===undefined) || Number.isNaN(x)) {
        throw new Error('undefined');
    }
    return x;
}

/**
 * @extends Event
 */
export class BeaconEvent extends Event {
    /**
     *  @param {[Beacon]} beacons
     */
    constructor(beacons = []) {
        super('beacon-list', {bubbles: true});
        this._active = beacons;
    }


}



class BeaconTable {
    constructor(tag='beacons') {
        this.tag = tag;
        this.base = DOM.withID(this.tag);
        this.rows = [];
        this.table = null;
    }

    /**
     *
     * @param {MouseEvent} e
     * @returns {Element}
     */
    static eventTargetParent(e) {
        let target = check(e.target);
        let tag = check(target.tagName).toUpperCase();
        switch(tag) {
            case 'TD':
                return check(target.parentElement);
            case 'TR':
                return target;
            default:
                throw new Error(`Unexpected event source ${tag}`);
        }
    }



    /**
     *
     * @param {MouseEvent} event
     */
    callback(event) {

        try {
            let row = BeaconTable.eventTargetParent(event);
            let index = check(parseInt(new DOM(row).getAttr('index')));
            let clicked = this.rows[index];
            console.log(`Clicked on row ${index} : ${clicked.toString()}`);
            this.table.toggleRow(index);
            let ind = this.table.activeIndices;
            let active = ind.map(idx => this.rows[idx]);
            this.table.dom.fire(new CustomEvent('beacon', {
                bubbles: true,
                detail: {
                    active: active
                }
            })
            );
        }
        catch(e) {
            console.error(`Bad click : ${e.toString()}`);
        }
    }

    /**
     *
     * @param {Beacons} data
     */
    render(data) {
        this.rows = data.beacons;
        let trs = this.rows.map(b => b.array);
        this.table = new DOMTable(['Name','MAC'],trs, 'bcn');
        let t = this.table.render().addEventListener('click',ev => this.callback(ev));
        this.base.empty().append(t);
    }
}