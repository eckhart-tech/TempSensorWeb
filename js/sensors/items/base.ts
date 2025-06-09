export type Recordable = number|string|boolean|Date|null;

export abstract class BaseRecord {

  abstract toString() : string;
  abstract get array() : string[];
  abstract get name() : string;

  abstract get raw() : Recordable[];
}