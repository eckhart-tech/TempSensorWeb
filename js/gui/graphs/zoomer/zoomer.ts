import { getRelativePosition } from "chart.js/helpers";
import { EventData, PluginBase } from "./pluginbase";
import { ZoomerEvent, ZoomerEventState, ZoomerEventTarget } from "./config";

export class Zoomer extends PluginBase {
  constructor() {
    super("zoomer");
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
    if (state === ZoomerEventState.NULL) {
      console.log("CANCEL");
      ZoomerEventTarget.dispatchEvent(new ZoomerEvent(ZoomerEventState.NULL));
    }
    else {
      const canvasPosition = getRelativePosition(event, this.chart);

      // Substitute the appropriate scale IDs
      const dataX = this.chart.scales.x.getValueForPixel(canvasPosition.x);
      const dataY = this.chart.scales.y.getValueForPixel(canvasPosition.y);
      console.log(`${event.type} at ${dataX}, ${dataY}`);
      ZoomerEventTarget.dispatchEvent(new ZoomerEvent(state, "", dataX));
    }
  }

}

export const zoomer = new Zoomer();


