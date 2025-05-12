import {DOMElement} from "./base";

export class DOMButton extends DOMElement {
  readonly event: string = "click";

  constructor(message: string, name: string = "") {
    super("button");
    this.dom.text(message).setAttr("button", name);
    this.event = "click";
  }

  click() {
    this.dom.click();
  }

}


