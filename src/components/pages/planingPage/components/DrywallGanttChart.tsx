import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import "./DrywallGanttChart.css";
import { FrappeGantt } from "frappe-gantt-react";
import { Task, ViewMode } from "frappe-gantt-react";
import { DrywallItem } from "../models/DrywallItem";
import { Moment } from "moment";

// Определяем интерфейс для задачи, совместимый с frappe-gantt-react
interface GanttTask {
  id: string;
  name: string;
  start: string;
  end: string;
  progress: number;
    dependencies: string[];
  // [key: string]: any; // Добавляем индексную сигнатуру для совместимости
}

interface DrywallGanttChartProps {
  items: DrywallItem[];
}

export const DrywallGanttChart: React.FC<DrywallGanttChartProps> = ({ items }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
  const ganttTasks: GanttTask[] = items.map((item) => ({
    id: item.id.toString(),
    name: item.product.toString(),
    start: item.startProduction.toISOString(),
    end: item.endProduction.toISOString(),
    progress: 100,
    dependencies: [],
  }));

  setTasks(ganttTasks as unknown as Task[]);
}, [items]);



  // Обработчики событий с типизацией
 const handleDateChange = (task: Task, start: Moment, end: Moment) => {
  console.log("Date changed", task, start.toISOString(), end.toISOString());
};

const handleClick = (task: Task) => {
  console.log("Task clicked", task);
};

const handleDoubleClick = (task: Task) => {
  console.log("Task double clicked", task);
};

const handleDelete = (task: Task) => {
  console.log("Task deleted", task);
};


  return (
    <Card>
      <Card.Title className="text-center mt-1">
        <i className="bi bi-bar-chart-steps" />
        Диаграмма Ганта производства гипсокартона
      </Card.Title>
      <Card.Body>
        {tasks.length > 0 ? (
          < FrappeGantt
            tasks={tasks } // Приведение типа для совместимости
            viewMode={ViewMode.Day} // Приведение типа для совместимости
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