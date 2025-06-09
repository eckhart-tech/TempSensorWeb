import { DOM } from "../gui/dom";



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
