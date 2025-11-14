import React, { useEffect, useMemo, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { DrywallItem } from "../models/DrywallItem";
import "./ProductionTable.css";

interface ProductionTableProps {
  items: DrywallItem[];  
}

interface ProductionCell {
  item: DrywallItem;
  duration: number;
}

export const ProductionTable: React.FC<ProductionTableProps> = ({ items }) => {
  const [format, setFormat] = useState(24);

  const productTypes = useMemo(() => {
    const types = new Set(items.map(item => item.product.toString()));
    return Array.from(types).sort();
  }, [items]);

  const timeColumns = useMemo(() => {
    if (items.length === 0) return [];
    const allStartTimes = items.map(item => item.startProduction.getTime());
    const allEndTimes = items.map(item => item.endProduction.getTime());

    const minTime = new Date(Math.min(...allStartTimes));
    const maxTime = new Date(Math.max(...allEndTimes));

    minTime.setMinutes(0, 0, 0);
    maxTime.setHours(maxTime.getHours() + 1, 0, 0, 0);

    const columns: Date[] = [];
    const currentTime = new Date(minTime);

    while (currentTime <= maxTime) {
      columns.push(new Date(currentTime));
      currentTime.setHours(currentTime.getHours() + format);
    }

    return columns;
  }, [items]);

  const tableData = useMemo(() => {
    const data: { productType: string; cells: ProductionCell[] }[] = [];

    productTypes.forEach(productType => {
      const rowCells: ProductionCell[] = timeColumns.map(() => ({ item: null as any, duration: 0 }));

      items.forEach(item => {
        if (item.product.toString() !== productType) return;
        const startTime = item.startProduction.getTime();
        const endTime = item.endProduction.getTime();

        timeColumns.forEach((columnTime, columnIndex) => {
          const columnStart = columnTime.getTime();
          const columnEnd = columnStart + 60 * 60 * 1000 * format;

          const overlapStart = Math.max(startTime, columnStart);
          const overlapEnd = Math.min(endTime, columnEnd);
          const overlapMinutes = Math.max(0, (overlapEnd - overlapStart) / (1000 * 60));

          if (overlapMinutes > 0) {
            rowCells[columnIndex] = { item, duration: overlapMinutes };
          }
        });
      });

      data.push({ productType, cells: rowCells });
    });

    return data;
  }, [items, productTypes, timeColumns]);


  const formatTimeHeader = (date: Date): string =>
    date.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });

  const formatDateHeader = (date: Date): string =>
    date.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit" });

  const getCellColor = (duration: number): string => {
    if (duration === 0) return "transparent";
    if (duration <= 180) return "var(--color-low)";
    if (duration <= 540) return "var(--color-medium)";
    return "var(--color-high)";
  };



  const cellTemplate = (
    rowData: { productType: string; cells: ProductionCell[] },
    colIndex: number
  ) => {
    const cell = rowData.cells[colIndex];
    const bgColor = getCellColor(cell.duration);

    return (
      <div
        style={{
          backgroundColor: cell.item && cell.item.id === 0 ? "grey" : bgColor,
          cursor: cell.duration > 0 ? "pointer" : "default",
          textAlign: "center",
          padding: "1px",
          color: cell.duration > 180 || cell.item?.id === 0 ? "#fff" : "inherit", // белый текст на цветных ячейках
          fontWeight: cell.duration > 0 ? "bold" : "normal",
        }}
        title={
          cell.duration > 0
            ? `${rowData.productType}\n${formatTimeHeader(
              timeColumns[colIndex]
            )} - ${formatTimeHeader(
              new Date(timeColumns[colIndex].getTime() + 60 * 60 * 1000)
            )}\nПродолжительность: ${Math.round(cell.duration)} мин.`
            : ""
        }
      >
        {cell.duration > 0 && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span>{Math.round(cell.duration)}'</span>
            <span style={{ fontSize: "0.8em" }}>
              {cell.item?.id !== 0 && Math.round(cell.duration * cell.item?.product.factSpeed * (Number(cell.item?.product.width.value) / 1000))} м².
            </span>

          </div>
        )}
      </div>
    );
  };


  if (items.length === 0) {
    return (
      <Card>
        <p className="text-center text-muted">Нет данных для отображения</p>
      </Card>
    );
  }

  return (
    <Card 
      className="full-height-card"
      title={
        <span>
          <i className="bi bi-table" style={{ marginRight: "8px" }} />
          Таблица производства гипсокартона
        </span>
      }
      
    >
      <DataTable value={tableData} scrollable scrollHeight="100%">
        {/* Первый столбец закреплён */}
        <Column
          field="productType"
          header="Вид гипсокартона"
          frozen
          alignFrozen="left"
          style={{ minWidth: "200px" }}
        />
        {timeColumns.map((time, index) => (
          <Column
            key={index}
            header={
              <div>
                <div>{formatDateHeader(time)}</div>
                <div>{formatTimeHeader(time)}</div>
              </div>
            }
            body={(rowData) => cellTemplate(rowData, index)}
            style={{ minWidth: "120px", textAlign: "center" }}
          />
        ))}
      </DataTable>
    </Card>
  );
};
