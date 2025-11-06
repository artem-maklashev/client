// DrywallService.ts
import { DrywallItem } from "../models/DrywallItem";
import GypsumBoard from "../../../../model/gypsumBoard/GypsumBoard";
import Width from "../../../../model/gypsumBoard/Width";
import ApiService from "../../../../service/ApiService";
import { start } from "repl";

export class DrywallService {
  private items: DrywallItem[] = [];

  constructor(gypsumBoards: GypsumBoard[]) {
    const limitedBoards = gypsumBoards.slice(0, 3);
    const month = new Date(2025, 10, 1);
    let startDate = this.setStartTime(month);
    alert('Начало производства: ' + startDate.toLocaleString());

    this.items = limitedBoards.map((gb, index) => {
      const production = Math.floor(Math.random() * (37700 - 12050) + 12050);
      const itemStart = new Date(startDate); // ← создаём копию
      const widthValue = this.calculateWidthValue(gb.width);
      const endDate = this.calculateEndDate(itemStart, production, gb.factSpeed, widthValue);
      const item = new DrywallItem(
        gb.id ?? index + 1,
        gb,
        production,
        month,
        itemStart,
        endDate
      );
      startDate = endDate; // ← обновляем для следующего
      return item;
    });


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

  calculatePeriods(month: Date) {
    let firstDayStart = this.setStartTime(month);
    this.items.forEach((item) => {
      const itemStart = new Date(firstDayStart); // ← создаём копию
      const widthValue = this.calculateWidthValue(item.gypsumBoard.width);
      const endDate = this.calculateEndDate(itemStart, item.quantity, item.gypsumBoard.factSpeed, widthValue);
      item.startProduction = itemStart;
      item.endProduction = endDate;
      firstDayStart = endDate; // ← обновляем для следующего
    });
  }
}
