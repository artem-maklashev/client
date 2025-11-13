import React, { useMemo } from "react";
import { Table, Card } from "react-bootstrap";
import { DrywallItem } from "../models/DrywallItem";
import "./ProductionTable.css";

interface ProductionTableProps {
  items: DrywallItem[];
}

interface ProductionCell {
  item: DrywallItem;
  duration: number; // продолжительность в минутах
}

export const ProductionTable: React.FC<ProductionTableProps> = ({ items }) => {
  // Получаем уникальные виды гипсокартона
  const productTypes = useMemo(() => {
    const types = new Set(items.map(item => item.product.toString()));
    return Array.from(types).sort();
  }, [items]);

  // Генерируем столбцы с датами и временем
  const timeColumns = useMemo(() => {
    if (items.length === 0) return [];

    // Находим общий временной диапазон
    const allStartTimes = items.map(item => item.startProduction.getTime());
    const allEndTimes = items.map(item => item.endProduction.getTime());
    
    const minTime = new Date(Math.min(...allStartTimes));
    const maxTime = new Date(Math.max(...allEndTimes));

    // Округляем до ближайшего часа
    minTime.setMinutes(0, 0, 0);
    maxTime.setHours(maxTime.getHours() + 1, 0, 0, 0);

    const columns: Date[] = [];
    const currentTime = new Date(minTime);

    while (currentTime <= maxTime) {
      columns.push(new Date(currentTime));
      currentTime.setHours(currentTime.getHours() + 12);
    }

    return columns;
  }, [items]);

  // Создаем матрицу данных для таблицы
  const tableData = useMemo(() => {
    const data: Record<string, ProductionCell[]> = {};

    // Инициализируем данные для каждого типа продукта
    productTypes.forEach(productType => {
      data[productType] = timeColumns.map(() => ({ item: null as any, duration: 0 }));
    });

    // Заполняем данные из items
    items.forEach(item => {
      const productType = item.product.toString();
      const startTime = item.startProduction.getTime();
      const endTime = item.endProduction.getTime();
      
      timeColumns.forEach((columnTime, columnIndex) => {
        const columnStart = columnTime.getTime();
        const columnEnd = columnStart + 60 * 60 * 1000*12; // +1 час
        
        // Проверяем пересечение временных интервалов
        const overlapStart = Math.max(startTime, columnStart);
        const overlapEnd = Math.min(endTime, columnEnd);
        const overlapMinutes = Math.max(0, (overlapEnd - overlapStart) / (1000 * 60));
        
        if (overlapMinutes > 0) {
          data[productType][columnIndex] = {
            item: item,
            duration: overlapMinutes
          };
        }
      });
    });

    return data;
  }, [items, productTypes, timeColumns]);

  // Форматирование времени для заголовков
  const formatTimeHeader = (date: Date): string => {
    return date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDateHeader = (date: Date): string => {
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit'
    });
  };

  // Получаем цвет для ячейки на основе продолжительности
  const getCellColor = (duration: number): string => {
    if (duration === 0) return 'transparent';
    if (duration <= 180) return 'var(--color-low)';
    if (duration <= 540) return 'var(--color-medium)';
    return 'var(--color-high)';
  };

  const getCellTitle = (cell: ProductionCell, productType: string, columnTime: Date): string => {
    if (cell.duration === 0) return '';
    
    const endTime = new Date(columnTime);
    endTime.setHours(endTime.getHours() + 1);
    
    return `${productType}\n${formatTimeHeader(columnTime)} - ${formatTimeHeader(endTime)}\nПродолжительность: ${Math.round(cell.duration)} мин.`;
  };

  if (items.length === 0) {
    return (
      <Card>
        <Card.Body>
          <p className="text-center text-muted">Нет данных для отображения</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Title className="text-center mt-3">
        <i className="bi bi-table" />
        Таблица производства гипсокартона
      </Card.Title>
      <Card.Body>
        <div className="production-table-container">
          <Table bordered striped className="production-table">
            <thead>
              <tr>
                <th className="product-header">Вид гипсокартона</th>
                {timeColumns.map((time, index) => (
                  <th key={index} className="time-header">
                    <div className="time-header-content">
                      <div className="date">{formatDateHeader(time)}</div>
                      <div className="time">{formatTimeHeader(time)}</div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {productTypes.map(productType => (
                <tr key={productType}>
                  <td className="product-type-cell">
                    <span className="product-name">{productType}</span>
                  </td>
                  {timeColumns.map((columnTime, columnIndex) => {
                    const cell = tableData[productType][columnIndex];
                    return (
                      <td
                        key={columnIndex}
                        className="production-cell"
                        style={{
                          backgroundColor: getCellColor(cell.duration),
                          cursor: cell.duration > 0 ? 'pointer' : 'default'
                        }}
                        title={getCellTitle(cell, productType, columnTime)}
                      >
                        {cell.duration > 0 && (
                          <div className="duration-badge">
                            {Math.round(cell.duration)}'
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card.Body>
    </Card>
  );
};