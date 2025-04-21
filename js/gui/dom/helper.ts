import {DOM} from "./dom";



export abstract class DOMElement {
    readonly dom: DOM;
    readonly event : string;

    protected constructor(tag: string, args = {}) {
        this.dom = new DOM(tag, args);
    }

    addListener(listener: EventListenerOrEventListenerObject,
                options: AddEventListenerOptions = null) {
        this.dom.addEventListener(this.event, listener, options);
        return this.dom;
    }
}



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

