export class XSet<T> extends Set<T> {

  constructor(items?: T[] | null) {
    super(items);
  }

  union(other: Set<T>) : XSet<T> {
    let els = [...this].concat(...other);
    return new XSet(els);
  }

  intersection(other: Set<T>) : XSet<T> {
    return new XSet<T>([...this].filter(x => other.has(x)));
  }

  difference(other: Set<T>) : XSet<T> {
    return new XSet([...this].filter(x => !other.has(x)));
  }

  differences(other: XSet<T>) : [XSet<T>, XSet<T>] {
    return [this.difference(other), other.difference(this)];
  }

  symmetricDifference(other: XSet<T>) : XSet<T> {
    let [a,b] = this.differences(other);
    return a.union(b);
  }

  isDisjointFrom(other: Set<T>) : boolean {
    return this.intersection(other).size===0;
  }
  isSubsetOf(other: Set<T>) : boolean {
    return this.difference(other).size===0;
  }

}
