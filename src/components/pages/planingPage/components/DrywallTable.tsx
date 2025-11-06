import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { DrywallItem } from "../models/DrywallItem";
import { DrywallService } from "../services/DrywallService";
import ApiService from "../../../../service/ApiService";
import { Card } from "react-bootstrap";
import PlaningInputItem from "./PlaningItemInput";

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

  const handleSplit = (item: DrywallItem) => {
    const input = prompt(`Введите количество для первой части (макс ${item.quantity}):`);
    const firstQuantity = Number(input);

    if (!drywallService || isNaN(firstQuantity)) return;

    try {
      const [firstPart, secondPart] = item.splitItem(firstQuantity);
      drywallService.removeItem(item.id);
      drywallService.insertAt(firstPart, 0); // можно вставить в начало
      drywallService.insertAt(secondPart, 1);
      setItems(drywallService.getItems());
    } catch (error) {
      alert((error as Error).message);
    }
  };


  return (
    <Card>
      <Card.Title className="text-center">    
        <i className="bi bi-calendar2-week" />
        Порядок производства гипсокартона
      </Card.Title>
      <Card.Body>
      <PlaningInputItem onAdd={function (item: DrywallItem): void {
          throw new Error("Function not implemented.");
        } } />
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
        <Column field="quantity" header="м²" />
        <Column
          header="Месяц"
          body={(rowData) =>
            rowData.month?.toLocaleDateString("ru-RU", {
              month: "short",
              year: "numeric"
            })
          }
        />

        <Column
          header="Начало производства"
          body={(rowData) => rowData.startProduction?.toLocaleDateString("ru-RU", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          })}
        />
        <Column
          header="Конец производства"
          body={(rowData) => rowData.endProduction?.toLocaleDateString("ru-RU", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          })}
        />
        <Column
          header="Действия"
          body={(rowData: DrywallItem) => (
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() => handleSplit(rowData)}
            >
              Разделить
            </button>
          )}
        />

      </DataTable>
      </Card.Body>
    </Card>
  );
};
