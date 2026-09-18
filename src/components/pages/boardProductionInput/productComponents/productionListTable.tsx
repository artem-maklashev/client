import React, { useEffect, useMemo, useState } from "react";
import {
  Badge,
  Col,
  Container,
  ProgressBar,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import { Button } from "primereact/button";

import ReportData from "../../../../model/ReportData";
import GypsumBoard from "../../../../model/gypsumBoard/GypsumBoard";
import ReportModalPage from "../ReportModalPage";
import GypsumBoardCategory from "../../../../model/gypsumBoard/GypsumBoardCategory";
import { saveConsumptions, saveUpdatedReport } from "../SaveUpdatedReport";
import BoardProduction from "../../../../model/production/BoardProduction";
import Delays from "../../../../model/delays/Delays";
import { getUserRole } from "../../../../service/Api";
import ApiService from "../../../../service/ApiService";
import MaterialConsumption from "../../../../model/specification/MaterialConsumption";

import "bootstrap-icons/font/bootstrap-icons.css";

interface ProductionListTableProps {
  boardProductions: ReportData<
    GypsumBoard,
    GypsumBoardCategory,
    BoardProduction,
    Delays
  >[];
}

const ProductionListTable: React.FC<ProductionListTableProps> = ({
  boardProductions,
}) => {
  const adminRoles = ["ADMIN", "GB_ADMIN"];

  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] =
    useState<ReportData<
      GypsumBoard,
      GypsumBoardCategory,
      BoardProduction,
      Delays
    > | null>(null);

  const [reportData, setReportData] = useState<
    ReportData<GypsumBoard, GypsumBoardCategory, BoardProduction, Delays>[]
  >([]);

  const [consumptions, setConsumptions] = useState<MaterialConsumption[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [updateConsumption, setUpdateConsumption] = useState(false);

  useEffect(() => {
    if (Array.isArray(boardProductions)) {
      setReportData(
        [...boardProductions].sort(
          (a, b) =>
            new Date(b.productionList.productionStart).getTime() -
            new Date(a.productionList.productionStart).getTime()
        )
      );
    } else {
      setReportData([]);
    }
  }, [boardProductions]);

  const handleClick = (
    item: ReportData<
      GypsumBoard,
      GypsumBoardCategory,
      BoardProduction,
      Delays
    >
  ) => {
    const selectedItemButton = new ReportData(
      item.product,
      item.productionList,
      item.productions,
      item.delays,
      item.defectsLogs
    );

    setSelectedItem(selectedItemButton);
    setShowModal(true);
  };

  const onSave = async (
    updatedReport: ReportData<
      GypsumBoard,
      GypsumBoardCategory,
      BoardProduction,
      Delays
    >,
    updatedConsumptions: MaterialConsumption[]
  ) => {
    if (!reportData) return;

    try {
      const savedReport = await saveUpdatedReport(updatedReport);

      if (savedReport && updatedConsumptions?.length > 0) {
        updatedConsumptions.forEach(
          (consumption) =>
            (consumption.productionList = savedReport.productionList)
        );

        await saveConsumptions(updatedConsumptions);
        setUpdateConsumption(true);
      }

      if (savedReport) {
        setReportData((prev) =>
          prev.map((report) =>
            report.productionList.id === savedReport.productionList.id
              ? savedReport
              : report
          )
        );
      }

      setShowModal(false);
    } catch (error) {
      console.error("Ошибка при сохранении:", error);
    }
  };

  const handleRemoveReport = async (
    item: ReportData<
      GypsumBoard,
      GypsumBoardCategory,
      BoardProduction,
      Delays
    >
  ) => {
    try {
      await ApiService.deleteReport(item.productionList.id);

      setReportData((prev) =>
        prev.filter(
          (report) => report.productionList.id !== item.productionList.id
        )
      );
    } catch (error) {
      console.error("Ошибка при удалении отчёта:", error);
    }
  };

  useEffect(() => {
    const fetchConsumptions = async (
      reports: ReportData<
        GypsumBoard,
        GypsumBoardCategory,
        BoardProduction,
        Delays
      >[]
    ) => {
      setLoading(true);

      try {
        const productions = reports.map((report) => report.productionList);
        const consumptionsForReport =
          await ApiService.getConsumptionsByProductions(productions);

        setConsumptions(consumptionsForReport);
      } catch (error) {
        console.error("Ошибка при загрузке расхода сырья:", error);
      } finally {
        setLoading(false);
        setUpdateConsumption(false);
      }
    };

    if (reportData && updateConsumption) {
      fetchConsumptions(reportData);
    }
  }, [reportData, updateConsumption]);

  useEffect(() => {
    setUpdateConsumption(true);
  }, [reportData]);

  const calculateDefectActs = (productions: BoardProduction[]): number => {
    return productions.reduce(
      (sum, production) =>
        production.category.id === 1
          ? sum - production.value
          : sum + production.value,
      0
    );
  };

  const calculateDelays = (delays: Delays[]) => {
    return delays.reduce((acc, delay) => {
      const diffInMinutes =
        (new Date(delay.endTime).getTime() -
          new Date(delay.startTime).getTime()) /
        (1000 * 60);

      return acc + diffInMinutes;
    }, 0);
  };

  const calculateDefectPercent = (
    item: ReportData<
      GypsumBoard,
      GypsumBoardCategory,
      BoardProduction,
      Delays
    >
  ): string => {
    const productions = item.productions;

    const total = productions.filter(
      (production) => production.category.id === 1
    );

    const totalValue = total.reduce((acc, t) => acc + t.value, 0);

    if (totalValue === 0) {
      return "0.00%";
    }

    const good = productions.filter(
      (production) =>
        production.category.id > 1 && production.category.id < 5
    );

    const goodValue = good.reduce((acc, t) => acc + t.value, 0);

    return `${(((totalValue - goodValue) / totalValue) * 100).toFixed(2)}%`;
  };

  const materialMap = useMemo(() => {
    const map = new Map<number, number>();

    consumptions.forEach((consumption) => {
      const id = consumption.productionList.id;
      map.set(id, (map.get(id) || 0) + consumption.quantity);
    });

    return map;
  }, [consumptions]);

  const getDelayVariant = (minutes: number) => {
    if (minutes > 60) return "danger";
    if (minutes > 30) return "warning";
    return "info";
  };

  return (
    <>
      <style>
        {`
    .production-page {
      min-height: 100%;
      background: #f3f4f6;
    }

    /* =========================
       HEADER
       ========================= */

    .production-header {
      padding: 2px 4px 22px;
    }

    .production-title {
      color: #1f2937;
      font-size: 1.18rem;
      font-weight: 650;
      letter-spacing: -0.025em;
    }

    .production-subtitle {
      color: #8a93a1;
      font-size: 0.76rem;
      margin-top: 5px;
    }

    .production-title-icon {
      width: 34px;
      height: 34px;
      display: flex;
      align-items: center;
      justify-content: center;

      border-radius: 10px;

      background: #e9eaed;
      color: #596273;

      font-size: 0.95rem;

      box-shadow:
        inset 0 1px 0 rgba(255,255,255,.8),
        0 1px 2px rgba(0,0,0,.04);
    }

    .production-count {
      display: inline-flex;
      align-items: center;
      gap: 8px;

      min-height: 36px;

      padding: 0 13px;

      background: #ffffff;
      color: #667085;

      border: 1px solid #e1e4e8;
      border-radius: 10px;

      font-size: 0.74rem;
      font-weight: 550;

      box-shadow:
        0 2px 5px rgba(31,41,55,.035),
        inset 0 1px 0 rgba(255,255,255,.9);
    }

    .production-count i {
      color: #8c95a3;
      font-size: .72rem;
    }

    .production-count strong {
      color: #374151;
      font-weight: 650;
    }


    /* =========================
       TABLE CARD
       ========================= */

    .production-card {
      position: relative;

      background: #ffffff;

      border: 1px solid #e1e4e8;
      border-radius: 15px;

      overflow: hidden;

      box-shadow:
        0 1px 2px rgba(16,24,40,.03),
        0 8px 24px rgba(16,24,40,.045);
    }

    .production-card::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;

      height: 1px;

      background: rgba(255,255,255,.95);

      z-index: 3;
    }

    .production-table-wrapper {
      overflow-x: auto;
    }

    /*
      ВАЖНО:
      fixed layout предотвращает ситуацию,
      когда браузер растягивает PRODUCT на пол-экрана.
    */
    .production-table {
      width: 100%;
      min-width: 1220px;

      table-layout: fixed;

      margin-bottom: 0 !important;
    }


    /* =========================
       COLUMN WIDTHS
       ========================= */

    .production-table .col-id {
      width: 70px;
    }

    .production-table .col-period {
      width: 135px;
    }

    .production-table .col-date {
      width: 115px;
    }

    .production-table .col-shift {
      width: 120px;
    }

    .production-table .col-product {
      width: 370px;
    }

    .production-table .col-delay {
      width: 285px;
    }

    .production-table .col-material {
      width: 90px;
    }

    .production-table .col-defect {
      width: 100px;
    }

    .production-table .col-actions {
      width: 105px;
    }


    /* =========================
       HEADER
       ========================= */

    .production-table thead {
      position: sticky;
      top: 0;
      z-index: 2;
    }

    .production-table thead th {
      height: 46px;

      padding: 0 12px !important;

      background: #f7f8fa !important;

      color: #737d8d !important;

      border-top: 0 !important;
      border-bottom: 1px solid #e3e6ea !important;

      font-size: 0.66rem;
      font-weight: 650;

      letter-spacing: .06em;
      text-transform: uppercase;

      vertical-align: middle !important;

      white-space: nowrap;
    }

    .production-table thead th:first-child {
      padding-left: 16px !important;
    }

    .production-table thead th:last-child {
      padding-right: 16px !important;
    }


    /* =========================
       ROWS
       ========================= */

    .production-table tbody tr {
      background: #ffffff;

      transition:
        background .16s ease,
        box-shadow .16s ease;
    }

    .production-table tbody tr:hover {
      position: relative;

      background: #fafbfc !important;

      box-shadow:
        inset 3px 0 0 #8d96a5,
        0 1px 8px rgba(16,24,40,.025);
    }

    .production-table tbody td {
    height: 58px;
    padding: 7px 10px !important;

    color: #374151;

    border-top: 0 !important;
    border-bottom: 1px solid #edf0f2 !important;

    vertical-align: middle !important;
    }

    .production-table tbody tr:last-child td {
      border-bottom: 0 !important;
    }


    /* =========================
       ID
       ========================= */

    .report-id {
      display: inline-flex;

      align-items: center;
      justify-content: center;

      min-width: 42px;
      height: 25px;

      padding: 0 7px;

      border-radius: 7px;

      background: #f1f2f4;

      color: #697386;

      font-size: .68rem;
      font-weight: 600;

      box-shadow:
        inset 0 1px 1px rgba(255,255,255,.7);
    }


    /* =========================
       TIME
       ========================= */

    .time-block {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 90px;
    }

    .time-line {
        display: flex;
        align-items: center;
        gap: 6px;

        color: #667085;
        font-size: .70rem;
        line-height: 1;
    }

    .time-line i {
        width: 12px;
        color: #9ba3af;
        font-size: .62rem;
    }

    .time-line strong {
        color: #303846;
        font-weight: 650;
    }


    /* =========================
       DATE
       ========================= */

    .date-value {
      color: #596273;

      font-size: .74rem;
      font-weight: 550;

      white-space: nowrap;
    }


    /* =========================
       SHIFT
       ========================= */

    .shift-chip {
      display: inline-flex;

      align-items: center;
      justify-content: center;

      gap: 6px;

      min-width: 56px;
      height: 28px;

      padding: 0 9px;

      border-radius: 8px;

      background: #f5f6f7;

      border: 1px solid #e5e7ea;

      color: #596273;

      font-size: .72rem;
      font-weight: 600;

      box-shadow:
        inset 0 1px 0 rgba(255,255,255,.9);
    }

    .shift-chip i {
      font-size: .72rem;
    }


    /* =========================
       PRODUCT
       ========================= */

    .product-cell {
    display: flex;
    align-items: center;
    gap: 9px;
    min-width: 0;
    }

    .product-icon {
    width: 34px;
    height: 34px;
    flex: 0 0 34px;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 9px;

    background: #f1f2f4;
    color: #687384;

    font-size: .85rem;

    border: 1px solid #e5e7ea;
    }

    .product-cell > div:last-child {
      min-width: 0;
    }

    .product-name {
    color: #202733;
    font-size: .79rem;
    font-weight: 650;
    line-height: 1.15;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.product-spec {
    display: flex;
    align-items: center;
    gap: 4px;

    margin-top: 3px;

    color: #8a93a1;
    font-size: .66rem;
    line-height: 1;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    }

    .product-spec strong {
      color: #626d7c;
      font-weight: 600;
    }

    .spec-separator {
      color: #c3c7ce;
    }


    /* =========================
       DELAYS
       ========================= */

    .delay-cell {
      width: 100%;
      padding-right: 4px;
    }

    .delay-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    margin-bottom: 5px;
}

.delay-label {
    color: #929aa7;
    font-size: .63rem;
}

.delay-value {
    color: #3e4857;
    font-size: .69rem;
    font-weight: 650;
}

.delay-progress {
    height: 3px !important;
    border-radius: 99px !important;
    background: #e9ecef !important;
    }

    .delay-progress .progress-bar {
      border-radius: 99px;
    }


    /* =========================
       STATUS
       ========================= */

    .status-icon {
    width: 26px;
    height: 26px;

    border-radius: 7px;

    font-size: .66rem;
    }

    .status-success {
      color: #527d68;

      background: #edf5f1;

      border: 1px solid #dcebe4;
    }

    .status-empty {
      color: #a5acb6;

      background: #f5f6f7;

      border: 1px solid #eaecf0;
    }


    /* =========================
       DEFECT
       ========================= */

    .defect-badge {
    min-width: 54px;
    height: 26px;

    padding: 0 7px;

    border-radius: 7px;

    font-size: .67rem;
    font-weight: 650;
    }

    .defect-ok {
      color: #527d68;

      background: #edf5f1;

      border: 1px solid #dcebe4;
    }

    .defect-warning {
      color: #9b5454;

      background: #f9eeee;

      border: 1px solid #f0dddd;
    }


    /* =========================
       ACTIONS
       ========================= */

    .actions {
      display: flex;

      align-items: center;
      justify-content: center;

      gap: 3px;
    }

    .production-action.p-button {
      width: 32px;
      height: 32px;

      border-radius: 8px !important;

      color: #8992a0 !important;

      transition:
        background .15s ease,
        color .15s ease,
        transform .15s ease;
    }

    .production-action.p-button:hover {
      background: #f1f2f4 !important;

      color: #4f5968 !important;

      transform: translateY(-1px);
    }

    .production-action.delete-action.p-button:hover {
      background: #f8eeee !important;

      color: #a75a5a !important;
    }

    .production-action.p-button:disabled {
      opacity: .35;
    }


    /* =========================
       EMPTY STATE
       ========================= */

    .empty-state {
      padding: 75px 20px !important;
    }

    .empty-icon {
      width: 56px;
      height: 56px;

      display: flex;

      align-items: center;
      justify-content: center;

      margin: 0 auto 14px;

      border-radius: 15px;

      background: #f0f1f3;

      color: #9aa2ae;

      font-size: 1.35rem;

      box-shadow:
        inset 0 1px 0 rgba(255,255,255,.8);
    }

    .empty-title {
      color: #596273;

      font-size: .85rem;
      font-weight: 600;
    }

    .empty-subtitle {
      margin-top: 5px;

      color: #9aa2ae;

      font-size: .72rem;
    }


    /* =========================
       RESPONSIVE
       ========================= */

    @media (max-width: 1200px) {
      .production-page {
        padding-left: 16px !important;
        padding-right: 16px !important;
      }

      .production-card {
        border-radius: 13px;
      }
    }

    @media (max-width: 768px) {
      .production-page {
        padding-left: 10px !important;
        padding-right: 10px !important;
      }

      .production-title {
        font-size: 1.05rem;
      }

      .production-subtitle {
        display: none;
      }

      .production-count {
        padding: 0 10px;
      }
    }
  `}
      </style>

      <Container fluid className="production-page px-3 pt-2 pb-2">
        {/* Заголовок */}
        <div className="production-header pb-0">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <div className="d-flex align-items-center gap-2">
                <div className="production-title-icon">
                  <i className="bi bi-bar-chart-line" />
                </div>

                <div>
                  <h5 className="production-title mb-0">
                    Журнал производства
                  </h5>

                  <div className="production-subtitle">
                    Производственные отчёты и показатели смен
                  </div>
                </div>
              </div>
        </div>

              <div className="production-count">
                <i className="bi bi-layers" />
                <strong>{reportData.length}</strong>

                <span>
                  {reportData.length === 1
                    ? "запись"
                    : reportData.length >= 2 && reportData.length <= 4
                      ? "записи"
                      : "записей"}
                </span>
              </div>
            </div>
          </div>
          <Row>
            <Col>
              <div className="production-card">
                <div className="production-table-wrapper">
                  <Table
                    hover
                    responsive={false}
                    className="production-table align-middle"
                  >
                    <thead>
                      <tr>
                        <th className="col-id text-center">ID</th>

                        <th className="col-period">
                          Период
                        </th>

                        <th className="col-date text-center">
                          Дата
                        </th>

                        <th className="col-shift text-center">
                          Смена
                        </th>

                        <th className="col-product">
                          Продукт
                        </th>

                        <th className="col-delay">
                          Простои
                        </th>

                        <th className="col-material text-center">
                          Сырьё
                        </th>

                        <th className="col-defect text-center">
                          Брак
                        </th>

                        <th className="col-actions text-center">
                          Действия
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {reportData.length > 0 ? (
                        reportData.map((item) => {
                          const delayMinutes = Math.round(
                            calculateDelays(item.delays)
                          );

                          const materialQuantity =
                            materialMap.get(item.productionList.id) || 0;

                          const hasMaterials = materialQuantity > 0;

                          const hasDefects =
                            Math.abs(
                              Math.round(
                                calculateDefectActs(item.productions)
                              )
                            ) !== 0;

                          const defectPercent =
                            calculateDefectPercent(item);

                          const shiftIsDay =
                            item.productionList.shift.name === "Дневная";

                          return (
                            <tr key={item.productionList.id} className="pt-0">
                              {/* ID */}
                              <td className="text-center">
                                <span className="report-id">
                                  #{item.productionList.id}
                                </span>
                              </td>

                              {/* Период */}
                              <td>
                                <div className="time-block">
                                  <div className="time-line">
                                    <i className="bi bi-play-circle" />
                                    <strong>
                                      {new Date(
                                        item.productionList.productionStart
                                      ).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </strong>
                                  </div>

                                  <div className="time-line">
                                    <i className="bi bi-stop-circle" />
                                    <span>
                                      {new Date(
                                        item.productionList.productionFinish
                                      ).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </span>
                                  </div>
                                </div>
                              </td>

                              {/* Дата */}
                              <td className="text-center">
                                <span className="date-value">
                                  {new Date(
                                    item.productionList.productionDate
                                  ).toLocaleDateString()}
                                </span>
                              </td>

                              {/* Смена */}
                              <td className="text-center">
                                <span className="shift-chip">
                                  <i
                                    className={`bi ${shiftIsDay
                                        ? "bi-sun"
                                        : "bi-moon-stars"
                                      }`}
                                    style={{
                                      color: shiftIsDay
                                        ? "#e9a51c"
                                        : "#5b78d5",
                                    }}
                                  />

                                  {item.productionList.shift.name}
                                </span>
                              </td>

                              {/* Продукт */}
                              <td>
                                <div className="product-cell">
                                  <div className="product-icon">
                                    <i className="bi bi-box-seam" />
                                  </div>

                                  <div>
                                    <div className="product-name">
                                      {item.product.tradeMark.name}
                                    </div>

                                    <div className="product-spec">
                                      <span>
                                        тип{" "}
                                        <strong>
                                          {
                                            (item.product as GypsumBoard)
                                              .boardType.name
                                          }
                                          -
                                          {
                                            (item.product as GypsumBoard)
                                              .edge.name
                                          }
                                        </strong>
                                      </span>

                                      <span className="spec-separator">•</span>

                                      <span>
                                        <strong>
                                          {
                                            (item.product as GypsumBoard)
                                              .thickness.value
                                          }
                                        </strong>
                                        ×
                                        {
                                          (item.product as GypsumBoard)
                                            .width.value
                                        }
                                        ×
                                        {
                                          (item.product as GypsumBoard)
                                            .length.value
                                        }
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </td>

                              {/* Простои */}
                              <td>
                                <div className="delay-cell">
                                  <div className="delay-header">
                                    <span className="delay-label">
                                      Время простоя
                                    </span>

                                    <span className="delay-value">
                                      {delayMinutes} мин
                                    </span>
                                  </div>

                                  <ProgressBar
                                    now={
                                      delayMinutes > 0
                                        ? Math.min(
                                          (delayMinutes / 120) * 100,
                                          100
                                        )
                                        : 0
                                    }
                                    variant={getDelayVariant(delayMinutes)}
                                    className="delay-progress"
                                  />
                                </div>
                              </td>

                              {/* Сырьё */}
                              <td className="text-center">
                                {isLoading ? (
                                  <Spinner
                                    animation="border"
                                    size="sm"
                                    variant="primary"
                                  />
                                ) : hasMaterials ? (
                                  <span
                                    className="status-icon status-success"
                                    title={`Сырьё учтено: ${materialQuantity}`}
                                  >
                                    <i className="bi bi-check-lg" />
                                  </span>
                                ) : (
                                  <span
                                    className="status-icon status-empty"
                                    title="Данные о сырье отсутствуют"
                                  >
                                    <i className="bi bi-dash-lg" />
                                  </span>
                                )}
                              </td>

                              {/* Брак */}
                              <td className="text-center">
                                {isLoading ? (
                                  <Spinner
                                    animation="border"
                                    size="sm"
                                    variant="primary"
                                  />
                                ) : (
                                  <span
                                    className={`defect-badge ${hasDefects
                                        ? "defect-warning"
                                        : "defect-ok"
                                      }`}
                                  >
                                    {defectPercent}
                                  </span>
                                )}
                              </td>

                              {/* Действия */}
                              <td className="text-center">
                                <div className="actions">
                                  <Button
                                    icon="pi pi-pencil"
                                    className="production-action p-button-rounded p-button-text p-button-sm"
                                    onClick={() => handleClick(item)}
                                    tooltip="Редактировать отчёт"
                                    tooltipOptions={{ position: "top" }}
                                    aria-label="Редактировать отчёт"
                                  />

                                  <Button
                                    icon="pi pi-trash"
                                    className="production-action delete-action p-button-rounded p-button-text p-button-sm"
                                    onClick={() =>
                                      handleRemoveReport(item)
                                    }
                                    disabled={
                                      !adminRoles.includes(getUserRole())
                                    }
                                    tooltip="Удалить отчёт"
                                    tooltipOptions={{ position: "top" }}
                                    aria-label="Удалить отчёт"
                                  />
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={9} className="empty-state text-center">
                            <div className="empty-icon">
                              <i className="bi bi-inbox" />
                            </div>

                            <div className="empty-title">
                              Нет данных для отображения
                            </div>

                            <div className="empty-subtitle">
                              Производственные отчёты появятся здесь
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>
              </div>
            </Col>
          </Row>

          <ReportModalPage
            show={showModal}
            reportData={selectedItem}
            onHide={() => {
              setShowModal(false);
              setSelectedItem(null);
            }}
            onSave={onSave}
          />
      </Container>
    </>
  );
};

export default ProductionListTable;
