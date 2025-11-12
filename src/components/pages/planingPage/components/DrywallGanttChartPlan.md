# План реализации компонента диаграммы Ганта для DrywallTable

## Обзор
Этот документ описывает план реализации компонента диаграммы Ганта для таблицы DrywallTable, который будет отображать название гипсокартона по оси Y и дату/время начала и окончания производства по оси X, с общим количеством для каждого типа гипсокартона.

## Требования
1. Ось Y: название гипсокартона
2. Ось X: дата и время начала/окончания производства
3. Отображение общего количества для каждого типа гипсокартона
4. Группировка элементов по типам гипсокартона

## Выбранная библиотека
Для реализации диаграммы Ганта будет использована библиотека `frappe-gantt-react`, которая является популярным решением для создания диаграмм Ганта в React приложениях.

## Необходимые шаги для реализации

### 1. Установка библиотеки
```bash
npm install frappe-gantt-react
```

### 2. Создание компонента DrywallGanttChart

#### Структура компонента:
```typescript
// src/components/pages/planingPage/components/DrywallGanttChart.tsx
import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { Gantt, Task, ViewMode } from "frappe-gantt-react";
import { DrywallItem } from "../models/DrywallItem";

interface DrywallGanttChartProps {
  items: DrywallItem[];
}

export const DrywallGanttChart: React.FC<DrywallGanttChartProps> = ({ items }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    // Преобразование DrywallItem в формат Task для диаграммы Ганта
    const ganttTasks: Task[] = items.map((item, index) => ({
      id: item.id.toString(),
      name: item.gypsumBoard.toString(),
      start: item.startProduction.toISOString(),
      end: item.endProduction.toISOString(),
      progress: 100, // Поскольку это план, считаем, что все задачи завершены на 100%
      dependencies: [], // Можно добавить зависимости, если нужно
    }));
    
    setTasks(ganttTasks);
  }, [items]);

  return (
    <Card>
      <Card.Title className="text-center mt-1">
        <i className="bi bi-bar-chart-steps" />
        Диаграмма Ганта производства гипсокартона
      </Card.Title>
      <Card.Body>
        {tasks.length > 0 ? (
          <Gantt
            tasks={tasks}
            viewMode={ViewMode.Day}
            onDateChange={() => {}} // Обработчик изменения дат (не используется в режиме просмотра)
            onClick={(task) => console.log(task)}
            onDoubleClick={(task) => console.log(task)}
            onDelete={(task) => console.log(task)}
          />
        ) : (
          <p>Нет данных для отображения</p>
        )}
      </Card.Body>
    </Card>
  );
};
```

### 3. Интеграция компонента в PlaningPage

#### Обновление PlaningPage.tsx:
```typescript
// src/components/pages/planingPage/PlaningPage.tsx
import { Col, Container, Row } from "react-bootstrap";
import PeriodSelector from "../planElements/periodselector";
import { useState } from "react";
import { DrywallTable } from "./components/DrywallTable";
import { DrywallGanttChart } from "./components/DrywallGanttChart"; // Добавлен импорт

interface PlaningPageProps {
}

const PlaningPage: React.FC<PlaningPageProps> = () => {
    const now = new Date()
    const [period, setPeriod] = useState<Date>(new Date(now.getFullYear(), now.getMonth(), 1));
    const [activeTab, setActiveTab] = useState<"table" | "gantt">("table"); // Добавлено состояние для переключения вкладок

    function onPeriodChange(period: Date): void {
        setPeriod(period);
    }

    return (
        <Container fluid className="mt-5">
            <Row className="mt-5">
                <Col lg={12} sm={12} className="mt-4">
                    <PeriodSelector onPeriodChange={onPeriodChange} period={period} />
                    
                    {/* Добавлены вкладки для переключения между таблицей и диаграммой Ганта */}
                    <div className="d-flex mb-3">
                        <button 
                            className={`btn ${activeTab === "table" ? "btn-primary" : "btn-outline-primary"} me-2`}
                            onClick={() => setActiveTab("table")}
                        >
                            Таблица
                        </button>
                        <button 
                            className={`btn ${activeTab === "gantt" ? "btn-primary" : "btn-outline-primary"}`}
                            onClick={() => setActiveTab("gantt")}
                        >
                            Диаграмма Ганта
                        </button>
                    </div>
                    
                    {/* Условный рендеринг компонентов */}
                    {activeTab === "table" ? (
                        <DrywallTable month={period} />
                    ) : (
                        <DrywallGanttChart items={/* нужно передать элементы из DrywallTable */} />
                    )}
                </Col>
            </Row>
        </Container>
    )
}

export default PlaningPage;
```

### 4. Обновление DrywallTable для передачи данных

#### Необходимо обновить DrywallTable, чтобы он передавал данные в родительский компонент:

```typescript
// src/components/pages/planingPage/components/DrywallTable.tsx
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
  onItemsChange?: (items: DrywallItem[]) => void; // Добавлен пропс для передачи данных
}

export const DrywallTable: React.FC<DrywallTableProps> = ({ month, onItemsChange }) => {
  const [items, setItems] = useState<DrywallItem[]>([]);
  const [drywallService, setDrywallService] = useState<DrywallService | null>(null);

  useEffect(() => {
    const initializeService = async () => {
      try {
        // const gypsumBoards = await ApiService.fetchGypsumBoards();
        const service = new DrywallService(month);
        setDrywallService(service);
        setItems(service.getItems());
        
        // Передаем данные в родительский компонент
        if (onItemsChange) {
          onItemsChange(service.getItems());
        }
      } catch (error) {
        console.error("Ошибка загрузки гипсокартона:", error);
      }
    };
    initializeService();
  }, []);

  // Обновляем эффект для передачи изменений
  useEffect(() => {
    if (onItemsChange) {
      onItemsChange(items);
    }
  }, [items, onItemsChange]);

  // ... остальной код компонента остается без изменений
};
```

### 5. Обновление PlaningPage для работы с данными

```typescript
// src/components/pages/planingPage/PlaningPage.tsx (обновленная версия)
import { Col, Container, Row } from "react-bootstrap";
import PeriodSelector from "../planElements/periodselector";
import { useState } from "react";
import { DrywallTable } from "./components/DrywallTable";
import { DrywallGanttChart } from "./components/DrywallGanttChart";
import { DrywallItem } from "./models/DrywallItem";

interface PlaningPageProps {
}

const PlaningPage: React.FC<PlaningPageProps> = () => {
    const now = new Date()
    const [period, setPeriod] = useState<Date>(new Date(now.getFullYear(), now.getMonth(), 1));
    const [activeTab, setActiveTab] = useState<"table" | "gantt">("table");
    const [drywallItems, setDrywallItems] = useState<DrywallItem[]>([]); // Состояние для хранения элементов

    function onPeriodChange(period: Date): void {
        setPeriod(period);
    }

    const handleItemsChange = (items: DrywallItem[]) => {
        setDrywallItems(items);
    };

    return (
        <Container fluid className="mt-5">
            <Row className="mt-5">
                <Col lg={12} sm={12} className="mt-4">
                    <PeriodSelector onPeriodChange={onPeriodChange} period={period} />
                    
                    <div className="d-flex mb-3">
                        <button 
                            className={`btn ${activeTab === "table" ? "btn-primary" : "btn-outline-primary"} me-2`}
                            onClick={() => setActiveTab("table")}
                        >
                            Таблица
                        </button>
                        <button 
                            className={`btn ${activeTab === "gantt" ? "btn-primary" : "btn-outline-primary"}`}
                            onClick={() => setActiveTab("gantt")}
                        >
                            Диаграмма Ганта
                        </button>
                    </div>
                    
                    {activeTab === "table" ? (
                        <DrywallTable month={period} onItemsChange={handleItemsChange} />
                    ) : (
                        <DrywallGanttChart items={drywallItems} />
                    )}
                </Col>
            </Row>
        </Container>
    )
}

export default PlaningPage;
```

## Дополнительные улучшения

### 1. Стилизация диаграммы Ганта
Можно добавить CSS для улучшения внешнего вида диаграммы:

```css
/* src/components/pages/planingPage/components/DrywallGanttChart.css */
.gantt-container {
  height: 500px;
  overflow: auto;
}

.gantt-chart {
  min-width: 100%;
}
```

### 2. Адаптивность
Добавить адаптивность для мобильных устройств:

```typescript
// В компоненте DrywallGanttChart
useEffect(() => {
  const handleResize = () => {
    // Обработка изменения размера окна
  };
  
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);
```

## Тестирование
1. Проверить отображение диаграммы Ганта с различными наборами данных
2. Убедиться, что ось Y отображает названия гипсокартона корректно
3. Проверить, что ось X отображает даты начала и окончания производства
4. Убедиться, что общее количество отображается корректно для каждого типа гипсокартона
5. Проверить работу переключения между таблицей и диаграммой Ганта

## Возможные проблемы и решения
1. **Проблема с отображением дат**: Убедиться, что даты передаются в правильном формате ISO
2. **Проблемы с производительностью**: При большом количестве элементов может потребоваться пагинация или фильтрация
3. **Проблемы с адаптивностью**: На мобильных устройствах диаграмма может не помещаться - добавить горизонтальную прокрутку

## Заключение
Этот план описывает реализацию компонента диаграммы Ганта для таблицы DrywallTable. Реализация следует стандартным практикам React и использует проверенную библиотеку для диаграмм Ганта.