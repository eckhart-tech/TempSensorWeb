import { DOM } from "../gui/dom";

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
    return str.replaceAll(this.quote, this.quoteReplace);
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
          return value.valueOf().toString();
        } else if (value == null) {
          return "";
        } else {
          return value.toString();
        }
    }
  }

  row(values: any[]): string {
    let coded = values.map((v) => this.encode(v));
    return `${coded.join(this.field)}${this.eol}`;
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

  append(rows: any[]) {
    if (rows.length > 0) {
      let rs = rows.map((row) => this.parameters.row(row));
      this.rows.push(...rs);
    }
  }

  get data() {
    return new Blob(this.rows, {
      type: "text/csv",
      endings: "native",
    });
  }
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export class Downloader {
  blob: Blob;
  name: string;

  constructor(blob: Blob, name: string = "object") {
    this.blob = blob;
    this.name = name;
  }

  async download() {
    let url = URL.createObjectURL(this.blob);
    let anchor = new DOM("a").setAttrs({
      href: url,
      download: this.name,
    });

    //document.body.appendChild(anchor.dom);
    anchor.click();
    await delay(500);
    //document.body.removeChild(anchor.dom);
    URL.revokeObjectURL(url);
  }
}
