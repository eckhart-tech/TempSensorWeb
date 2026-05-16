import {DOMElement} from "./base";

export class DOMButton extends DOMElement {
  readonly event: string = "click";
  readonly message: string;
  readonly name: string;

  constructor(message: string, name: string = "") {
    super("button");
    this.name=name;
    this.message=message;
    this.dom.text(message).setAttr("button", name);
    this.event = "click";
  }

  get nameAttribute() { return this.dom.getAttr("button"); }


  click() {
    this.dom.click();
  }

}


