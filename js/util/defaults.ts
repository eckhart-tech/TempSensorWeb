

enum BrowserStorageKind {
  SESSION,
  LOCAL
}

class BaseStorage {
  storage: Storage;

  constructor(kind: BrowserStorageKind) {
    switch (kind) {
      case BrowserStorageKind.SESSION:
        this.storage = sessionStorage;
        break;
      case BrowserStorageKind.LOCAL:
        this.storage = localStorage;
    }
  }

  get keys(): string[] {
    let n = this.storage.length;
    let k: string[] = [];
    for (let i = 0; i < n; i++) {
      k.push(this.storage.key(i));
    }
    return k;
  }
  has(key: string) : boolean { return this.storage.getItem(key)!==null; }
  read(key: string) : string|null { return this.storage.getItem(key); }
  write(key: string, value: string) { this.storage.setItem(key,value); }
  delete(key: string) { this.storage.removeItem(key); }
  clear() { this.storage.clear(); }
}

class BrowserStorage extends BaseStorage {
  private values : Map<string,string>;

  constructor(kind: BrowserStorageKind) {
    super(kind);
    this.values = new Map<string, string>()
    this.keys.forEach((key) => this.values.set(key, this.storage.getItem(key)));

  }

  clear() {
    this.values.clear();
    super.clear();
  }

  read(key: string) : string|null {
    if(this.has(key)) { return this.values.get(key); }
    return null;
  }

  write(key: string,value: string) {
      this.values.set(key,value);
      super.write(key,value);
  }

  delete(key: string) {
      this.values.delete(key);
      super.delete(key);
  }
}

export class Selected extends BaseStorage {

  private readonly key : string;
  constructor(kind: BrowserStorageKind, key: string = "Selected") {
    super(kind);
    this.key=key;
  }

  get values() : string[] {
    if(this.has(this.key)) {
      return this.read(this.key).split('|');
    }
    else {
      return [];
    }
  }

  set values(items: string[]) {
    if(items.length==0) { this.delete(this.key); }
    else {
      this.write(this.key,items.join('|'));
    }
  }
}
