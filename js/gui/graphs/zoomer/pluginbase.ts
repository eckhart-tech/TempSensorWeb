import { Chart } from "chart.js/auto";

export type EventName = keyof HTMLElementEventMap;
export type HandlerFunction = (chart: Chart, event: Event) => void;
export interface HandlerInfo {

  event: EventName,
  handler: HandlerFunction
}
export type Handlers = Array<HandlerInfo>;


export class PluginEventHandlers {
  handlers: Map<EventName,EventListenerOrEventListenerObject>

  constructor() {
    this.handlers = new Map<EventName,EventListenerOrEventListenerObject>();
  }

  load(chart: Chart,handlers: Handlers) {
    handlers.forEach(handler => this.add(chart,handler.event, handler.handler));
  }
  unload(chart: Chart,handlers: Handlers) {
    handlers.forEach(handler => this.remove(chart,handler.event));
  }



  private add(chart: Chart,event: EventName, handler: HandlerFunction) {
    this.remove(chart,event);

    let listener: EventListenerOrEventListenerObject = (event : Event) => {
      return handler(chart, event);
    }
    chart.ctx.canvas.addEventListener(event, listener);
    this.handlers.set(event,listener);
  }

  private remove(chart: Chart,event: EventName) {
    if(this.has(event)) {
      let listener = this.handlers.get(event);
      chart.ctx.canvas.removeEventListener(event,listener);
      this.handlers.delete(event);
    }
  }

  private has(event: EventName) : boolean { return this.handlers.has(event); }
}


