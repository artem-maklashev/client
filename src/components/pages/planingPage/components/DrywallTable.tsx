import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { DrywallItem } from "../models/DrywallItem";
import { DrywallService } from "../services/DrywallService";
import { Card } from "react-bootstrap";
import PlaningInputItem from "./PlaningItemInput";
import { Button } from "primereact/button";
import ToastMessage from "../models/library/ToastMessage";
interface DrywallTableProps {
  month: Date;
  onItemsChange?: (items: DrywallItem[]) => void; // Добавлен пропс для передачи данных
  loadedItems: DrywallItem[];
}

export const DrywallTable: React.FC<DrywallTableProps> = ({ month, onItemsChange, loadedItems }) => {
  const [items, setItems] = useState<DrywallItem[]>([]);
  const [drywallService, setDrywallService] = useState<DrywallService | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<'success' | 'danger' | 'warning' | 'info'>('success');  

  useEffect(() => {
    let isCancelled = false;

    

    const initializeService = async () => {
      try {
        // Очищаем текущие элементы перед загрузкой новых
        // setItems([]);
        // if (onItemsChange) {
        //   onItemsChange([]);
        // }

        const service = new DrywallService(month);
        
        if (isCancelled) return;
        
        setDrywallService(service);
        // const loadedItems = await service.loadItems();
        if (isCancelled) return;

        // Устанавливаем загруженные элементы в сервис без пересчета периодов
        loadedItems.sort((a, b) => b.startProduction.getTime() - a.startProduction.getTime());
        service.setItems(loadedItems);

        // Устанавливаем загруженные элементы напрямую без добавления в сервис
        // Это предотвращает ненужный пересчет периодов для загруженных данных
        if (!isCancelled) {
          setItems(loadedItems);

          // Передаем данные в родительский компонент
          if (onItemsChange) {
            onItemsChange(loadedItems);
          }
        }
      } catch (error) {
        if (!isCancelled) {
          console.error("Ошибка загрузки гипсокартона:", error);
        }
      }
    };

    initializeService();

    return () => {
      isCancelled = true;
    };
  }, [loadedItems, month, onItemsChange]);

  const message = (message: string, type: 'success' | 'danger' | 'warning' | 'info') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const onRowReorder = (e: any) => {
    if (!drywallService) return;
    const reordered = e.value as DrywallItem[];
    drywallService.reorderItems(reordered);
    const updatedItems = drywallService.getItems();
    setItems(updatedItems);

    // Передаем обновленные данные в родительский компонент
    if (onItemsChange) {
      onItemsChange(updatedItems);
    }
  };

  const handleSplit = async (item: DrywallItem) => {
    const input = prompt(`Введите количество для первой части (макс ${item.quantity}):`);
    const firstQuantity = Number(input);

    if (!drywallService || isNaN(firstQuantity)) return;

    try {
      const [firstPart, secondPart] = item.splitItem(firstQuantity);
      // TODO: Использовать более надежный способ поиска индекса, например по id
      const index = items.findIndex((i) => i.startProduction === item.startProduction);
      // await drywallService.removeItemByIndex(index);
      await drywallService.updateItem(firstPart, index);
      drywallService.insertAt(secondPart, index + 1);
      // drywallService.calculatePeriods(); // Пересчитываем периоды после вставки элементов
      const updatedItems = drywallService.getItems();
      setItems(updatedItems);

      // Передаем обновленные данные в родительский компонент
      if (onItemsChange) {
        onItemsChange(updatedItems);
      }

    } catch (error) {
      alert((error as Error).message);
    }
  };

  const handleAddItem = (item: DrywallItem) => {
    if (!drywallService) return;
    drywallService.addItem(item);
    const updatedItems = drywallService.getItems();
    setItems(updatedItems);

    // Передаем обновленные данные в родительский компонент
    if (onItemsChange) {
      onItemsChange(updatedItems);
    }
  };

  const handleDelete = async (item: DrywallItem) => {
    if (!drywallService) return;
    // TODO: Использовать более надежный способ поиска индекса, например по id
    // TODO: Использовать более надежный способ поиска индекса, например по id
    const index = items.findIndex((i) => i.startProduction === item.startProduction);
    
    try {
        const deletedId = await drywallService.removeItemByIndex(index);
        
        const updatedItems = drywallService.getItems();
        setItems(updatedItems);

       message(`Успешно удалены данные с ID: ${deletedId}`, "success");

        if (onItemsChange) {
            onItemsChange(updatedItems);
        }
    } catch (error) {
        message((error as Error).message, "danger");
    }
};

  const handleEdit = async (item: DrywallItem, index: number) => {
    const input = prompt(`Введите количество :`);
    const quantity = Number(input);

    if (!drywallService || isNaN(quantity)) return;

    try {
      const newItem = item;
      newItem.quantity = quantity;
      const  result = await drywallService.updateItem(newItem, index);
      if (result) {
        message("Успешно обновлено", "info");
      } else {
        message("Ошибка при обновлении", "danger");
      }
      const updatedItems = drywallService.getItems();
      setItems(updatedItems);

      // Передаем обновленные данные в родительский компонент
      if (onItemsChange) {
        onItemsChange(updatedItems);
      }

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
        <PlaningInputItem onAdd={handleAddItem} month={month} />
        <DataTable
          value={items}
          reorderableRows
          onRowReorder={onRowReorder}
          tableStyle={{ minWidth: "30rem" }}          
        >
          <Column rowReorder headerStyle={{ width: "3rem" }} />
          <Column
            header="Тип гипсокартона"
            body={(rowData: DrywallItem) => rowData.product?.toString() ?? "—"}
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
            field="startProduction"
            body={(rowData) => rowData.startProduction?.toLocaleDateString("ru-RU", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            })}
            sortable
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
            body={(rowData, options) => (
              <div className="d-flex justify-content-center gap-2">
                <Button
                  icon="pi pi-pencil"
                  className="p-button-rounded p-button-info p-button-sm"
                  onClick={() => handleEdit(rowData, options.rowIndex)}
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
      <ToastMessage type={toastType} message={toastMessage} show={showToast} onClose={() => setShowToast(false)}/>
    </Card>
  );
};
