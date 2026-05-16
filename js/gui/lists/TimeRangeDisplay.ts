import { GUIBase } from "./base";
import { BaseRecordSet, TimeRange, TimeRanges } from "../../sensors";
import { DOMInput, DOMInputType } from "../dom/elements/inputs";
import { DOM, DOMButton } from "../dom";
import { IndexedBeacon } from "./events";



export class TimeRangeDisplay extends GUIBase {
  ranges : TimeRange[];

  constructor(id: string, klass: string = "time", title: string | null = null) {
    super(id, klass, title);
    this.ranges=[];
  }

  private makeGUIForRange(range: TimeRange) : void {
    let jScript = range.jScript;

    let begin = new DOMInput(DOMInputType.DATE,'begin','start date').isImmutable(true).setDefault(jScript.start);
    let end = new DOMInput(DOMInputType.DATE,'end','end date').isImmutable(true).setDefault(jScript.end);
    this.base.appendAll([
      new DOM('h1').text('Date range'),
      new DOM('nav').appendAll([
        begin.dom,
        end.dom
      ])
    ]);
  }



  render(...data : BaseRecordSet[]) {
    this.base.empty();
    this.ranges = [].concat(...data.filter(set => set instanceof TimeRanges).map(set => set.items));
    if(this.ranges.length>0) {
      this.makeGUIForRange(this.ranges[0]);
    }
  }

}

export interface TimeDisplayRange {
  name: string,
  value: number|null
}

export class DateRangeEvent extends Event {
  readonly nDays: number | null;

  constructor(days: number = Number.NaN) {
    super("date-range", { bubbles: true });
    this.nDays = Number.isFinite(days) ? days : null;
  }
}

export class TimeRangeControl extends GUIBase {
  buttons: DOMButton[];
  delays : TimeDisplayRange[];

  constructor(
    id: string,
    klass: string = "time",
    title: string | null = null,
    delays: TimeDisplayRange[] = [{ name: "all", value: 365000 }, { name: "month", value: 30 }, { name: "week", value: 7 }]
  ) {
    super(id, klass, title);
    this.buttons = [];
    this.delays=delays;
  }

  callback(event: Event) {
      let target = event.target as Element;
      if (target != null) {
        let name=target.getAttribute("button") ?? "365000";
        this.buttons.forEach(b => {
          if(b.name===name) {
            b.dom.addClass('clicked');
          }
          else {
            b.dom.removeClass('clicked');
          }
        });

        let value = parseInt(name);
        this.base.fire(new DateRangeEvent(value));
      }
    }

  render(...data : BaseRecordSet[]) {
    this.base.empty();
    this.buttons = this.delays.map((d) => new DOMButton(d.name, d.value.toString()));

    this.buttons.forEach((b) => b.addListener(e => this.callback(e)));
    this.base.appendAll(this.buttons.map(d => d.dom));

  }

  fire(label: string = 'all') {
    this.buttons.find(b => b.message===label)?.click();
  }
}