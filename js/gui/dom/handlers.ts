import { DOM } from "./dom";

export type EventKind = keyof HTMLElementEventMap;

export class GeneralEventTarget {
  private readonly kind: EventKind;
  private handlers: Map<symbol,EventListenerOrEventListenerObject>;
  private target: DOM;
  private counter: number;

  constructor(eventKind: EventKind) {
    this.kind = eventKind;
    this.handlers = new Map<symbol,EventListenerOrEventListenerObject>();
    this.target = new DOM('div');
    this.counter = 0;
  }

  add(handler: EventListenerOrEventListenerObject) {
    this.target.addEventListener(this.kind,handler);
    let s=Symbol.for(`${this.kind}:${this.counter}:${Date.now()}`);
    this.handlers.set(s,handler);
    this.counter+=1;
    return s;
  }

  remove(uid: symbol) {
    let handler=this.handlers.get(uid);
    if(handler!==undefined) {
      this.target.removeEventListener(this.kind,handler);
      this.handlers.delete(uid)
    }
  }

  clear() {
    this.handlers.forEach((handler,uid) => this.remove(uid));
  }

  fire(event: Event) {
    this.target.fire(event);
  }

}
