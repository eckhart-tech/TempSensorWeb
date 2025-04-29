import {Beacon} from "../../sensors";

/**
 * @extends Event
 */

export interface BeaconEventData {
  active: string[];
  isAll : boolean;
}

export class BeaconEvent extends Event {
    readonly activeBeacons: Set<string>;

    constructor(active: Beacon[] = []) {
        super('beacon-list', {bubbles: true});
        this.activeBeacons = new Set(active.map(b => b.name));
    }

    get displayAll() : boolean {
      return this.activeBeacons.size===0;
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