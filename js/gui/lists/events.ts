import {Beacon} from "../../sensors";

/**
 * @extends Event
 */
export class BeaconEvent extends Event {
    /**
     *  @param {Beacon[]} beacons
     */
    readonly active : Beacon[];

    constructor(beacons : Beacon[] = []) {
        super('beacon-list', {bubbles: true});
        this.active = beacons;
    }
}



export class PaginatorEvent extends Event {

    readonly first: number;
    readonly last : number;

    constructor(first : number, last: number) {
        super('paginator', {bubbles: true});
        this.first = first;
        this.last = last;
    }

    get length() : number {
        return this.last-this.first;
    }

    get range() {
        return Array.from({length: this.length}, (_,i) => this.first + i);
    }
}

declare global {
    interface GlobalEventHandlersEventMap {
        'beacon-list': BeaconEvent;
        'paginator' : PaginatorEvent;
    }
}