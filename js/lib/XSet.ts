export interface SetLike<T> {
  get size() : number;
  has(element: T) : boolean;
  keys() : SetIterator<T>;
}

export class ESSet<T> extends Set<T> {

  constructor(items?: T[] | null) {
    super(items);
  }

  union(other: SetLike<T>) : ESSet<T> {
    let els = [...this].concat(...Array.from(other.keys()));
    return new ESSet(els);
  }

  intersection(other: SetLike<T>) : ESSet<T> {
    return new ESSet<T>(this.filter(x => other.has(x)));
  }

  difference(other: SetLike<T>) : ESSet<T> {
    return new ESSet(this.filter(x => !other.has(x)));
  }

  differences(other: ESSet<T>) : [ESSet<T>, ESSet<T>] {
    return [this.difference(other), other.difference(this)];
  }

  symmetricDifference(other: ESSet<T>) : ESSet<T> {
    let [a,b] = this.differences(other);
    return a.union(b);
  }

  isDisjointFrom(other: SetLike<T>) : boolean {
    return this.intersection(other).size===0;
  }
  isSubsetOf(other: SetLike<T>) : boolean {
    return this.difference(other).size===0;
  }
  isSupersetOf(other: ESSet<T>) : boolean {
    return other.isSubsetOf(this);
  }

  map<O>(fn: (value: T) => O) : O[] {
    return [...this].map(fn);
  }

  filter(fn : (value: T) => boolean) : T[] {
    return [...this].filter(fn);
  }

}
