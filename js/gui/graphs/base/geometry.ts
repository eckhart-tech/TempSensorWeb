

export class Point {
  x : number;
  y : number;

  constructor(x: number = Number.NaN, y :number = Number.NaN) {
    this.x=x;
    this.y=y;
  }

  get isValid() : boolean { return Number.isFinite(this.x) && Number.isFinite(this.y); }
  toString() : string { return this.isValid ? `(${this.x},${this.y})` : '(,)'; }
}

export class DataPoint extends Point {
  index: number;
}

export function clip(n: number,min: number = Number.NEGATIVE_INFINITY,max:number = Number.POSITIVE_INFINITY) : number {
  return Math.max(min,Math.min(n,max));
}