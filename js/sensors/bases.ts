export abstract class BaseRecord {

    abstract toString() : string;
    abstract get array() : string[];
}

export abstract class BaseRecordSet {
    abstract get items() : BaseRecord[];
    get length(): number { return this.items.length; }
    abstract get keys() : string[];
    abstract filter(key: string) : BaseRecord[];
}