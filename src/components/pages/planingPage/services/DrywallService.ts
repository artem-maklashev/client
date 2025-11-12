import { DrywallItem } from "../models/DrywallItem";
import Width from "../../../../model/gypsumBoard/Width";
import { DrywallRepository } from "./DrywallRepository";

export class DrywallService {
  private static baseUrl = process.env.REACT_APP_API_URL;

  private items: DrywallItem[] = [];
  private month: Date;
  private repository: DrywallRepository = new DrywallRepository();

  constructor(month: Date) {
    this.month = new Date(month);
  }

  async loadItems(): Promise<DrywallItem[]> {
    return this.repository.getDrywallItemsByMonth(this.month);
  }


  getItems(): DrywallItem[] {
    return [...this.items];
  }

  addItem(item: DrywallItem) {
    this.items.push(item);
    this.calculatePeriods();
  }

  removeItemById(id: number) {
    this.items = this.items.filter((item) => item.id !== id);
    this.calculatePeriods();
  }

  removeItemByIndex(index: number) {
    this.items = this.items.filter((_, i) => i !== index);
    this.calculatePeriods();
  }


  updateItem(item: DrywallItem) {
    const index = this.items.findIndex((i) => i.id === item.id);
    if (index !== -1) {
      this.items[index] = item;
      this.calculatePeriods();
    }
  }

  getItem(id: number): DrywallItem | undefined {
    return this.items.find((item) => item.id === id);
  }

  reorderItems(newOrder: DrywallItem[]) {
    this.items = [...newOrder];
    this.calculatePeriods();
  }

  insertAt(item: DrywallItem, index: number) {
    this.items.splice(index, 0, item);
    this.calculatePeriods();
  }

  moveItem(oldIndex: number, newIndex: number) {
    const [movedItem] = this.items.splice(oldIndex, 1);
    this.insertAt(movedItem, newIndex);
    this.calculatePeriods();
  }

  /**
   * Преобразует строковое значение ширины в число и конвертирует в метры
   * @param width Объект ширины с строковым значением
   * @returns Числовое значение ширины в метрах
   */
  private calculateWidthValue(width: Width): number {
    const value = parseFloat(String(width.value).replace(",", "."));
    if (isNaN(value)) {
      throw new Error(`Некорректное значение ширины: ${width.value}`);
    }
    return value / 1000;
  }

  /**
   * Вычисляет дату окончания производства
   * @param start Дата начала производства
   * @param quantity Количество продукции
   * @param factSpeed Фактическая скорость производства
   * @param widthValue Ширина продукции в метрах
   * @returns Дата окончания производства
   */
  private calculateEndDate(start: Date, quantity: number, factSpeed: number, widthValue: number): Date {
    if (isNaN(quantity) || quantity <= 0) {
      throw new Error(`Некорректное количество продукции: ${quantity}`);
    }
    if (isNaN(factSpeed) || factSpeed <= 0) {
      throw new Error(`Некорректная скорость производства: ${factSpeed}`);
    }
    if (isNaN(widthValue) || widthValue <= 0) {
      throw new Error(`Некорректная ширина продукции: ${widthValue}`);
    }

    const duration = (quantity * 60 * 1000) / (factSpeed * widthValue);
    if (isNaN(duration) || !isFinite(duration)) {
      throw new Error(`Некорректные параметры для вычисления длительности производства: quantity=${quantity}, factSpeed=${factSpeed}, widthValue=${widthValue}`);
    }

    return new Date(start.getTime() + duration);
  }

  /**
   * Устанавливает время начала работы на 8:00
   * @param date Исходная дата
   * @returns Новая дата с установленным временем 8:00
   */
  private setStartTime(date: Date): Date {
    const newDate = new Date(date);
    newDate.setHours(8, 0, 0, 0);
    return newDate;
  }

  calculatePeriods() {
    let firstDayStart = this.setStartTime(this.month);
    this.items.forEach((item) => {
      const itemStart = new Date(firstDayStart); // ← создаём копию
      const widthValue = this.calculateWidthValue(item.product.width);
      const endDate = this.calculateEndDate(itemStart, item.quantity, item.product.factSpeed, widthValue);
      item.startProduction = itemStart;
      item.endProduction = endDate;
      firstDayStart = endDate; // ← обновляем для следующего
    });
  }


}
