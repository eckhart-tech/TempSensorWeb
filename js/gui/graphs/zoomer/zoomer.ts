import { PluginBase } from "./base/pluginbase";
import { Debouncer, EventAction, EventClassification, PluginEvent } from "./base/pluginbaseevents";
import { Point } from "chart.js";
import { GeneralEventTarget } from "../../dom";


export class ZoomerEvent extends PluginEvent {
  p1: Point|null;
  p2: Point|null;

  constructor(action: EventAction,p1: Point|null, p2: Point|null) {
    super(action,'zoomer');
    this.p1=p1;
    this.p2=p2;

  }

  toString() : string {
    return `ACTION ${this.action} P1 ${this.p1} P2 ${this.p2}`;
  }
}



export class Zoomer extends PluginBase {
  startEvent: EventClassification | null;
  lastEvent: EventClassification | null;
  debouncer: Debouncer = new Debouncer();
  element : HTMLElement|null;
  constructor() {
    super("zoomer");
    this.lastEvent = null;
  }



  myInit() {
    super.myInit();
    this.nullEvents();
    this.element=this.canvas.parentElement;
  }

  pointerHandler(info: EventClassification) {
    if (info.action != null) {
      this.pointerAction(info);
    } else {
      console.log(`Bad event ${info.action} : nulling`);
      this.nullEvents();
    }
  }

  keypressHandler(info: EventClassification) {
    switch (info.action) {
      case EventAction.Down:
        break;
      case EventAction.Up:
        break;
      default:
        break;
    }
  }

  private nullEvents() {
    this.startEvent=null;
    this.lastEvent=null;
  }

  private fireEvent(action: EventAction,e1: EventClassification|null=null,e2: EventClassification|null = null) {
    let e = new ZoomerEvent(action, e1?.position, e2?.position);
    this.element?.dispatchEvent(e);
  }

  private pointerAction(event: EventClassification) {
    if((this.lastEvent!=null) && this.debouncer.duplicate(event,this.lastEvent)) {
      console.log(`DUPLICATE ${event.eventType} at ${event.position.x}, ${event.position.y} `);
      return;
    }
    switch (event.action) {
      case EventAction.Null:
        console.log("CANCEL");
        this.fireEvent(EventAction.Null);
        // TODO: redraw without extras: lastEvent and startEvent
        this.nullEvents();
        break;
      case EventAction.Down:
        if (this.startEvent === null) {
          // TODO: draw start at eventState.position: startEvent
          this.startEvent = event;
          this.lastEvent = event;
          this.fireEvent(EventAction.Down,this.startEvent);
          console.log(
            `DOWN ${event.eventType} at ${event.position.x}, ${event.position.y} @ ${event.timestamp}`,
          );
        }
        break;
      case EventAction.Up:
        if (this.startEvent === null) {
          //console.log("Anomalous pointer UP");
        } else {
          this.fireEvent(EventAction.Up,this.startEvent,event)

          console.log(
            `UP ${event.eventType} at ${event.position.x}, ${event.position.y}`,
          );
          this.nullEvents();
        }
        break;
      case EventAction.Move:
        if (this.lastEvent !== null) {
          console.log(
            `MOVE ${event.eventType} at ${event.position.x}, ${event.position.y}`,
          );
          // TODO" move : lastEvent and event
          this.fireEvent(EventAction.Move,event,this.lastEvent);
          this.lastEvent=event;


        }
        break;
      default:
        //console.log(`Unexpected ${event.type} : ${eventState}`);
        break;
    }
  }

  globalEvent(event: ZoomerEvent) {
    console.log(`>>> GLOBAL ZOOMER EVENT: {event}`)
  }
}

export const zoomer = new Zoomer();


