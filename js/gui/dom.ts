



export class DOM {
  /**
   *
   * @param {String} id
   * @returns {DOM}
   */
  static withID(id: string): DOM {
    return new DOM(document.getElementById(id));
  }

  static fromSelector(css: string): DOM {
    let node = document.querySelector(css);
    if (node === null) {
      throw new Error(`No element matches ${css}`);
    } else {
      return new DOM(node);
    }
  }

  /**
   * @desc class constructor
   * @param {string|Element} tag
   * @param {object} props
   */
  element: Element;

  constructor(tag: string | Element, props = {}) {
    if (typeof tag === "string") {
      this.element = document.createElement(tag);
    } else {
      this.element = tag;
    }
    this.setProps(props);
  }

  get dom() {
    return this.element;
  }

  /**
   * @desc Attach as child
   * @param {Node} root - the parent
   */
  map(root: Node = document): DOM {
    root.appendChild(this.element);
    return this;
  }
  /**
   *
   * @param {DOM} child
   * @returns {DOM}
   */
  append(child: DOM): DOM {
    this.element.appendChild(child.dom);
    return this;
  }

  /**
   *
   * @param {[DOM]} children
   * @returns {DOM}
   */
  appendAll(children: DOM[]): DOM {
    children.forEach((child) => this.append(child));
    return this;
  }

  /**
   * @desc Remove all child elements
   * @returns {DOM}
   */
  empty(): DOM {
    while (this.element.firstChild) {
      this.element.removeChild(this.element.firstChild);
    }
    return this;
  }

  unmap(): DOM {
    this.element.parentElement?.removeChild(this.element);
    return this;
  }

  get children(): DOM[] {
    let c = Array.from(this.element.children);
    return c.map((ch) => new DOM(ch));
  }

  childrenWithTag(tag: string): DOM[] {
    let c = Array.from(this.element.getElementsByTagName(tag));
    return c.map((ch) => new DOM(ch));
  }

  childrenWithSelector(css: string): DOM[] {
    let els = Array.from(this.dom.querySelectorAll(css));
    return els.map((el) => new DOM(el));
  }

  /**
   *
   * @param {string} value
   * @returns {DOM}
   */
  text(value: string): DOM {
    this.element.appendChild(document.createTextNode(value));
    return this;
  }

  getText(): string {
    return this.element.innerHTML;
  }

  /**
   *
   * @param {string} name
   * @param {any}value
   * @returns {DOM}
   */
  setAttr(name: string, value: any): DOM {
    this.element.setAttribute(name, value);
    return this;
  }

  /**
   *
   * @param {string} name
   * @returns {string}
   */
  getAttr(name: string): string {
    return this.element.getAttribute(name);
  }

  /**
   *
   * @param {string} name
   * @returns {DOM}
   */
  delAttr(name: string): DOM {
    this.element.removeAttribute(name);
    return this;
  }

  /**
   *
   * @param {Object<string,any>} kv - ket-value pairs for properties to set
   * @returns {DOM} - this
   */
  setAttrs(kv: { [s: string]: any }): DOM {
    Object.keys(kv).forEach((key) => this.element.setAttribute(key, kv[key]));
    return this;
  }

  /**
   *
   * @param {string} name
   * @param {any} value
   * @returns {DOM}
   */
  setProp(name: string, value: any): DOM {
    // @ts-ignore
    this.element[name] = value;
    return this;
  }

  /**
   *
   * @param {Object<string,any>} kv
   * @return {DOM}
   */
  setProps(kv: { [s: string]: any }): DOM {
    // @ts-ignore
    Object.keys(kv).forEach((key) => (this.element[key] = kv[key]));
    return this;
  }

  /**
   *
   * @param {string} name - parameter name
   * @returns {*}
   */
  getProp(name: string): any {
    // @ts-ignore
    return this.element[name];
  }

  /**
   *
   * @param {Array<string>} classes
   * @returns {DOM}
   */
  addClasses(classes: string[] = []): DOM {
    this.element.classList.add(...classes);
    return this;
  }

  /**
   *
   * @param {string} klass
   * @returns {DOM}
   */
  addClass(klass: string): DOM {
    return this.addClasses([klass]);
  }

  /**
   *
   * @param {string} klass
   * @returns {boolean}
   */
  hasClass(klass: string = ""): boolean {
    return this.element.classList.contains(klass);
  }

  /**
   *
   * @param {Array<string>}classes
   * @returns {DOM}
   */
  removeClasses(classes: Array<string> = []): DOM {
    this.element.classList.remove(...classes);
    return this;
  }

  /**
   *
   * @param {string} klass
   * @returns {DOM}
   */
  removeClass(klass: string): DOM {
    return this.removeClasses([klass]);
  }

  /**
   *
   * @param {string} klass
   * @returns {boolean}
   */
  toggleClass(klass: string): boolean {
    let v = this.hasClass(klass);
    if (v) {
      this.removeClass(klass);
    } else {
      this.addClass(klass);
    }
    return !v;
  }

  /**
  
   *
   * @param {string} event
   * @param {EventListenerOrEventListenerObject} listener
   * @param {(boolean|AddEventListenerOptions)} [options]
   * @returns {DOM}
   */
  addEventListener(
    event: string,
    listener: EventListenerOrEventListenerObject,
    options: boolean | AddEventListenerOptions = null,
  ): DOM {
    this.element.addEventListener(event, listener, options);
    return this;
  }

  /**
   * @desc Getter for data value (depending on control type)
   * @returns {*}
   */
  get value(): boolean|string {

      let e = this.element as HTMLInputElement;
      return e.type === "checkbox" ? e.checked : e.value;
  }

  /**
   * @desc Setter for data value (depending on control type)
   * @param v
   */
  set value(v: boolean) {
      let e = this.element as HTMLInputElement;
      if (e.type === "checkbox") {
        e.checked = v;
      } else {
        e.value = v.toString();
      }
  }

  /**
   *
   * @param {string} [error=] - validity error message to set ('' -> no error)
   */
  validity(error: string = "") {
      let e = this.element as HTMLInputElement;
      e.setCustomValidity(error);
  }

  //set [name](value) { this.element[name]=value; }
  //get [name]() { return this.element[name]; }

  click() {
      (this.element as HTMLElement).click();
  }

  /**
   *
   * @param {Event} event
   */
  fire(event: Event) {
    this.element.dispatchEvent(event);
  }
}

export class DOMHelper {
  /**
   *
   * @param {string} message
   * @param {string} name
   * @returns {DOM}
   * @constructor
   */
  static Button(message: string, name: string = ""): DOM {
    return new DOM("button").text(message).setAttrs({
      type: "button",
      name: name,
    });
  }

  /**
   *
   * @param {string[]} strings
   * @param {boolean} multiple
   * @constructor
   */
  static Select(strings: string[], multiple: boolean = false) {
    let dom = new DOM("select", {
      multiple: multiple,
    });
    strings.forEach((s) => {
      let o = new DOM("option", {
        text: s,
      });
      dom.append(o);
    });
    return dom;
  }
}


export class DOMTable {
  /**
   *
   * @param {[string]} headers
   * @param {[[string]]} rows
   * @param klass
   */

  headers : string[];
  rows : string[][];
  table : DOM;
  dataRows : DOM[];

  constructor(
    headers: string[] = [],
    rows: string[][] = [],
    klass: string = null,
  ) {
    this.headers = headers.map((h) => h.toString());
    this.rows = rows;
    this.table = new DOM("table");
    this.dataRows = [];
    if (klass !== null) {
      this.table.addClass(klass);
    }
  }

  reload(rows: string[][] = []) {
    this.rows = rows;
    this.render();
  }

  /**
   *
   * @param {string} tag
   * @param {[string]} values
   * @returns {DOM}
   */
  makeRow(tag: string, values: string[]): DOM {
    return new DOM("tr").appendAll(values.map((v) => new DOM(tag).text(v)));
  }

  render(): DOM {
    let h = this.makeRow("th", this.headers);
    this.dataRows = this.rows.map((row, idx) => {
      return this.makeRow("td", row).setAttrs({
        index: idx,
      });
    });
    this.table.empty().append(h).appendAll(this.dataRows);
    return this.table;
  }

  /**
   *
   * @param {number} idx
   * @returns {boolean}
   */
  toggleRow(idx: number): boolean {
    let row = this.dataRows[idx];
    return row.toggleClass("active");
  }

  get activeRows(): DOM[] {
    return this.dataRows.filter((row) => row.hasClass("active"));
  }

  get activeIndices(): number[] {
    return this.activeRows.map((row) => parseInt(row.getAttr("index")));
  }

  resetRows() {
    this.dataRows.forEach((r) => r.removeClass("active"));
  }
  setRows() {
    this.dataRows.forEach((r) => r.addClass("active"));
  }

  get dom(): DOM {
    return this.table;
  }

}

