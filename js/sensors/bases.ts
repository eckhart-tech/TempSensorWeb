export abstract class BaseRecord {

    abstract toString() : string;
    abstract get array() : string[];
}

export abstract class BaseRecordSet {
    abstract get items() : BaseRecord[];
}