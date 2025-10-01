import { EventData, PluginBase } from "./pluginbase";
import { ZoomerEventState, ZoomerState } from "./zoomerevents";



export class Zoomer extends PluginBase {
  lastEvent: ZoomerState | null;
  constructor() {
    super("zoomer");
    this.lastEvent = null;
  }

  myInit() {
    super.myInit();
    this.lastEvent = null;
  }

  pointerHandler(info: EventData) {
    let state : ZoomerEventState|null =
      (info.action==="up") ? ZoomerEventState.UP :
        (info.action==="down") ? ZoomerEventState.DOWN :
          (info.action==="move") ? ZoomerEventState.MOVE :
            (info.action==="cancel") ? ZoomerEventState.NULL :
              (info.action==="click") ? ZoomerEventState.NOTHING :
                null;
    if(state!=null) {
      this.pointerAction(info.raw,state);
    }
    else {
      console.log(`Bad event ${info.action} : nulling`);
      this.lastEvent=null;
    }
  }

  keypressHandler(info: EventData) {
    switch (info.action) {
      case "up":
        break;
      case "down":
        break;
      default:
        break;
    }
  }

  private pointerAction(event: Event, state: ZoomerEventState) {
    let eventState = new ZoomerState(this.chart, event, state);
    //console.log(`Event is ${event.type}, zoomerstate is ${eventState}`);

    switch (state) {
      case ZoomerEventState.NULL:
        console.log("CANCEL");
        this.lastEvent = null;
        break;
      case ZoomerEventState.DOWN:
        if (this.lastEvent === null) {
          // TODO: draw start at eventState.position
          this.lastEvent = eventState;
          console.log(
            `DOWN ${event.type} at ${eventState.position.x}, ${eventState.position.y} @ ${eventState.timestamp}`,
          );
        } else {
          if(eventState.duplicates(this.lastEvent)) {
            console.log(
              `Anomalous DOWN ${event.type} at ${eventState.position.x}, ${eventState.position.y} `,
            );
          }
        }
        break;
      case ZoomerEventState.UP:
        if (this.lastEvent === null) {
          //console.log("Anomalous pointer UP");
        } else {
          // TODO: process zoom from this.lastEvent.position to eventState.position
          this.lastEvent = null;
          console.log(
            `UP ${event.type} at ${eventState.position.x}, ${eventState.position.y}`,
          );
        }
        break;
      case ZoomerEventState.MOVE:
        if(this.lastEvent!==null) {
          console.log(
            `MOVE ${event.type} at ${eventState.position.x}, ${eventState.position.y}`,
          );
        }
      default:
        //console.log(`Unexpected ${event.type} : ${eventState}`);
        break;
    }
  }
}

export const zoomer = new Zoomer();


