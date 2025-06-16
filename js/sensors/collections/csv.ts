import { Format } from "../../lib";
import { BaseRecord, Recordable } from "../items";

class CSVParameters {
  field: string;
  eol: string;
  quote: string;
  quoteReplace: string;

  constructor(field: string = ",", eol: string = "\n", quote: string = '"') {
    this.field = field;
    this.eol = eol;
    this.quote = quote;
    this.quoteReplace = `\\${quote}`;
  }

  escape(str: string): string {
    let e = str.replaceAll(this.quote, this.quoteReplace);
    return `${this.quote}${e}${this.quote}`;
  }

  encode(value: any): string {
    switch (typeof value) {
      case "boolean":
        return value ? "true" : "false";
      case "number":
        return value.toString();
      case "string":
        return this.escape(value);
      default:
        if (value instanceof Date) {
          return Format.date(value).replaceAll(',',' ');
        } else if (value == null) {
          return "";
        } else {
          return value.toString();
        }
    }
  }

  row(record: Recordable[]): string {
    let coded = record.map((v) => this.encode(v));
    return `${coded.join(this.field)}${this.eol}`;
  }

  record(record: BaseRecord): string {
    return this.row(record.raw);
  }
}

export class CSVData {
  parameters: CSVParameters;
  rows: string[];

  constructor(
    headers: string[],
    parameters: CSVParameters = new CSVParameters(),
  ) {
    this.parameters = parameters;
    this.rows = [this.parameters.row(headers)];
  }

  append(rows: BaseRecord[]) {
    if (rows.length > 0) {
      let rs = rows.map((row) => this.parameters.record(row));
      this.rows.push(...rs);
    }
  }

  get raw() {
    return new Blob(this.rows, {
      type: "text/csv",
      endings: "native",
    });
  }
}
