import React, { useEffect, useMemo, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { DrywallItem } from "../models/DrywallItem";
import { SelectButton } from "primereact/selectbutton";
import "./ProductionTable.css";

interface ProductionTableProps {
  planingItems: DrywallItem[];
}

interface ProductionCell {
  item: DrywallItem | null;
  duration: number;
}

// -----------------------------------------------------
// Helpers
// -----------------------------------------------------
const formats = [
  { label: "12ч", value: 12 },
  { label: "24ч", value: 24 },
];

const roundToHour = (d: Date) => {
  const nd = new Date(d);
  nd.setMinutes(0, 0, 0);
  return nd;
};

const addHours = (d: Date, h: number) => {
  const nd = new Date(d);
  nd.setHours(nd.getHours() + h);
  return nd;
};

const createTimeColumns = (items: DrywallItem[], stepHours: number): Date[] => {
  if (items.length === 0) return [];

  const minStart = new Date(Math.min(...items.map(i => i.startProduction.getTime())));
  const maxEnd   = new Date(Math.max(...items.map(i => i.endProduction.getTime())));

  const start = roundToHour(minStart);
  const end   = roundToHour(addHours(maxEnd, stepHours));

  const columns: Date[] = [];
  let current = start;

  while (current <= end) {
    columns.push(new Date(current));
    current = addHours(current, stepHours);   // <-- шаг теперь зависит от format
  }

  return columns;
};

const getOverlapMinutes = (start: number, end: number, colStart: number, colEnd: number) => {
  const overlapStart = Math.max(start, colStart);
  const overlapEnd = Math.min(end, colEnd);
  return Math.max(0, (overlapEnd - overlapStart) / (1000 * 60));
};

const getCellColor = (duration: number) => {
  if (duration === 0) return "transparent";
  if (duration <= 180) return "var(--color-low)";
  if (duration <= 540) return "var(--color-medium)";
  return "var(--color-high)";
};

// -----------------------------------------------------
// Component
// -----------------------------------------------------
export const ProductionTable: React.FC<ProductionTableProps> = ({ planingItems }) => {
  const [format, setFormat] = useState<number>(24);
  const [items, setItems] = useState<DrywallItem[]>([]);

  useEffect(() => {
    setItems(planingItems);
  }, [planingItems]);

  const productTypes = useMemo(
    () => Array.from(new Set(items?.map(i => i.product.toString()))).sort(),
    [items]
  );

  const timeColumns = useMemo(
  () => createTimeColumns(items, format),
  [items, format]
);

const tableData = useMemo(() => {
  return productTypes.map(type => {
    const cells = timeColumns.map(() => ({ item: null, duration: 0 }) as ProductionCell);

    const rows = items.filter(i => i.product.toString() === type);

    rows.forEach(item => {
      const start = item.startProduction.getTime();
      const end = item.endProduction.getTime();

      timeColumns.forEach((col, idx) => {
        const colStart = col.getTime();
        const colEnd = colStart + format * 3600 * 1000;

        const minutes = getOverlapMinutes(start, end, colStart, colEnd);

        if (minutes > 0) {
          cells[idx] = { item, duration: minutes };
        }
      });
    });

    return { productType: type, cells };
  });
}, [items, productTypes, timeColumns, format]);

  const cellTemplate = (row: { productType: string; cells: ProductionCell[] }, colIndex: number) => {
    const cell = row.cells[colIndex];
    const bg = getCellColor(cell.duration);

    return (
      <div
        style={{
          backgroundColor: cell.item?.id === 0 ? "grey" : bg,
          cursor: cell.duration > 0 ? "pointer" : "default",
          textAlign: "center",
          padding: "1px",
          fontWeight: cell.duration > 0 ? "bold" : "normal",
          color: cell.duration > 180 || cell.item?.id === 0 ? "#fff" : undefined
        }}
        title={
          cell.duration > 0
            ? `${row.productType}\n` +
              `${timeColumns[colIndex].toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })} - ` +
              `${new Date(timeColumns[colIndex].getTime() + format * 3600 * 1000).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}\n` +
              `Продолжительность: ${Math.round(cell.duration)} мин.`
            : ""
        }
      >
        {cell.duration > 0 && cell.item && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span>{Math.round(cell.duration)}'</span>
            <span style={{ fontSize: "0.8em" }}>
              {cell.item?.id !== 0 &&
                Math.round(
                  cell.duration * cell.item.product.factSpeed * (Number(cell.item.product.width.value) / 1000)
                )}{" "}
              м².
            </span>
          </div>
        )}
      </div>
    );
  };

  if (!items.length) {
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
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <span>
            <i className="bi bi-table" style={{ marginRight: 8 }} />
            Таблица производства гипсокартона
            </span>

          <SelectButton
            value={format}
            options={formats}
            optionLabel="label"
            optionValue="value"
            onChange={e => setFormat(e.value)}
            aria-label="12/24ч"
            
            />

        </div>
      }
    >
      <DataTable value={tableData} scrollable scrollHeight="100%">
        <Column
          field="productType"
          header="Вид гипсокартона"
          frozen
          alignFrozen="left"
          style={{ minWidth: 200 }}
        />

        {timeColumns.map((time, i) => (
          <Column
            key={i}
            header={
              <div>
                <div>{time.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit" })}</div>
                <div>
                  {time.toLocaleTimeString("ru-RU", {
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </div>
              </div>
            }
            body={row => cellTemplate(row, i)}
            style={{ minWidth: 120, textAlign: "center" }}
          />
        ))}
      </DataTable>
    </Card>
  );
};
