# Рекомендации по стилизации и улучшению UX компонента диаграммы Ганта Drywall

## Обзор
Этот документ содержит рекомендации по стилизации и улучшению пользовательского опыта для компонента диаграммы Ганта в контексте страницы планирования производства гипсокартона.

## Стилизация компонента

### 1. Цветовая схема
Для обеспечения визуальной согласованности с остальной частью приложения рекомендуется использовать следующую цветовую схему:

```css
/* src/components/pages/planingPage/components/DrywallGanttChart.css */
:root {
  --gantt-primary-color: #007bff;
  --gantt-secondary-color: #6c757d;
  --gantt-success-color: #28a745;
  --gantt-danger-color: #dc3545;
  --gantt-warning-color: #ffc107;
  --gantt-info-color: #17a2b8;
  --gantt-light-color: #f8f9fa;
  --gantt-dark-color: #343a40;
}

.gantt-container {
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.gantt-header {
  background-color: var(--gantt-light-color);
  border-bottom: 1px solid #dee2e6;
  padding: 1rem;
}

.gantt-chart-area {
  padding: 1rem;
  min-height: 400px;
  overflow: auto;
}
```

### 2. Типографика
Использование стандартной типографики Bootstrap для согласованности:

```css
.gantt-title {
  font-size: 1.25rem;
  font-weight: 500;
  color: var(--gantt-dark-color);
}

.gantt-task-label {
  font-size: 0.875rem;
  font-weight: 400;
}

.gantt-axis-label {
  font-size: 0.75rem;
  color: var(--gantt-secondary-color);
}
```

### 3. Адаптивность
Реализация адаптивного дизайна для различных устройств:

```css
@media (max-width: 768px) {
  .gantt-container {
    font-size: 0.875rem;
  }
  
  .gantt-title {
    font-size: 1rem;
  }
  
  .gantt-chart-area {
    padding: 0.5rem;
    min-height: 300px;
  }
}

@media (max-width: 576px) {
  .gantt-container {
    border-left: none;
    border-right: none;
    border-radius: 0;
  }
  
  .gantt-chart-area {
    min-height: 250px;
  }
}
```

## Улучшения пользовательского опыта (UX)

### 1. Интерактивность
Добавление интерактивных элементов для улучшения UX:

```typescript
// В компоненте DrywallGanttChart.tsx
const handleTaskClick = (task: Task) => {
  // Отображение модального окна с детальной информацией о задаче
  setShowTaskDetails(task);
};

const handleDateRangeChange = (start: Date, end: Date) => {
  // Обновление отображаемого диапазона дат
  setDateRange({ start, end });
};

const handleViewModeChange = (mode: ViewMode) => {
  // Изменение режима отображения (День, Неделя, Месяц)
  setViewMode(mode);
};
```

### 2. Визуальная обратная связь
Добавление визуальных индикаторов для улучшения понимания:

```css
.gantt-task {
  transition: all 0.2s ease-in-out;
}

.gantt-task:hover {
  transform: scale(1.02);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.gantt-task-critical {
  border-left: 3px solid var(--gantt-danger-color);
}

.gantt-task-completed {
  opacity: 0.7;
}
```

### 3. Управление масштабом
Реализация управления масштабом диаграммы:

```typescript
// В компоненте DrywallGanttChart.tsx
const handleZoomIn = () => {
  setZoomLevel(prev => Math.min(prev + 1, 5));
};

const handleZoomOut = () => {
  setZoomLevel(prev => Math.max(prev - 1, 1));
};

// Применение уровня масштабирования к диаграмме
useEffect(() => {
  const ganttElement = document.querySelector('.gantt-chart');
  if (ganttElement) {
    ganttElement.style.transform = `scale(${zoomLevel})`;
  }
}, [zoomLevel]);
```

### 4. Фильтрация и сортировка
Добавление возможностей фильтрации и сортировки:

```typescript
interface FilterOptions {
  boardType: string | null;
  dateRange: { start: Date | null; end: Date | null };
  minQuantity: number | null;
  maxQuantity: number | null;
}

const applyFilters = (items: DrywallItem[], filters: FilterOptions): DrywallItem[] => {
  return items.filter(item => {
    // Фильтрация по типу гипсокартона
    if (filters.boardType && item.gypsumBoard.boardType.name !== filters.boardType) {
      return false;
    }
    
    // Фильтрация по диапазону дат
    if (filters.dateRange.start && item.startProduction < filters.dateRange.start) {
      return false;
    }
    
    if (filters.dateRange.end && item.endProduction > filters.dateRange.end) {
      return false;
    }
    
    // Фильтрация по количеству
    if (filters.minQuantity !== null && item.quantity < filters.minQuantity) {
      return false;
    }
    
    if (filters.maxQuantity !== null && item.quantity > filters.maxQuantity) {
      return false;
    }
    
    return true;
  });
};
```

### 5. Поиск
Реализация поиска по элементам диаграммы:

```typescript
const handleSearch = (query: string) => {
  if (!query) {
    setFilteredTasks(tasks);
    return;
  }
  
  const filtered = tasks.filter(task => 
    task.name.toLowerCase().includes(query.toLowerCase()) ||
    task.id.includes(query)
  );
  
  setFilteredTasks(filtered);
};
```

## Доступность (Accessibility)

### 1. Поддержка клавиатуры
Обеспечение навигации с помощью клавиатуры:

```typescript
const handleKeyDown = (event: React.KeyboardEvent, task: Task) => {
  switch (event.key) {
    case 'Enter':
    case ' ':
      handleTaskClick(task);
      break;
    case 'ArrowRight':
      // Навигация к следующей задаче
      break;
    case 'ArrowLeft':
      // Навигация к предыдущей задаче
      break;
  }
};
```

### 2. ARIA атрибуты
Добавление ARIA атрибутов для улучшения доступности:

```tsx
<div 
  role="button"
  tabIndex={0}
  aria-label={`Задача: ${task.name}, с ${task.start} по ${task.end}`}
  aria-describedby="task-description"
  onKeyDown={(e) => handleKeyDown(e, task)}
  onClick={() => handleTaskClick(task)}
>
  {task.name}
</div>
```

### 3. Контрастность цветов
Обеспечение достаточного контраста для пользователей с нарушениями зрения:

```css
.gantt-task-text {
  color: #ffffff; /* Высокий контраст для темных фона */
}

.gantt-task-text-dark {
  color: #000000; /* Высокий контраст для светлых фона */
}
```

## Производительность

### 1. Виртуализация
Для улучшения производительности при большом количестве элементов:

```typescript
// Использование библиотеки react-window для виртуализации
import { FixedSizeList as List } from 'react-window';

const VirtualizedGantt = ({ tasks }: { tasks: Task[] }) => {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style}>
      <GanttTask task={tasks[index]} />
    </div>
  );

  return (
    <List
      height={400}
      itemCount={tasks.length}
      itemSize={50}
      width="100%"
    >
      {Row}
    </List>
  );
};
```

### 2. Ленивая загрузка
Загрузка данных по мере необходимости:

```typescript
const [visibleTasks, setVisibleTasks] = useState<Task[]>([]);
const [loadedTasksCount, setLoadedTasksCount] = useState(50);

const loadMoreTasks = () => {
  const nextBatch = allTasks.slice(loadedTasksCount, loadedTasksCount + 50);
  setVisibleTasks(prev => [...prev, ...nextBatch]);
  setLoadedTasksCount(prev => prev + 50);
};
```

## Интеграция с другими компонентами

### 1. Синхронизация с таблицей
Обеспечение синхронизации между диаграммой и таблицей:

```typescript
// В PlaningPage.tsx
const handleTaskSelect = (taskId: string) => {
  // Выделение соответствующей строки в таблице
  setSelectedTaskId(taskId);
};

const handleTableRowSelect = (item: DrywallItem) => {
  // Выделение соответствующей задачи на диаграмме
  setSelectedTaskId(item.id.toString());
};
```

### 2. Общие элементы управления
Использование общих элементов управления для согласованности:

```tsx
<div className="d-flex justify-content-between align-items-center mb-3">
  <PeriodSelector 
    period={period} 
    onPeriodChange={onPeriodChange} 
  />
  <div className="d-flex gap-2">
    <Button 
      variant="outline-secondary" 
      onClick={handleZoomIn}
      aria-label="Увеличить"
    >
      <i className="bi bi-zoom-in"></i>
    </Button>
    <Button 
      variant="outline-secondary" 
      onClick={handleZoomOut}
      aria-label="Уменьшить"
    >
      <i className="bi bi-zoom-out"></i>
    </Button>
  </div>
</div>
```

## Рекомендации по дальнейшему улучшению

### 1. Анимации и переходы
Добавление плавных анимаций для улучшения восприятия:

```css
.gantt-transition {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### 2. Темная тема
Реализация поддержки темной темы:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --gantt-primary-color: #0d6efd;
    --gantt-light-color: #212529;
    --gantt-dark-color: #f8f9fa;
  }
  
  .gantt-container {
    border-color: #495057;
  }
}
```

### 3. Экспорт данных
Добавление возможности экспорта диаграммы:

```typescript
const handleExport = () => {
  // Экспорт в PNG, PDF или другие форматы
  // Можно использовать библиотеки типа html2canvas или jsPDF
};
```

## Заключение

Эти рекомендации по стилизации и улучшению UX помогут создать современный, удобный и доступный компонент диаграммы Ганта для страницы планирования производства гипсокартона. Реализация этих улучшений значительно повысит удовлетворенность пользователей и общее качество интерфейса приложения.