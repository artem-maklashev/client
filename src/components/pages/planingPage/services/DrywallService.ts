import GypsumBoard from "../../../../model/gypsumBoard/GypsumBoard";
import ApiService from "../../../../service/ApiService";
import { DrywallItem } from "../models/DrywallItem";


export class DrywallService {

  private items: DrywallItem[] = [];
  async loadItems(): Promise<DrywallItem[]> {
    const allGypsumBoards: GypsumBoard[] = await ApiService.fetchGypsumBoards();
    const limitedBoards = allGypsumBoards.slice(0, 3);
     this.items = limitedBoards.map((gb, index) => new DrywallItem(gb.id ?? index+1, gb, Math.random() * (37700 - 12050) + 12050));
    return this.items;
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
}