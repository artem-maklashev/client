import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { DrywallItem } from "../models/DrywallItem";
import { DrywallService } from "../services/DrywallService";
import { Card } from "react-bootstrap";
import PlaningInputItem from "./PlaningItemInput";
import { Button } from "primereact/button";

interface DrywallTableProps {
  month: Date;
}

export const DrywallTable: React.FC<DrywallTableProps> = ({ month }) => {
  const [items, setItems] = useState<DrywallItem[]>([]);
  const [drywallService, setDrywallService] = useState<DrywallService | null>(null);

  useEffect(() => {
    const initializeService = async () => {
      try {
        // const gypsumBoards = await ApiService.fetchGypsumBoards();
        const service = new DrywallService(month);
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
      const index = items.findIndex((i) => i.startProduction === item.startProduction);
      drywallService.removeItemByIndex(index);
      drywallService.insertAt(firstPart, index); // можно вставить в начало
      drywallService.insertAt(secondPart, index + 1);
      drywallService.calculatePeriods();
      setItems(drywallService.getItems());

    } catch (error) {
      alert((error as Error).message);
    }
  };

  const handleAddItem = (item: DrywallItem) => {
    if (!drywallService) return;
    drywallService.addItem(item);
    setItems(drywallService.getItems());
  };

  const handleDelete = (item: DrywallItem) => {
    if (!drywallService) return;
    const index = items.findIndex((i) => i.startProduction === item.startProduction);
    drywallService.removeItemByIndex(index);
    drywallService.calculatePeriods();

    setItems(drywallService.getItems());
  };

  const handleEdit = (item: DrywallItem) => {
    const input = prompt(`Введите количество :`);
    const quantity = Number(input);

    if (!drywallService || isNaN(quantity)) return;

    try {
      const index = items.findIndex((i) => i.startProduction === item.startProduction);
      const newItem = item;
      newItem.quantity = quantity;
      drywallService.removeItemByIndex(index);// можно вставить в начало
      drywallService.calculatePeriods();
      setItems(drywallService.getItems());

    } catch (error) {
      alert((error as Error).message);
    }
  };


  return (
    <Card>
      <Card.Title className="text-center mt-1">
        <i className="bi bi-calendar2-week" />
        Порядок производства гипсокартона
      </Card.Title>
      <Card.Body>
        <PlaningInputItem onAdd={handleAddItem} />
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
            style={{ width: '120px', textAlign: 'center' }}
            body={(rowData) => (
              <div className="d-flex justify-content-center gap-2">
                <Button
                  icon="pi pi-pencil"
                  className="p-button-rounded p-button-info p-button-sm"
                  onClick={() => handleEdit(rowData)}
                  tooltip="Редактировать"
                  tooltipOptions={{ position: 'top' }}
                />

                <Button
                  icon="pi pi-sort"
                  rounded
                  severity="success"
                  onClick={() => handleSplit(rowData)}
                  tooltip="Разделить"
                  tooltipOptions={{ position: 'top' }}
                />

                <Button
                  icon="pi pi-trash"
                  className="p-button-rounded p-button-danger p-button-sm"
                  onClick={() => handleDelete(rowData)}
                  tooltip="Удалить"
                  tooltipOptions={{ position: 'top' }}
                />
              </div>
            )}
          />



        </DataTable>
      </Card.Body>
    </Card>
  );
};
