import {DOM} from "./dom";

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

