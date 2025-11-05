import { ProductItem } from "./ProductItem";
import { ProductNode } from "./ProductNode";

export class ProductLinkedList {
    private head: ProductNode | null = null;
    private tail: ProductNode | null = null;
    private length: number = 0;

    addLast(item: ProductItem): void {
    const node = new ProductNode(item);
    if (!this.head) {
      this.head = this.tail = node;
    } else {
      node.prev = this.tail;
      this.tail!.next = node;
      this.tail = node;
    }
    this.length++;
  }

  insertAt(index: number, item: ProductItem): void {
    if (index < 0 || index > this.length) throw new Error("Index out of bounds");

    const node = new ProductNode(item);

    if (index === 0) {
      node.next = this.head;
      if (this.head) this.head.prev = node;
      this.head = node;
      if (!this.tail) this.tail = node;
    } else {
      let current = this.head!;
      for (let i = 0; i < index - 1; i++) current = current.next!;
      node.next = current.next;
      node.prev = current;
      if (current.next) current.next.prev = node;
      current.next = node;
      if (!node.next) this.tail = node;
    }

    this.length++;
  }

  removeAt(index: number): void {
    if (index < 0 || index >= this.length) throw new Error("Index out of bounds");

    let current = this.head!;
    for (let i = 0; i < index; i++) current = current.next!;

    if (current.prev) current.prev.next = current.next;
    else this.head = current.next;

    if (current.next) current.next.prev = current.prev;
    else this.tail = current.prev;

    this.length--;
  }

  move(fromIndex: number, toIndex: number): void {
    if (fromIndex === toIndex) return;
    const item = this.getAt(fromIndex);
    this.removeAt(fromIndex);
    this.insertAt(toIndex, item);
  }

  getAt(index: number): ProductItem {
    if (index < 0 || index >= this.length) throw new Error("Index out of bounds");
    let current = this.head!;
    for (let i = 0; i < index; i++) current = current.next!;
    return current.item;
  }

  toArray(): ProductItem[] {
    const result: ProductItem[] = [];
    let current = this.head;
    while (current) {
      result.push(current.item);
      current = current.next;
    }
    return result;
  }

  size(): number {
    return this.length;
  }
}