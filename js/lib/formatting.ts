



export class Format {
  static formatter: Intl.DateTimeFormat;
  private readonly x: any;

  static {
    this.formatter = new Intl.DateTimeFormat(navigator.language);
  }

  static SetLocale(locale: string = 'en-GB') {
    this.formatter = new Intl.DateTimeFormat(locale);
  }

  static date(d: Date | number): string {
    let e = (typeof d === "number") ? new Date(d) : d;
    return this.formatter.format(d);
  }
}

export class Convert {
  readonly x: any;
  constructor(x: any) {
    this.x=x;
  }

  get str() : string {
      return this.x?.toString() ?? '';
  }

  get num() : number {
      let y = parseFloat(this.x);
      if(Number.isNaN(y)) {
        throw new Error(`${this.x} is not convertible to a number`);
      }
      return y;
  }

  get percent() : number {
    let v = this.num;
    return Math.min(100.0,Math.max(0.0,this.num));
    }

  get date() : Date {
    let d = new Date(this.num * 1000.0);
    if (Number.isNaN(d.valueOf())) {
      throw new Error(`${this.x} is not convertible to a date`);
    }
    return d;
  }
}

export function convert(x: any) : Convert {
  return new Convert(x);
}



