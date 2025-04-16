export {DOM, DOMHelper, DOMTable};



class DOM {

    /**
     *
     * @param {String} id
     * @returns {DOM}
     */
    static withID(id) {
        return new DOM(document.getElementById(id));
    }

    static fromSelector(css) {
        let node = document.querySelector(css);
        if(node===null) {
            throw new Error(`No element matches ${css}`);
        }
        else {
            return new DOM(node);
        }

    }

    /**
     * @desc class constructor
     * @param {string|HTMLElement} tag
     * @param {object} props
     */
    constructor(tag, props = {}) {
        if(typeof(tag)==='string') {
            this.element = document.createElement(tag);
        }
        else {
            this.element=tag;
        }
        this.setProps(props);
    }

    get dom() { return this.element; }

    /**
     * @desc Attach as child
     * @param {Node} root - the parent
     */
    map(root = document) {
        root.appendChild(this.element);
    }
    /**
     *
     * @param {DOM} child
     * @returns {DOM}
     */
    append(child) {
        this.element.appendChild(child.dom);
        return this;
    }

    /**
     *
     * @param {[DOM]} children
     * @returns {DOM}
     */
    appendAll(children) {
        children.forEach(child => this.append(child));
        return this;
    }

    /**
     * @desc Remove all child elements
     * @returns {DOM}
     */
    empty() {
        while(this.element.firstChild) {
            this.element.removeChild(this.element.firstChild);
        }
        return this;
    }

    unmap() {
        this.element.parentElement?.removeChild(this.element);
        return this;
    }

    get children() {
        let c = Array.from(this.element.children);
        return c.map(ch => new DOM(ch));
    }

    childrenWithTag(tag) {
        let c = Array.from(this.element.getElementsByTagName(tag));
        return c.map(ch => new DOM(ch));
    }

    childrenWithSelector(css) {
        let els = Array.from(this.dom.querySelectorAll(css));
        return els.map(el => new DOM(el));
    }

    /**
     *
     * @param {string} value
     * @returns {DOM}
     */
    text(value) {
        this.element.appendChild(document.createTextNode(value));
        return this;
    }

    getText() {
        return this.element.innerHTML;
    }

    /**
     *
     * @param {string} name
     * @param {any}value
     * @returns {DOM}
     */
    setAttr(name,value) {
        this.element.setAttribute(name,value);
        return this;
    }

    /**
     *
     * @param {string} name
     * @returns {string}
     */
    getAttr(name) {
        return this.element.getAttribute(name);
    }

    /**
     *
     * @param {string} name
     * @returns {DOM}
     */
    delAttr(name) {
        this.element.removeAttribute(name);
        return this;
    }

    /**
     *
     * @param {Object<string,any>} kv - ket-value pairs for properties to set
     * @returns {DOM} - this
     */
    setAttrs(kv) {
        Object.keys(kv).forEach(key => this.element.setAttribute(key,kv[key]));
        return this;
    }

    /**
     *
     * @param {string} name
     * @param {any} value
     * @returns {DOM}
     */
    setProp(name,value) {
        this.element[name]=value;
        return this;
    }

    /**
     *
     * @param {Object<string,any>} kv
     * @return {DOM}
     */
    setProps(kv) {
        Object.keys(kv).forEach(key => this.element[key]=kv[key]);
        return this;
    }

    /**
     *
     * @param {string} name - parameter name
     * @returns {*}
     */
    getProp(name) {
        return this.element[name];
    }

    /**
     *
     * @param {Array<string>} classes
     * @returns {DOM}
     */
    addClasses(classes = []) {
        this.element.classList.add(...classes);
        return this;
    }

    /**
     *
     * @param {string} klass
     * @returns {DOM}
     */
    addClass(klass) {
        return this.addClasses([klass]);
    }

    /**
     *
     * @param {string} klass
     * @returns {boolean}
     */
    hasClass(klass = '') {
        return this.element.classList.contains(klass);
    }

    /**
     *
     * @param {Array<string>}classes
     * @returns {DOM}
     */
    removeClasses(classes = []) {
        this.element.classList.remove(...classes);
        return this;
    }

    /**
     *
     * @param {string} klass
     * @returns {DOM}
     */
    removeClass(klass) {
        return this.removeClasses([klass]);
    }

    /**
     * @typedef {keyof HTMLElementEventMap} EventName
     * @typedef {HTMLElementEventMap[EventName]} EventType
     *
     * @callback EvListener
     * @param {EventType} ev
     * @returns {Any}
     *
     * @param {EventName} event
     * @param {EvListener} listener
     * @param {(boolean|AddEventListenerOptions)} [options]
     * @returns {DOM}
     */
    addEventListener(event,listener,options = null) {
        this.element.addEventListener(event,listener,options);
        return this;
    }




    /**
     * @desc Getter for data value (depending on control type)
     * @returns {*}
     */
    get value() {
        return (this.element.type==='checkbox')? this.element.checked : this.element.value;
    }

    /**
     * @desc Setter for data value (depending on control type)
     * @param v
     */
    set value(v) {
        if(this.element.type==='checkbox') {
            this.element.checked=v;
        }
        else {
            this.element.value = v;
        }
    }

    /**
     *
     * @param {string} [error=] - validity error message to set ('' -> no error)
     */
    validity(error = '') {
        this.element.setCustomValidity(error);
    }

    //set [name](value) { this.element[name]=value; }
    //get [name]() { return this.element[name]; }

    click() {
        this.element.click();
    }

    /**
     *
     * @param {Event} event
     */
    fire(event) {
        this.element.dispatchEvent(event);
    }


}

class DOMHelper {
    /**
     *
     * @param {string} message
     * @param {string} name
     * @returns {DOM}
     * @constructor
     */
    static Button(message,name='') {
        return new DOM('button')
            .text(message)
            .setAttrs({
                type: 'button',
                name: name
            });
    }

    /**
     *
     * @param {string[]} strings
     * @param {boolean} multiple
     * @constructor
     */
    static Select(strings,multiple=false) {
        let dom = new DOM('select', {
            multiple: multiple
        });
        strings.forEach(s => {
            let o = new DOM('option', {
                text: s
            });
            dom.append(o);
        });
        return dom;
    }


}


class DOMTable {

    /**
     *
     * @param {[string]} headers
     * @param {[[string]]} rows
     */
    constructor(headers=[],rows=[],klass=null) {
        this.headers=headers.map(h => h.toString());
        this.rows=rows;
        this.table = new DOM('table');
        if(klass!==null) { this.table.addClass(klass); }
    }

    reload(rows = []) {
        this.rows = rows;
        this.render();
    }

    /**
     *
     * @param {string} tag
     * @param {[string]} values
     * @returns {DOM}
     */
    makeRow(tag,values) {
        return new DOM('tr').appendAll(values.map( v => new DOM(tag).text(v)));
    }


    render() {
        let h = this.makeRow('th',this.headers);
        let r = this.rows.map((row,idx) => {
            return this.makeRow('td', row).setAttr('index',idx);
        });
        this.table.empty().append(h).appendAll(r);
        return this.table;
    }

    get dom() { return this.table; }

    static load(dom) {
        let heads = [];
        let rows = [];
        let r = dom.childrenWithTag('tr');
        r.forEach((row,idx) => {
            let tag = (idx===0) ? 'th' : 'td';
            let items = row.childrenWithTag(tag).map(e => e.getText());
            if(idx===0) { heads = items; }
            else { rows.push(items); }
        });
        return new DOMTable(heads, rows);
    }
}

