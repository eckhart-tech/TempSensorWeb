
export class InitListDict<Keys,Values> {
  private dict : Map<Keys,Values[]>

  constructor() {
    this.dict=new Map<Keys,Values[]>();
  }

  set(key: Keys,value: Values) {
    if(!this.dict.has(key)) {
      this.dict.set(key,[]);
    }
    this.dict.get(key).push(value);
  }

  get(key: Keys) : Values[] {
    return this.dict.get(key) ?? [];
  }

  has(key: Keys) : boolean {
    return this.dict.has(key);
  }

  get keys(): Keys[] { return Array.from(this.dict.keys()); }

  get size() : number { return this.dict.size; }
  count(key: Keys):number { return this.dict.get(key)?.length ?? 0; }

  map<T>(callback: (v : Values[]) => T) : Map<Keys,T> {
    let m = new Map<Keys,T>();
    this.keys.forEach(k => {
      m.set(k,callback(this.dict.get(k)));
    });
    return m;
  }
}