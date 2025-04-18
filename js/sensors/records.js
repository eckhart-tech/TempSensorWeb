export { Beacon, Record, RecordFormatter };

class Valid {


    static asString(x) {
        if (x === null || x === undefined) {
            throw new Error('Not a String');
        }
        return x.toString();
    }


    static asNumber(x) {
        let y = parseFloat(x);
        if (Number.isNaN(y)) {
            throw new Error('Not a number');
        }
        return y;
    }

    static asPercentage(x) {
        let y = Valid.asNumber(x);
        if (y < 0.0 || y > 100.0) {
            throw new Error('Not a percentage');
        }
        return y;
    }

    static asDate(x) {
        let y = Valid.asNumber(x);
        let d = new Date(y*1000.0);
        if (Number.isNaN(d.valueOf())) {
            throw new Error('Not a date');
        }
        return d;
    }


}

class RecordFormatter {

    static fields() { return ['mac','sensor','time','temperature','humidity','battery']; }

    constructor(beacons, locale = 'en-GB') {
        this.beacons = beacons;
        this.formatter = new Intl.DateTimeFormat(locale);
    }

    format(field,value) {
        switch(field) {
            case 'time':
                return this.formatter.format(value);
            case 'mac':
            case 'sensor':
            case 'temperature':
            case 'humidity':
            case 'battery':
                return value.toString();
            default:
                return '';
        }
    }

    strings(record) {
        return RecordFormatter.fields().map((field) => this.format(field,record[field]));
    }

    csv(record) {
        return this.strings(record).join(', ');
    }

    row(record) {
        let cells = this.strings(record).map((item) => `<td>${item}</td>`);
        let r = cells.join('');
        return `<tr>${r}</tr>`;
    }




}




class Record {

   constructor(
        raw = {}
    ) {
        this.valid = true;
        try {
            this.mac = Valid.asString(raw.mac);
            this.sensor = Valid.asString(raw.sensor);
            this.timestamp = Valid.asDate(raw.timestamp);
            this.time = undefined;
            this.temperature = Valid.asNumber(raw.temperature);
            this.humidity = Valid.asPercentage(raw.humidity);
            this.battery = Valid.asPercentage(raw.battery);
        }
        catch(e) {
            console.error(`Error : ${e.toString()}`);
            this.valid = false;
        }
    }



    ordinal() {
        return this.timestamp.valueOf();
    }





}

class Beacon {
    /**
     *
     * @param {string} name
     * @param {string} mac
     */
    constructor(name, mac) {
        this._name=name;
        this._mac=mac;
    }

    get name() { return this._name; }
    get mac() { return this._mac; }

    toString() {
        return `${this._name} [${this._mac}]'`;
    }

    get array() { return [this._name, this._mac]; }
}
