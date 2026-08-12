import ReportData from "../ReportData";
import Shift from "../Shift";
import GypsumBoard from "../gypsumBoard/GypsumBoard";
import GypsumBoardCategory from "../gypsumBoard/GypsumBoardCategory";
import BoardProduction from "../production/BoardProduction";
import Delays from "../delays/Delays";
import BoardDefectsLog from "../defects/BoardDefectsLog";

export type BoardReportData = ReportData<
  GypsumBoard,
  GypsumBoardCategory,
  BoardProduction,
  Delays
>;

/**
 * Агрегированное состояние редактирования отчёта в модальном окне.
 *
 * Инкапсулирует данные, которые пользователь меняет в ReportModalPage,
 * и предоставляет безопасные (не мутирующие) методы для их обновления.
 */
export class ReportModalState {
  readonly reportData: BoardReportData;
  readonly selectedShift: Shift | null;
  readonly selectedProduct: GypsumBoard | null;
  readonly tableData: BoardProduction[];
  readonly startDate: Date | null;
  readonly endDate: Date | null;
  readonly delays: Delays[];
  readonly defects: BoardDefectsLog[];

  constructor(params: {
    reportData: BoardReportData;
    selectedShift: Shift | null;
    selectedProduct: GypsumBoard | null;
    tableData: BoardProduction[];
    startDate: Date | null;
    endDate: Date | null;
    delays: Delays[];
    defects: BoardDefectsLog[];
  }) {
    this.reportData = params.reportData;
    this.selectedShift = params.selectedShift;
    this.selectedProduct = params.selectedProduct;
    this.tableData = params.tableData;
    this.startDate = params.startDate;
    this.endDate = params.endDate;
    this.delays = params.delays;
    this.defects = params.defects;
  }

  withSelectedShift(shift: Shift | null): ReportModalState {
    return new ReportModalState({ ...this, selectedShift: shift });
  }

  withSelectedProduct(product: GypsumBoard | null): ReportModalState {
    return new ReportModalState({ ...this, selectedProduct: product });
  }

  withStartDate(date: Date | null): ReportModalState {
    return new ReportModalState({ ...this, startDate: date });
  }

  withEndDate(date: Date | null): ReportModalState {
    return new ReportModalState({ ...this, endDate: date });
  }

  withTableData(tableData: BoardProduction[]): ReportModalState {
    return new ReportModalState({ ...this, tableData });
  }

  withDelays(delays: Delays[]): ReportModalState {
    return new ReportModalState({ ...this, delays });
  }

  withDefects(defects: BoardDefectsLog[]): ReportModalState {
    return new ReportModalState({ ...this, defects });
  }
}