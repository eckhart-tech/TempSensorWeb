import { DOMTableBase, TableTags, TableUnit } from "./tableBase";
import { DOM } from "../dom";

const CSSTags: TableTags = {
  main: 'nav',
  header: 'header',
  body: 'main',
  title: 'h1'
}

class CSSTableUnit {
  cells: DOM[];
  kind: TableUnit;
  constructor(values: string[],kind: TableUnit = TableUnit.Data) {
    this.kind = kind;
    this.cells = values.map(value => {
      return new DOM('li').text(value);
    });
  }

  render() {
    return new DOM('ul').addClass(this.kind).appendAll(this.cells);
  }
}

export class CSSTable extends DOMTableBase {
  header: DOM;

  constructor(
    headers: string[] = [],
    rows: string[][] = [],
    title: string | null = null,
    klass: string | null = null,
  ) {
    super(CSSTags, headers, rows, title, klass);
  }

  makeRow(kind: TableUnit, values: string[]): DOM {
    return new CSSTableUnit(values,kind).render();
  }


}



