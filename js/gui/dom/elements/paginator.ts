import {DOMElement} from "./base";
import {DOMButton} from "./button";
import { PaginatorEvent } from "../../lists/events";


class Paginator extends DOMElement {
  total : number;
  pageSize : number;
  nPages : number;
  page: number;
  readonly event = 'paginator';


  constructor(resettable : boolean = true) {
    super('nav',{});
    this.total = 1;
    this.pageSize = 1;
    this.page = 0;
    this.nPages = 1;

    this.dom.append(new DOMButton('up').addListener(this.up));
    if(resettable) {
      this.dom.append(new DOMButton('reset').addListener(this.reset));
    }
    this.dom.append(new DOMButton('down').addListener(this.down));
  }

  load(total : number, pageSize : 100, zero: boolean = true) {
    this.total = total;
    this.pageSize = pageSize;
    this.nPages = Math.ceil(this.total / this.pageSize);
    this.page = (zero) ? 0 : Math.min(this.page,this.nPages-1);
    this.fire();
  }

  get first() { return this.page*this.pageSize; }
  get last() { return Math.min(this.first+this.pageSize, this.total); }

  up(_ : Event) {
    this.page = Math.min(this.page+1,this.nPages-1);
    this.fire();
  }
  down(_ : Event) {
    this.page = Math.max(this.page-1,0);
  }

  reset(_ : Event) {
    this.page=0;
    this.fire();
  }

  fire() {
    let first = this.page*this.pageSize;
    let last = Math.min(this.first+this.pageSize, this.total);
    this.dom.fire(new PaginatorEvent(this.first,this.last));
  }



}
