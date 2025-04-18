import {RecordFormatter} from "../sensors/records";

export {ApplicationGUI};

import { Beacons, Records } from "../sensors/loader";
import { BeaconTable } from './beaconList';

class ApplicationGUI {

    constructor() {

        this.records = new Records();
        this.beacons = new Beacons();
    }

    /**
     *
     * @param {Event} event
     */
    callback(event) {
        console.log(event);
    }




    async load() {
        await this.beacons.load();
        await this.records.load();

        let b = new BeaconTable();
        b.render(this.beacons);

        document.addEventListener('beacon', this.callback);

        // let formatter = new RecordFormatter();
        // this.records.raw.forEach((row) => console.log(formatter.csv(row)));

    }

}
