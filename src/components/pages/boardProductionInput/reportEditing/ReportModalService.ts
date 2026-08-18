import BoardDefectsLog from "../../../../model/defects/BoardDefectsLog";
import Delays from "../../../../model/delays/Delays";
import GypsumBoard from "../../../../model/gypsumBoard/GypsumBoard";
import BoardProduction from "../../../../model/production/BoardProduction";
import ReportData from "../../../../model/ReportData";
import { ReportModalState } from "../../../../model/reportEditing/ReportModalState";
import ProductionList from "../../../../model/production/ProductionList";
import Shift from "../../../../model/Shift";

/**
 * Сервис бизнес-логики редактирования отчёта.
 *
 * Вынесен из React-компонента ReportModalPage и содержит всю
 * предметную логику: валидацию, генерацию id, обновление сущностей.
 */
export class ReportModalService {
  /**
   * Обновляет значение категории (выпуска) в таблице производства.
   * Не мутирует исходное состояние, а возвращает новый массив.
   */
  /**
   * Создаёт новый объект BoardProduction с заданными value и product.
   */
  private copyProduction(
    item: BoardProduction,
    value: number,
    product: GypsumBoard = item.product
  ): BoardProduction {
    return new BoardProduction(
      item.id,
      item.productionList,
      product,
      item.category,
      value
    );
  }

  /**
   * Обновляет значение категории (выпуска) в таблице производства.
   * Не мутирует исходное состояние, а возвращает новый массив.
   */
  updateCategoryValue(
    tableData: BoardProduction[],
    updatedCategory: BoardProduction
  ): BoardProduction[] {
    return tableData.map((item) =>
      item.category.id === updatedCategory.category.id
        ? this.copyProduction(item, updatedCategory.value)
        : item
    );
  }

  /**
   * Обновляет продукт во всех категориях и во всех простоях.
   * Возвращает новое состояние отчёта.
   */
  applyProduct(
    state: ReportModalState,
    product: GypsumBoard | null
  ): ReportModalState {
    if (!product) {
      return state;
    }
    const tableData = state.tableData.map((item) =>
      item.product.id !== product.id
        ? this.copyProduction(item, item.value, product)
        : item
    );
    const delays = this.applyProductToDelays(state.delays, product);
    return state
      .withSelectedProduct(product)
      .withTableData(tableData)
      .withDelays(delays);
  }

  /**
   * Обновляет простои по продукту в случае смены продукта.
   */
  applyProductToDelays(delays: Delays[], product: GypsumBoard): Delays[] {
    return delays.map((delay) =>
      delay.product !== product ? { ...delay, product } : delay
    );
  }

  /**
   * Генерирует отрицательный id для нового простоя.
   */
  generateDelayId(delays: Delays[]): number {
    if (delays.length === 0) {
      return -2;
    }
    let minId = Math.min(...delays.map((delay) => delay.id));
    if (minId > 0) {
      minId = -1;
    }
    return minId - 1;
  }

  /**
   * Добавляет или обновляет простой, возвращая новый массив.
   */
  upsertDelay(delays: Delays[], delay: Delays): Delays[] {
    const index = delays.findIndex((item) => item.id === delay.id);
    console.log(JSON.stringify(delay));

    if (index === -1) {
      const newDelay = { ...delay, id: this.generateDelayId(delays) };
      return [...delays, newDelay];
    }
    const copy = [...delays];
    copy[index] = delay;
    return copy;
  }

  /**
   * Удаляет простой по id, возвращая новый массив.
   */
  removeDelay(delays: Delays[], removingDelay: Delays): Delays[] {
    return delays.filter((delay) => delay.id !== removingDelay.id);
  }

  /**
   * Генерирует следующий id для нового дефекта.
   */
  generateDefectId(defects: BoardDefectsLog[], delays: Delays[]): number {
    let max = 0;
    if (delays.length > 0) {
      max = delays[0].id;
    }
    defects.forEach((defect) => {
      if (defect.id > max) {
        max = defect.id;
      }
    });
    return max + 1;
  }

  /**
   * Добавляет или обновляет дефект, возвращая новый массив.
   */
  upsertDefect(
    defects: BoardDefectsLog[],
    defect: BoardDefectsLog,
    delays: Delays[]
  ): BoardDefectsLog[] {
    const index = defects.findIndex((item) => item.id === defect.id);
    if (index === -1) {
      const newDefect = {
        ...defect,
        id: this.generateDefectId(defects, delays),
      };
      return [...defects, newDefect];
    }
    const copy = [...defects];
    copy[index] = { ...copy[index], defects: defect.defects, value: defect.value };
    return copy;
  }

  /**
   * Применяет сумму дефектов к категории id === 6.
   */
  applyDefectsSum(
    tableData: BoardProduction[],
    defects: BoardDefectsLog[]
  ): BoardProduction[] {
    const defectsSum = defects.reduce((sum, defect) => sum + defect.value, 0);
    return tableData.map((item) =>
      item.category.id === 6
        ? this.copyProduction(item, defectsSum)
        : item
    );
  }

  /**
   * Валидация данных отчёта перед сохранением.
   * Возвращает текст ошибки или null, если всё корректно.
   */
  validate(
    startDate: Date | null,
    endDate: Date | null,
    delays: Delays[]
  ): string | null {
    if (
      startDate &&
      endDate &&
      new Date(startDate).getTime() >= new Date(endDate).getTime()
    ) {
      return "Дата начала производства должна быть раньше даты окончания производства";
    }

    for (const delay of delays) {
      const delayStart = new Date(delay.startTime).getTime();
      const delayEnd = new Date(delay.endTime).getTime();
      const reportStart = new Date(startDate!).getTime();
      const reportEnd = new Date(endDate!).getTime();

      if (delayStart >= delayEnd) {
        return "Начало простоя не может быть позже или равно его окончанию";
      }

      if (delayStart < reportStart || delayEnd > reportEnd) {
        return "Время простоя выходит за пределы периода отчета";
      }
    }

    return null;
  }

  /**
   * Собирает итоговый ReportData из текущего состояния.
   */
  buildReportData(
    state: ReportModalState,
    fallbackShift: Shift
  ): ReportData<GypsumBoard, any, BoardProduction, Delays> {
    const report = state.reportData;
    report.product = state.selectedProduct as GypsumBoard;
    report.productionList.productionStart = state.startDate
      ? new Date(state.startDate)
      : new Date();
    report.productionList.productionFinish = state.endDate
      ? new Date(state.endDate)
      : new Date();
    report.productionList.shift = state.selectedShift || fallbackShift;
    report.delays = state.delays;
    report.defectsLogs = state.defects;
    report.productions = state.tableData;
    return report;
  }

  /**
   * Создаёт ProductionList на основе текущего выбора.
   */
  buildProductionList(
    state: ReportModalState,
    fallbackShift: Shift
  ): ProductionList {
    return (
      state.reportData.productionList ||
      new ProductionList(
        -1,
        state.startDate || new Date(),
        state.endDate || new Date(),
        new Date(),
        state.selectedShift || fallbackShift,
        // @ts-ignore тип ProductTypes недоступен в данном контексте
        undefined
      )
    );
  }

  /**
   * Форматирует имя гипсокартона.
   */
  getProductName(board: GypsumBoard): string {
    return (
      board.tradeMark.name +
      " тип " +
      board.boardType.name +
      " " +
      board.edge.name +
      "-" +
      board.thickness.value +
      "-" +
      board.width.value +
      "-" +
      board.length.value
    );
  }

  /**
   * Возвращает значение категории по её id.
   */
  getCategoryValue(tableData: BoardProduction[], id: number): number {
    const item = tableData.find((entry) => entry.category.id === id);
    return item?.value || 0;
  }
}