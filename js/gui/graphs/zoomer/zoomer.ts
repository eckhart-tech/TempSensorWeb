import { PluginBase } from "./base/pluginbase";
import { Debouncer, EventAction, EventClassification } from "./base/pluginbaseevents";

export class Zoomer extends PluginBase {
  lastEvent: EventClassification | null;
  debouncer: Debouncer = new Debouncer();
  constructor() {
    super("zoomer");
    this.lastEvent = null;
  }

  myInit() {
    super.myInit();
    this.lastEvent = null;
  }

  pointerHandler(info: EventClassification) {
    if (info.action != null) {
      this.pointerAction(info);
    } else {
      console.log(`Bad event ${info.action} : nulling`);
      this.lastEvent = null;
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



  private pointerAction(event: EventClassification) {
    if((this.lastEvent!=null) && this.debouncer.duplicate(event,this.lastEvent)) {
      console.log(`DUPLICATE ${event.eventType} at ${event.position.x}, ${event.position.y} `);
      return;
    }
    switch (event.action) {
      case EventAction.Null:
        console.log("CANCEL");
        this.lastEvent = null;
        break;
      case EventAction.Down:
        if (this.lastEvent === null) {
          // TODO: draw start at eventState.position
          this.lastEvent = event;
          console.log(
            `DOWN ${event.eventType} at ${event.position.x}, ${event.position.y} @ ${event.timestamp}`,
          );
        }
        break;
      case EventAction.Up:
        if (this.lastEvent === null) {
          //console.log("Anomalous pointer UP");
        } else {
          // TODO: process zoom from this.lastEvent.position to eventState.position
          this.lastEvent = null;
          console.log(
            `UP ${event.eventType} at ${event.position.x}, ${event.position.y}`,
          );
        }
        break;
      case EventAction.Move:
        if (this.lastEvent !== null) {
          console.log(
            `MOVE ${event.eventType} at ${event.position.x}, ${event.position.y}`,
          );
        }
        break;
      default:
        //console.log(`Unexpected ${event.type} : ${eventState}`);
        break;
    }
  }
}

export const zoomer = new Zoomer();


