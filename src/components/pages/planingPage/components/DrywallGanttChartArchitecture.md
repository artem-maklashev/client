# Архитектурная диаграмма компонентов для диаграммы Ганта Drywall

## Обзор
Эта диаграмма показывает архитектуру компонентов для реализации диаграммы Ганта в контексте страницы планирования производства гипсокартона.

## Диаграмма компонентов

```mermaid
graph TD
    A[PlaningPage] --> B[DrywallTable]
    A --> C[DrywallGanttChart]
    A --> D[PlaningItemInput]
    A --> E[PeriodSelector]
    
    B --> F[DrywallService]
    B --> G[DataTable]
    
    F --> H[GypsumBoard]
    
    C --> I[Gantt]
    
    D --> F
    
    subgraph "Компоненты страницы планирования"
        A
        B
        C
        D
        E
    end
    
    subgraph "Сервисы и модели"
        F
        H
    end
    
    subgraph "Внешние библиотеки"
        G
        I
    end
    
    style A fill:#FFE4B5,stroke:#333
    style B fill:#E6E6FA,stroke:#333
    style C fill:#E6E6FA,stroke:#333
    style D fill:#E6E6FA,stroke:#333
    style E fill:#E6E6FA,stroke:#333
    style F fill:#98FB98,stroke:#333
    style H fill:#87CEEB,stroke:#333
    style G fill:#FFB6C1,stroke:#333
    style I fill:#FFB6C1,stroke:#333
```

## Описание компонентов

### Основные компоненты страницы планирования
- **PlaningPage** - Основной компонент страницы, координирующий работу всех остальных компонентов
- **DrywallTable** - Компонент для отображения данных в табличном виде
- **DrywallGanttChart** - Компонент для отображения данных в виде диаграммы Ганта
- **PlaningItemInput** - Компонент для ввода новых элементов планирования
- **PeriodSelector** - Компонент для выбора периода отображения данных

### Сервисы и модели
- **DrywallService** - Сервис для работы с данными элементов планирования
- **GypsumBoard** - Модель данных гипсокартона

### Внешние библиотеки
- **DataTable** - Компонент таблицы из библиотеки PrimeReact
- **Gantt** - Компонент диаграммы Ганта из библиотеки frappe-gantt-react

## Потоки данных

1. **PlaningPage** координирует работу всех компонентов и управляет состоянием данных
2. **DrywallTable** и **DrywallGanttChart** получают данные от **PlaningPage**
3. **PlaningItemInput** передает новые данные в **DrywallService**
4. **DrywallService** управляет данными и передает их обратно в **DrywallTable**
5. **DrywallTable** передает обновленные данные в **PlaningPage** через callback
6. **PlaningPage** передает данные в **DrywallGanttChart** для отображения

## Зависимости

```mermaid
graph LR
    A[PlaningPage] --> B[react-bootstrap]
    A --> C[react]
    
    B --> D[DrywallTable]
    B --> E[DrywallGanttChart]
    B --> F[PlaningItemInput]
    B --> G[PeriodSelector]
    
    D --> H[primereact/datatable]
    D --> I[primereact/column]
    D --> J[DrywallService]
    D --> K[PlaningInputItem]
    
    E --> L[frappe-gantt-react]
    E --> J
    
    F --> M[react-bootstrap/Form]
    F --> N[react-bootstrap/Button]
    F --> J
    
    G --> O[react-bootstrap]
    
    J --> P[GypsumBoard]
    J --> Q[ProductTypes]
    J --> R[TradeMark]
    
    subgraph "React компоненты"
        A
        B
        D
        E
        F
        G
        K
    end
    
    subgraph "Внешние библиотеки"
        H
        I
        L
        M
        O
    end
    
    subgraph "Модели данных"
        P
        Q
        R
    end
    
    subgraph "Сервисы"
        J
    end
```

## Расширяемость

Архитектура позволяет легко расширять функциональность:

1. **Добавление новых типов визуализации** - можно добавить дополнительные компоненты диаграмм
2. **Расширение данных** - можно добавить новые поля в модель DrywallItem
3. **Интеграция с другими сервисами** - DrywallService можно расширить для работы с другими источниками данных
4. **Кастомизация внешнего вида** - каждый компонент может быть стилизован независимо

## Точки расширения

1. **DrywallService** - может быть расширен для работы с API или другими источниками данных
2. **DrywallGanttChart** - может быть кастомизирован для отображения дополнительной информации
3. **PlaningPage** - может быть расширена для добавления новых режимов отображения
4. **PlaningItemInput** - может быть расширен для добавления новых полей ввода