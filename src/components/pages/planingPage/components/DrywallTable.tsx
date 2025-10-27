import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { DrywallItem } from "../models/DrywallItem";
import { DrywallService } from "../services/DrywallService";

const drywallService = new DrywallService();

export const DrywallTable: React.FC = () => {
  const [items, setItems] = useState<DrywallItem[]>(drywallService.getItems());

  const onRowReorder = (e: any) => {
    const reordered = e.value as DrywallItem[];
    drywallService.reorderItems(reordered);
    setItems(reordered);
  };

  return (
    <div className="card">
      <h3>📦 План производства гипсокартона</h3>
      <DataTable value={items} reorderableRows onRowReorder={onRowReorder} tableStyle={{ minWidth: "30rem" }}>
        <Column rowReorder headerStyle={{ width: "3rem" }} />
        <Column field="name" header="Тип гипсокартона" />
        <Column field="quantity" header="Количество (шт)" />
      </DataTable>
    </div>
  );
};
