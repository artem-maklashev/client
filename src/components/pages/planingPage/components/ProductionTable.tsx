import React, { useEffect, useMemo, useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { DrywallItem } from "../models/DrywallItem";
import { SelectButton } from "primereact/selectbutton";
import "./ProductionTable.css";
import styles from './PaginationControls.module.css';
import { ProductionPlan } from "./models/ProductionPlan";
import ProductionRow from "./ProductionRow";

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
    () => chunkArray(timeColumns, 11),
    [timeColumns]
  );
  
  return (
    <Card
      className="full-height-card"
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>
            <i className="bi bi-table" style={{ marginRight: 8 }} />
            Таблица производства гипсокартона
          </span>

          <div className={styles.container}>
            <button
              className={styles.navButton}
              disabled={activePage === 0}
              onClick={() => setActivePage(p => p - 1)}
              aria-label="Предыдущая страница"
            >
              ←
            </button>

            <span className={styles.pageInfo}>
              Страница {activePage + 1} / {pagedColumns.length}
            </span>

            <button
              className={styles.navButton}
              disabled={activePage === pagedColumns.length - 1}
              onClick={() => setActivePage(p => p + 1)}
              aria-label="Следующая страница"
            >
              →
            </button>
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
            <DataTable value={tableData} className="my-table" size='small'>
              <Column
                field="productType"
                header="Вид гипсокартона"
                frozen
                alignFrozen="left"
                style={{ minWidth: 250, borderCollapse: "collapse" }}

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
                          }) : ""}
                        </div>
                      </div>
                    }
                    body={row =>
                      <ProductionRow
                        rowData={row}
                        colIndex={timeColumns.indexOf(time)} />
                    }
                  />
                ))}
              
            </DataTable>
          </div>
        ))}
      </div>


    </Card>
  );
};
