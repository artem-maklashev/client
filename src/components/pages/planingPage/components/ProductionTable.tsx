import React, { useEffect, useMemo, useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { DrywallItem } from "../models/DrywallItem";
import { SelectButton } from "primereact/selectbutton";
import "./ProductionTable.css";
import { ProductionPlan } from "./models/ProductionPlan";

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

const chunkArray = <T,>(arr: T[], size: number): T[][] => {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};

const formats = [
  { label: "12ч", value: 12 },
  { label: "24ч", value: 24 },
];

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
  const tableRef = useRef<HTMLDivElement>(null);
  const [activePage, setActivePage] = useState(0);
  const plan = useMemo(() => new ProductionPlan(items, format), [items, format]);

  const tableData = plan.getTableData();
  const timeColumns = plan.getTimeColumns();



  useEffect(() => {
    setItems(planingItems);
  }, [planingItems]);

  const handlePrint = () => {
  if (!tableRef.current) return;

  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const doc = printWindow.document;

  doc.open();
  doc.write(`
    <html>
    <head>
      <title>Печать таблицы</title>
      <link rel="stylesheet" href="/ProductionTable.css" />
      <style>
        body { margin: 0; padding: 20px; font-family: Arial; }
      </style>
    </head>
    <body>
      <div class="print-container">
        ${tableRef.current.innerHTML}
      </div>
    </body>
    </html>
  `);
  doc.close();

  // Дать окну время прогрузиться
  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };
}; 

  const pagedColumns = useMemo(
    () => chunkArray(timeColumns, 10),
    [timeColumns]
  );
  

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
        // title={
        //   cell.duration > 0
        //     ? `${row.productType}\n` +
        //     `${timeColumns[colIndex].toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })} - ` +
        //     `${new Date(timeColumns[colIndex].getTime() + format * 3600 * 1000).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}\n` +
        //     `Продолжительность: ${Math.round(cell.duration)} мин.`
        //     : ""
        // }
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>
            <i className="bi bi-table" style={{ marginRight: 8 }} />
            Таблица производства гипсокартона
          </span>

          <div style={{ marginTop: 10 }}>
            <Button
              label="←"
              disabled={activePage === 0}
              onClick={() => setActivePage(p => p - 1)}
              className="p-button-text"
            />

            <span style={{ margin: "0 10px" }}>
              Страница {activePage + 1} / {pagedColumns.length}
            </span>

            <Button
              label="→"
              disabled={activePage === pagedColumns.length - 1}
              onClick={() => setActivePage(p => p + 1)}
              className="p-button-text"
            />
          </div>


          <div>
            <Button
              icon="pi pi-print"
              className="p-button-rounded p-button-text"
              onClick={handlePrint}
              aria-label="Печать"
            />
            <SelectButton
              value={format}
              options={formats}
              optionLabel="label"
              optionValue="value"
              onChange={e => setFormat(e.value)}
              aria-label="12/24ч"

            />
          </div>

        </div>
      }
    >
      <div ref={tableRef} className="print-container">

  {pagedColumns.map((pageCols, pageIndex) => (
    <div
      key={pageIndex}
      className={`print-table ${pageIndex === activePage ? "" : "hidden-page"}`}
    >
      <DataTable value={tableData}>
        <Column
          field="productType"
          header="Вид гипсокартона"
          frozen
          alignFrozen="left"
          style={{ minWidth: 200 }}
        />

        {pageCols.map((time, i) => (
          <Column
            key={i}
            header={
              <div>
                <div>{time.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit" })}</div>
                <div>
                  {format === 12 ? time.toLocaleTimeString("ru-RU", {
                    hour: "2-digit",
                    minute: "2-digit"
                  }): ""}
                </div>
              </div>
            }
            body={row => cellTemplate(row, timeColumns.indexOf(time))}
            style={{ minWidth: 120, textAlign: "center" }}
          />
        ))}
      </DataTable>
    </div>
  ))}

</div>
      

    </Card>
  );
};
