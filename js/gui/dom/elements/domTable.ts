import {DOM} from "../dom";
import {DOMElement} from "./base";
import { DOMTableBase, TableTags, TableUnit } from "./tableBase";

const DOMTags: TableTags = {
  main: 'table',
  header: 'thead',
  body: 'tbody',
  title: 'caption'
}

export class DOMTable extends DOMTableBase {


  constructor(
    headers: string[] = [],
    rows: string[][] = [],
    title: string | null = null,
    klass: string | null = null,
  ) {
    super(DOMTags, headers, rows, title, klass);
  }

  makeRow(kind: TableUnit, values: string[]): DOM {
    return new DOM('tr').appendAll(values.map((v) => new DOM(kind).text(v)));
  }

  

}



