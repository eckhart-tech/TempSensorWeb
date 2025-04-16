import {RecordFormatter} from "../sensors/records";

export {ApplicationGUI};

import { Beacons, Records } from "../sensors/loader";
import { BeaconTable } from './beaconList';

class ApplicationGUI {

    constructor() {

        this.records = new Records();
        this.beacons = new Beacons();
    }




    async load() {
        await this.beacons.load();
        await this.records.load();

        let b = new BeaconTable();
        b.render(this.beacons);

        let formatter = new RecordFormatter();
        this.records.raw.forEach((row) => console.log(formatter.csv(row)));

    }

}
