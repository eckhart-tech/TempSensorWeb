import { DOM } from "../gui/dom";

class CSVData {
  readonly headers: string[];
  rows: string;

  private encode(value: any): string {
    switch (typeof value) {
      case "boolean":
        return value ? "true" : "false";
      case "number":
        return value.toString();
      case "string":
        let escaped = value.replaceAll('"', '"');
        return `"${escaped}"`;
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

  private encodeRow(values: any[]): string {
    let e = values.map((v) => this.encode(v));
    return e.join(",");
  }

  constructor(headers: string[]) {
    this.headers = headers;
    this.rows = "";
  }

  append(rows: any[]) {
    if (rows.length > 0) {
      let r = rows.map((r) => this.encodeRow(r));
      let s = r.join("\n");
      this.rows = `${this.rows}\n${s}`;
    }
  }

  get data() {
    let h = this.encodeRow(this.headers);
    let s = `${h}\n${this.rows}\n`;
    return new Blob([s], {
      type: "text/csv",
      endings: "native",
    });
  }
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

class Downloader {
  blob: Blob;
  name: string;

  constructor(blob: Blob, name: string = "object") {
    this.blob = blob;
    this.name = name;
  }

  async download() {
    let url = URL.createObjectURL(this.blob);
    let anchor = new DOM("a")
      .setAttrs({
        href: url,
        download: this.name
      });

    //document.body.appendChild(anchor.dom);
    anchor.click();
    await delay(500);
    //document.body.removeChild(anchor.dom);
    URL.revokeObjectURL(url);
  }
}
