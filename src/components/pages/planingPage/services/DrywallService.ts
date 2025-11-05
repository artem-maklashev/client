// DrywallService.ts
import { DrywallItem } from "../models/DrywallItem";
import GypsumBoard from "../../../../model/gypsumBoard/GypsumBoard";
import ApiService from "../../../../service/ApiService";

export class DrywallService {
  private items: DrywallItem[] = [];

  constructor(gypsumBoards: GypsumBoard[]) {
    const limitedBoards = gypsumBoards.slice(0, 3);
    const month = new Date(2025, 10, 1);
    this.items = limitedBoards.map((gb, index) =>
      new DrywallItem(
        gb.id ?? index + 1,
        gb,
        Math.floor(Math.random() * (37700 - 12050) + 12050),
        month,
        new Date(month.getTime() + index),
        new Date(month.getTime() + index + 1)
      )
    );
  } 

  getItems(): DrywallItem[] {
    return [...this.items];
  }

  addItem(item: DrywallItem) {
    this.items.push(item);
  }

  removeItem(id: number) {
    this.items = this.items.filter((item) => item.id !== id);
  }

  updateItem(item: DrywallItem) {
    const index = this.items.findIndex((i) => i.id === item.id);
    if (index !== -1) {
      this.items[index] = item;
    }
  }

  getItem(id: number): DrywallItem | undefined {
    return this.items.find((item) => item.id === id);
  }

  reorderItems(newOrder: DrywallItem[]) {
    this.items = [...newOrder];
  }

  insertAt(item: DrywallItem, index: number) {
    this.items.splice(index, 0, item);
  }

  moveItem(oldIndex: number, newIndex: number) {
    const [movedItem] = this.items.splice(oldIndex, 1);
    this.insertAt(movedItem, newIndex);
  }
}
