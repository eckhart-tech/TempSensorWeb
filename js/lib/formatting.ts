



export class Format {
  static formatter: Intl.DateTimeFormat;
  private readonly x: any;

  static {
    this.formatter = new Intl.DateTimeFormat(navigator.language, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: "h24"
    });
  }

  static SetLocale(locale: string = 'en-GB') {
    this.formatter = new Intl.DateTimeFormat(locale);
  }

  static date(d: Date | number,long : boolean = false): string {
    let e = (typeof d === "number") ? new Date(d) : d;
    return this.formatter.format(e);
  }

  static jScriptDate(d: Date | number): string {
    let e = (typeof d === "number") ? new Date(d) : d;
    return e.toISOString().substring(0,10);
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

export function isNull(x: any) { return x==null; }
export function isValid(x : any) : boolean {
  return !(x===null || x=== undefined || Number.isNaN(x));
}

export function safeParseInt(x: string): number {
  let nn = parseInt(x);
  if (!isValid(nn)) {
    throw new Error(`Bad tag value ${x}`);
  }
  return nn;
}



