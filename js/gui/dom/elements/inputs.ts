import {DOMElement} from './base';
import { DOM } from "../dom";

export class DOMLabel extends DOMElement {
  readonly event: string = "";

  constructor(text: string, control : string|null = null) {
    super('label');
    this.dom.text(text);
    if(control != null) {
      this.dom.setAttr('for',control);
    }
  }

}

export enum DOMInputType {
  BUTTON = 'button',
  CHECKBOX = 'checkbox',
  DATE = 'date',
  NUMBER = 'number',
  RADIO = 'radio',
  TEXT = 'text'
}

export class DOMInput extends DOMElement {
  inputElement : DOM;

  constructor(kind: DOMInputType, name: string, label: string|null = null) {
    super('div');

    if(label!=null) {
      this.dom.append(new DOMLabel(label,name).dom);
    }
    this.inputElement=new DOM('input').setAttrs({
      type: kind,
      id : name,
      name: name
    });
    this.dom.append(this.inputElement);
  }

  isImmutable(i : boolean) : DOMInput {
    this.inputElement.setAttr('readonly',i);
    return this;
  }

  setDefault(v : boolean|string|number|Date) : DOMInput {
    this.inputElement.setAttr('value',v);
    return this;
  }
}