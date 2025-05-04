import { DOM } from "../dom";
import { DOMElement} from "./base";

export class DOMSelect extends DOMElement {
  readonly event : string = "change";

  constructor(strings: string[], multiple: boolean = false) {
    super("select", {multiple: multiple});
    strings.forEach((s) => {
      let o = new DOM("option", {text: s});
      this.dom.append(o);
    });
  }
}

