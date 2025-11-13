import { DrywallItem } from "../models/DrywallItem";
import Width from "../../../../model/gypsumBoard/Width";
import { DrywallRepository } from "./DrywallRepository";
import { EmptyBoard } from "../../../../model/gypsumBoard/EmptyBoard";

export class DrywallService {
  private static baseUrl = process.env.REACT_APP_API_URL;

  private items: DrywallItem[] = [];
  private month: Date;
  private repository: DrywallRepository = new DrywallRepository();

  constructor(month: Date) {
    this.month = new Date(month);
  }

  async loadItems(): Promise<DrywallItem[]> {
  const rawItems = await this.repository.getDrywallItemsByMonth(this.month);
  const result: DrywallItem[] = [];

  if (!rawItems.length) return result;

  // 1️⃣ Проверяем первый элемент
  const first = DrywallItem.fromJSON(rawItems[0]);
  const firstStart = first.startProduction;

  // Формируем ожидаемое начало месяца: 1 число, 08:00
  const expectedStart = new Date(firstStart);
  expectedStart.setDate(1);
  expectedStart.setHours(8, 0, 0, 0);

  // Если не совпадает → вставляем пустую доску в начало
  if (firstStart.getTime() !== expectedStart.getTime()) {
    const empty = new EmptyBoard();
    const gapMinutes = (firstStart.getTime() - expectedStart.getTime()) / (1000 * 60);

    const emptyItem = new DrywallItem(
      0,
      empty,
      gapMinutes,
      new Date(first.month),
      new Date(expectedStart),
      new Date(firstStart)
    );

    result.push(emptyItem);
  }

  // 2️⃣ Проходим по всем элементам
  for (let i = 0; i < rawItems.length; i++) {
    const current = DrywallItem.fromJSON(rawItems[i]);
    result.push(current);

    const nextRaw = rawItems[i + 1];
    if (nextRaw) {
      const next = DrywallItem.fromJSON(nextRaw);
      const endDate = current.endProduction.getTime();
      const startDate = next.startProduction.getTime();

      if (endDate < startDate) {
        const empty = new EmptyBoard();
        const gapMinutes = (startDate - endDate) / (1000 * 60);
        const emptyItem = new DrywallItem(
          0,
          empty,
          gapMinutes,
          new Date(current.month),
          new Date(endDate),
          new Date(startDate)
        );
        result.push(emptyItem);
      }
    }
  }

  return result;
}




  getItems(): DrywallItem[] {
    return [...this.items];
  }

  /**
   * Устанавливает элементы без пересчета периодов
   * Используется при загрузке данных с сервера
   */
  setItems(items: DrywallItem[]) {
    this.items = [...items];
  }

  addItem(item: DrywallItem) {
    this.items.push(item);
    this.calculatePeriods();
  }

  removeItemById(id: number) {
    this.items = this.items.filter((item) => item.id !== id);
    this.calculatePeriods();
  }

  async removeItemByIndex(index: number): Promise<number> {
    const item = this.items[index];
    if (item.id > 0) {
      await this.repository.deleteDrywallItem(item.id);
    }
    this.items = this.items.filter((_, i) => i !== index);
    this.calculatePeriods();
    return item.id;
  }


  async updateItem(item: DrywallItem) {
    const index = this.items.findIndex((i) => i.id === item.id);
    if (index !== -1) {
      const result = await this.repository.updateDrywallItem(item);
      this.items[index] = item;
      return result;
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

  insertAtRaw(item: DrywallItem, index: number) {
    this.items.splice(index, 0, item);
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
    
    let firstDayStart = this.setStartTime(new Date(this.month));
    // Пересчитываем даты только для новых элементов (id <= 0)
    // Элементы с id > 0 были загружены с сервера и имеют правильные даты
    this.items.forEach((item) => {
      // // Пропускаем элементы, загруженные с сервера
      // if (item.id > 0) {
      //   // Обновляем firstDayStart для следующего элемента
      //   firstDayStart = new Date(item.endProduction);
      //   return;
      // }
      
      const itemStart = new Date(firstDayStart); // ← создаём копию
      const widthValue = this.calculateWidthValue(item.product.width);
      const endDate = this.calculateEndDate(itemStart, item.quantity, item.product.factSpeed, widthValue);
      item.startProduction = itemStart;
      item.endProduction = endDate;
      firstDayStart = endDate; // ← обновляем для следующего
    });
    
    // Сохраняем только новые элементы (id <= 0)
    this.items.forEach((item) => {
      if (item.id === -1) {
        item.month = new Date(item.month.toDateString());
        const responce = this.repository.addDrywallItem(item);
        responce.then((data) => {
          if (data) {
            item.id = data.id;
          }

        }).catch((error) => {
          console.error("Ошибка при сохранении элемента планирования:", error);
        });
      } else {
        if (item.id > 0) {
          this.repository.updateDrywallItem(item);
        }
      }
    });
  }
}
