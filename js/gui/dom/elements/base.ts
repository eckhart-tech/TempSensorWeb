import { DOM } from "../dom";

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

  add(tag: string) {
    DOM.withID(tag).append(this.dom);
  }
}