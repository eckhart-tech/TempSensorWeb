import { EventData, PluginBase } from "./pluginbase";
import { ZoomerEventState } from "./zoomerevents";
import { ZoomerState } from "./zoomerevents";

export class Zoomer extends PluginBase {
  lastEvent : ZoomerState|null;
  constructor() {
    super("zoomer");
    this.lastEvent = null;
  }

  pointerHandler(info: EventData) {
    switch (info.action) {
      case "up":
        this.pointerAction(info.raw, ZoomerEventState.UP);
        break;
      case "down":
        this.pointerAction(info.raw, ZoomerEventState.DOWN);
        break;
      case "move":
        this.pointerAction(info.raw, ZoomerEventState.MOVING);
        break;
      case "cancel":
        this.pointerAction(info.raw, ZoomerEventState.NULL);
        break;
      case "click":
        break;
      default:
        break;
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
    console.log(`Event is ${event}, state is ${state}`);
    let eventState = new ZoomerState(this.chart,event,state);

    switch(state) {
      case ZoomerEventState.NULL:
        console.log("CANCEL");
        this.lastEvent=null;
        break;
      case ZoomerEventState.DOWN:
        if(this.lastEvent===null) {
          // TODO: draw start at eventState.position
          this.lastEvent = eventState;
          console.log(`DOWN ${event.type} at ${eventState.position.x}, ${eventState.position.y}`);
        }
        else {
          console.log('Anomalous pointer down');
        }
        break;
      case ZoomerEventState.UP:
        if(this.lastEvent===null) {
          console.log('Anomalous pointer down');
        }
        else {
          // TODO: process zoom from this.lastEvent.position to eventState.position
          this.lastEvent=null;
          console.log(`UP ${event.type} at ${eventState.position.x}, ${eventState.position.y}`);
        }
        break;
      default:
        break;
    }

  }

}

export const zoomer = new Zoomer();


