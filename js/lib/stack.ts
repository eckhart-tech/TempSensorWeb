

export class Stack<T> {
  private stack: T[];

  constructor() {
    this.stack = [];
  }

  push(item: T) {
    this.stack.push(item);
  }

  pop(): T | null {
    if (this.stack.length === 0) {
      return null;
    } else {
      return this.stack.pop();
    }
  }

  peek() : T | null {
    return (this.isEmpty) ? null : this.stack[this.stack.length-1];
  }

  empty() {
    this.stack = [];
  }

  get isEmpty(): boolean {
    return this.stack.length === 0;
  }
  get length(): number {
    return this.stack.length;
  }
}


