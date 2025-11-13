import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import "./DrywallGanttChart.css";
import { FrappeGantt } from "frappe-gantt-react";
import { Task, ViewMode } from "frappe-gantt-react";
import { DrywallItem } from "../models/DrywallItem";
import { Moment } from "moment";

interface GanttTask {
  id: string;
  name: string;
  start: string;
  end: string;
  progress: number;
  dependencies: string[];
  custom_class?: string;
}

interface DrywallGanttChartProps {
  items: DrywallItem[];
}

export const DrywallGanttChart: React.FC<DrywallGanttChartProps> = ({ items }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    // Создаем отдельную задачу для каждого элемента с его реальными датами
    const ganttTasks: GanttTask[] = items.map((item, index) => ({
      id: item.id?.toString() || `item-${index}`,
      name: formatProductName(item.product.toString()),
      start: item.startProduction.toISOString(),
      end: item.endProduction.toISOString(),
      progress: 100,
      dependencies: [],
      custom_class: `product-type-${getProductType(item.product.toString())}`
    }));

    setTasks(ganttTasks as unknown as Task[]);
  }, [items]);

  // Функция для форматирования названия продукта
  const formatProductName = (productName: string): string => {
    return productName
      .replace(/\s+/g, ' ')
      .trim();
  };

  // Функция для определения типа продукта (для цветового кодирования)
  const getProductType = (productName: string): string => {
    // Извлекаем тип продукта для группировки по цветам
    if (productName.includes('ГКЛВ')) return 'gklv';
    if (productName.includes('ГКЛ')) return 'gkl';
    if (productName.includes('ГКЛО')) return 'gklo';
    if (productName.includes('Empty')) return 'empty';
    return 'other';
  };

  const handleDateChange = (task: Task, start: Moment, end: Moment) => {
    console.log("Date changed", task, start.toISOString(), end.toISOString());
  };

  const handleClick = (task: Task) => {
    console.log("Task clicked", task);
  };

  return (
    <Card>
      <Card.Title className="text-center mt-1">
        <i className="bi bi-bar-chart-steps" />
        Диаграмма Ганта производства гипсокартона
      </Card.Title>
      <Card.Body>
        {tasks.length > 0 ? (
          <FrappeGantt
            tasks={tasks}
            viewMode={ViewMode.HalfDay}
            onDateChange={handleDateChange}
            onClick={handleClick}
          />
        ) : (
          <p>Нет данных для отображения</p>
        )}
      </Card.Body>
    </Card>
  );
};