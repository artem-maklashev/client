import ApiService from "../../../../service/ApiService";
import { DrywallItem } from "../models/DrywallItem";


export class DrywallService {
  private items: DrywallItem[] = [];

//   async loadItems(): Promise<DrywallItem[]> {
//     this.items = await ApiService.fetchGypsumBoards();
//     return this.items;
//   }
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
}