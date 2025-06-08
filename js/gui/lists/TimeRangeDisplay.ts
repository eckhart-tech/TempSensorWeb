import { GUIBase } from "./base";
import { BaseRecordSet, TimeRange, TimeRanges } from "../../sensors";
import { DOMInput, DOMInputType } from "../dom/elements/inputs";
import { DOM } from "../dom";

export class TimeRangeDisplay extends GUIBase {
  ranges : TimeRange[];

  constructor(id: string, klass: string = "time", title: string | null = null) {
    super(id, klass, title);
    this.ranges=[];
  }

  private makeGUIForRange(range: TimeRange) : void {
    let jScript = range.jScript;
    let title = new DOM('h1').text('Date range');
    let begin = new DOMInput(DOMInputType.DATE,'begin','start date').isImmutable(true).setDefault(jScript.start);
    let end = new DOMInput(DOMInputType.DATE,'end','end date').isImmutable(true).setDefault(jScript.end);
    this.base.appendAll([title, begin.dom,end.dom]);
  }

  render(...data : BaseRecordSet[]) {
    this.base.empty();
    this.ranges = [].concat(...data.filter(set => set instanceof TimeRanges).map(set => set.items));
    if(this.ranges.length>0) {
      this.makeGUIForRange(this.ranges[0]);
    }
  }

}