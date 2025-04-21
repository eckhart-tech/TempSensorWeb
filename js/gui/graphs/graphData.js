
import {Records} from '../../sensors/loader';
export {GraphDataSet};
class Bounds {
    constructor(items) {
        this.min = Math.min(...items);
        this.max = Math.max(...items);
    }

    static join(...bounds) {
        let min = Math.min(...bounds.map(b => b.min));
        let max = Math.max(...bounds.map(b => b.max));
        return new Bounds([min, max]);
    }
}

class BeaconData {
    /**
     *
     * @param {string} beacon
     * @param {Records} records
     */
    constructor(beacon,records) {
        this.beacon=beacon;
        this.records=records.filter(beacon);
        this.bounds = new Bounds(this.records.map(r => r.timestamp));
    }

    format(parameter) {
        let values = this.records.map(record => {
            return {x: record.timestamp, y: record[parameter]};
        });
        return {
            label: this.beacon,
            data: values
        };
    }
    
    
}

class GraphDataSet {

    /**
     *
     * @param {Records} records
     * @param {[string]|null} beacons
     */
    constructor(records, beacons=null) {
        this.beacons = (beacons===null) ? records.keys : beacons;
        this.records = this.beacons.map(beacon => new BeaconData(beacon,records));
        this.bounds = Bounds.join(...this.records.map(recs => recs.bounds));
    }

    dataSet(parameter) {
        return this.records.map(records => records.format(parameter));
    }

    static unit(parameter) {
        switch(parameter) {
            case 'temperature':
                return 'C';
            case 'battery':
            case 'humidity':
                return '%';
            default:
                return '';
        }
    }
}