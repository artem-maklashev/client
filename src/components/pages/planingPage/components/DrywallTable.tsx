import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { DrywallItem } from "../models/DrywallItem";
import { DrywallService } from "../services/DrywallService";
import ApiService from "../../../../service/ApiService";

export const DrywallTable: React.FC = () => {
  const [items, setItems] = useState<DrywallItem[]>([]);
  const [drywallService, setDrywallService] = useState<DrywallService | null>(null);

  useEffect(() => {
    const initializeService = async () => {
      try {
        const gypsumBoards = await ApiService.fetchGypsumBoards();
        const service = new DrywallService(gypsumBoards);
        setDrywallService(service);
        setItems(service.getItems());
      } catch (error) {
        console.error("Ошибка загрузки гипсокартона:", error);
      }
    };
    initializeService();
  }, []);

  const onRowReorder = (e: any) => {
    if (!drywallService) return;
    const reordered = e.value as DrywallItem[];
    drywallService.reorderItems(reordered);
    setItems(drywallService.getItems());
  };

  return (
    <div className="card">
      <h3 style={{
        margin: 0,
        fontSize: '1.125rem',
        fontWeight: 600,
        color: '#1e293b',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}>
        <i className="bi bi-calendar2-week" />
        Порядок производства гипсокартона</h3>
      <DataTable
        value={items}
        reorderableRows
        onRowReorder={onRowReorder}
        tableStyle={{ minWidth: "30rem" }}
      >
        <Column rowReorder headerStyle={{ width: "3rem" }} />
        <Column
          header="Тип гипсокартона"
          body={(rowData: DrywallItem) => rowData.gypsumBoard?.toString() ?? "—"}
        />
        <Column field="quantity" header="Количество (шт)" />
        <Column
          header="Месяц"
          body={(rowData) => rowData.month?.toLocaleDateString("ru-RU")}
        />
        <Column
          header="Начало производства"
          body={(rowData) => rowData.startProduction?.toLocaleDateString("ru-RU")}
        />
        <Column
          header="Конец производства"
          body={(rowData) => rowData.endProduction?.toLocaleDateString("ru-RU")}
        />
      </DataTable>
    </div>
  );
};
