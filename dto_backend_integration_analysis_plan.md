# Анализ DTO для нормального взаимодействия frontend ↔ backend

Я отвечу как архитектор enterprise frontend/backend интеграций с опытом проектирования DTO-контрактов для React + Spring Boot систем.

## Общая проблема текущей архитектуры

Сейчас frontend использует domain-model классы одновременно:

- как UI model
- как transport model
- как request body
- как response body
- как state model

Это видно по:

- прямой отправке классов в `api.post/put`
- использованию nested entity объектов в запросах
- отсутствию явных request/response DTO
- использованию `any`
- отсутствию mapper слоя
- смешению бизнес-моделей и transport-моделей

Примеры:

```ts
api.post(`${this.baseUrl}/boardProductionsByGypsumBoard`, requestBody);
```

```ts
api.put(`${this.baseUrl}/production/saveProduction`, production)
```

```ts
api.post(`${this.baseUrl}/specifications/getSpecificationByProduct`, product)
```

Это создаёт проблемы:

- жёсткая связность frontend ↔ backend
- сложные сериализации Date
- циклические вложенности
- избыточные payload
- проблемы versioning API
- невозможность независимо менять backend entity
- сложность тестирования
- дублирование данных
- отсутствие контрактов API

---

# Главная рекомендация

Нужно разделить:

1. Domain models
2. API DTO
3. Request DTO
4. Response DTO
5. Mapper layer

Структура должна выглядеть так:

```text
src/
 ├── api/
 │    ├── dto/
 │    │    ├── request/
 │    │    ├── response/
 │    │    └── common/
 │    ├── mapper/
 │    └── client/
 │
 ├── domain/
 │    └── models/
 │
 └── service/
```

---

# DTO, которые необходимо создать

# 1. Общие DTO

## Файл

```text
src/api/dto/common/DateRangeRequestDTO.ts
```

## Назначение

Для всех запросов диапазонов дат.

## Сейчас используется в

- fetchPlan
- fetchBoardProduction
- fetchDelaysData
- getProductionByDateBeetvean
- getPlanByDateBeetvean

## DTO

```ts
export interface DateRangeRequestDTO {
    startDate: string;
    endDate: string;
}
```

---

## Файл

```text
src/api/dto/common/IdDTO.ts
```

## DTO

```ts
export interface IdDTO {
    id: number;
}
```

---

# 2. План производства гипсокартона

## Сейчас проблема

Frontend отправляет и получает полноценный `Plan` + `GypsumBoard`.

Это перегружает API.

---

## Файл

```text
src/api/dto/gypsumboard/request/PlanRequestDTO.ts
```

## DTO

```ts
export interface PlanRequestDTO {
    gypsumBoardId: number;
    planDate: string;
    planValue: number;
}
```

---

## Файл

```text
src/api/dto/gypsumboard/response/PlanResponseDTO.ts
```

## DTO

```ts
export interface PlanResponseDTO {
    id: number;
    planDate: string;
    planValue: number;
    gypsumBoardId: number;
    gypsumBoardName: string;
}
```

---

# 3. Производство гипсокартона

## Главная проблема

`BoardProduction` содержит:

- ProductionList
- GypsumBoard
- GypsumBoardCategory

Это тяжёлый nested object.

---

## Файл

```text
src/api/dto/gypsumboard/request/BoardProductionFilterDTO.ts
```

## DTO

```ts
export interface BoardProductionFilterDTO {
    gypsumBoardIds: number[];
    startDate: string;
    endDate: string;
}
```

Заменяет:

```ts
{
   gypsumBoards,
   startDate,
   endDate
}
```

---

## Файл

```text
src/api/dto/gypsumboard/request/SaveBoardProductionDTO.ts
```

## DTO

```ts
export interface SaveBoardProductionDTO {
    productionListId: number;
    gypsumBoardId: number;
    categoryId: number;
    value: number;
}
```

---

## Файл

```text
src/api/dto/gypsumboard/response/BoardProductionResponseDTO.ts
```

## DTO

```ts
export interface BoardProductionResponseDTO {
    id: number;
    productionDate: string;
    shiftName: string;
    gypsumBoardId: number;
    gypsumBoardName: string;
    categoryId: number;
    categoryName: string;
    value: number;
}
```

---

# 4. Спецификации и материалы

## Сейчас проблема

В запрос отправляется целый `GypsumBoard`.

---

## Файл

```text
src/api/dto/specification/request/GetSpecificationDTO.ts
```

## DTO

```ts
export interface GetSpecificationDTO {
    gypsumBoardId: number;
}
```

---

## Файл

```text
src/api/dto/specification/request/ConsumptionRequestDTO.ts
```

## DTO

```ts
export interface ConsumptionRequestDTO {
    productionIds: number[];
}
```

---

## Файл

```text
src/api/dto/specification/response/MaterialConsumptionResponseDTO.ts
```

## DTO

```ts
export interface MaterialConsumptionResponseDTO {
    materialId: number;
    materialName: string;
    quantity: number;
    unit: string;
}
```

---

# 5. Простои (Delays)

## Сейчас проблема

Судя по структуре:

```text
model/delays
model/mix/delays
```

простои сильно завязаны на entity.

---

## Файл

```text
src/api/dto/delays/request/DelayFilterDTO.ts
```

## DTO

```ts
export interface DelayFilterDTO {
    startDate: string;
    endDate: string;
    productionAreaId?: number;
    unitId?: number;
}
```

---

## Файл

```text
src/api/dto/delays/response/DelayResponseDTO.ts
```

## DTO

```ts
export interface DelayResponseDTO {
    id: number;
    delayType: string;
    productionArea: string;
    unit: string;
    durationMinutes: number;
    delayDate: string;
}
```

---

## Файл

```text
src/api/dto/delays/response/DelaysByTypeResponseDTO.ts
```

## DTO

```ts
export interface DelaysByTypeResponseDTO {
    delayType: string;
    totalMinutes: number;
    count: number;
}
```

---

# 6. DryMix / смеси

## Сейчас проблема

`MixProduction` отправляется полностью.

Внутри:

- Shift
- DryMix
- Dates
- nested entity

---

## Файл

```text
src/api/dto/mix/request/SaveMixProductionDTO.ts
```

## DTO

```ts
export interface SaveMixProductionDTO {
    mixId: number;
    shiftId: number;
    productionDate: string;
    productionStart: string;
    productionFinish: string;
}
```

---

## Файл

```text
src/api/dto/mix/request/SaveMixPlanDTO.ts
```

## DTO

```ts
export interface SaveMixPlanDTO {
    mixId: number;
    planDate: string;
    quantity: number;
}
```

---

## Файл

```text
src/api/dto/mix/response/MixProductionResponseDTO.ts
```

## DTO

```ts
export interface MixProductionResponseDTO {
    id: number;
    mixId: number;
    mixName: string;
    shiftId: number;
    shiftName: string;
    productionDate: string;
    productionStart: string;
    productionFinish: string;
}
```

---

## Файл

```text
src/api/dto/mix/response/MixPlanResponseDTO.ts
```

## DTO

```ts
export interface MixPlanResponseDTO {
    id: number;
    mixId: number;
    mixName: string;
    planDate: string;
    quantity: number;
}
```

---

# 7. Lookup DTO

Очень желательно отделить lookup/spravochnik модели.

---

## Файл

```text
src/api/dto/common/LookupDTO.ts
```

## DTO

```ts
export interface LookupDTO {
    id: number;
    name: string;
}
```

Использовать для:

- Thickness
- Width
- Edge
- MixCategory
- DelayType
- Unit
- Division
- Material

---

# 8. DTO для ошибок

## Файл

```text
src/api/dto/common/ApiErrorDTO.ts
```

## DTO

```ts
export interface ApiErrorDTO {
    timestamp: string;
    status: number;
    error: string;
    message: string;
    path: string;
}
```

---

# 9. Pagination DTO

Если объёмы данных вырастут — понадобится pagination.

## Файл

```text
src/api/dto/common/PageResponseDTO.ts
```

## DTO

```ts
export interface PageResponseDTO<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    page: number;
    size: number;
}
```

---

# DTO, которые уже выглядят правильно

## Уже есть

```text
src/model/DTO/gypsumboard/delays/DelaysByTypeDTO.ts
```

Но его лучше перенести:

```text
src/api/dto/delays/response/
```

---

# Что нужно удалить из API слоя

# Не отправлять напрямую

```ts
GypsumBoard
MixProduction
BoardProduction
Specification
Plan
ProductionList
DryMix
```

как body запросов.

---

# Что нужно добавить обязательно

# 1. Mapper слой

## Структура

```text
src/api/mapper/
```

---

## Файлы

```text
PlanMapper.ts
BoardProductionMapper.ts
MixMapper.ts
DelayMapper.ts
SpecificationMapper.ts
```

---

## Пример

```ts
export class PlanMapper {
   static toRequest(model: Plan): PlanRequestDTO
   static fromResponse(dto: PlanResponseDTO): Plan
}
```

---

# 2. Typed API client

## Сейчас

```ts
response.data
```

без типизации.

---

## Нужно

```ts
const response = await api.get<PlanResponseDTO[]>()
```

---

# 3. Разделить API сервисы

## Сейчас

`ApiService.ts` перегружен.

---

## Нужно

```text
src/api/client/
    boardApi.ts
    mixApi.ts
    delayApi.ts
    specificationApi.ts
```

---

# Самые критичные проблемы сейчас

# 1. Передача entity целиком

Например:

```ts
fetchSpecification(product: GypsumBoard)
```

Нужно:

```ts
fetchSpecification(dto: GetSpecificationDTO)
```

---

# 2. Date handling

Сейчас даты:

- formatDateToISO
- removeTimeZone
- dayjs.utc.local

размазаны по проекту.

Нужен единый:

```text
src/api/utils/dateMapper.ts
```

---

# 3. Отсутствие response contracts

Сейчас backend может поменять поле — frontend silently сломается.

DTO решают это.

---

# 4. Смешение UI модели и API модели

Например:

```ts
GypsumBoard
```

используется:

- в UI
- в state
- в таблицах
- в API
- в nested entity

Это нужно разделить.

---

# Рекомендуемый план работ

# Этап 1 — инфраструктура DTO

## Сделать

- создать `src/api/dto`
- создать request/response/common
- создать mapper layer
- типизировать axios

## Результат

Появится стабильный API контракт.

---

# Этап 2 — даты и базовые запросы

## Переделать

- DateRangeRequestDTO
- dateMapper
- все date query params

## Результат

Уйдут timezone проблемы.

---

# Этап 3 — гипсокартон

## Переделать

- Plan API
- BoardProduction API
- Specification API

## Результат

Снизится размер payload.

---

# Этап 4 — смеси

## Переделать

- MixPlan
- MixProduction
- Delay API

---

# Этап 5 — lookup/spravochnik API

## Унифицировать

- categories
- thickness
- materials
- units

через `LookupDTO`.

---

# Этап 6 — cleanup

## Удалить

- прямые entity body
- any
- лишние nested модели
- date hacks

---

# Приоритет внедрения

## Критично

1. Request/Response DTO
2. Mapper layer
3. Date handling
4. Typed API

---

## Средний приоритет

1. Pagination
2. Error DTO
3. Lookup DTO

---

## Низкий приоритет

1. Generic API client
2. Runtime validation
3. OpenAPI generation

---

# Что получится после рефакторинга

## Плюсы

- стабильный контракт frontend/backend
- backend entity можно менять независимо
- меньше payload
- меньше багов сериализации
- проще тестировать
- проще писать новые API
- легче перейти на OpenAPI generation
- проще масштабировать проект
- типобезопасность
- меньше any

---

# Архитектура, к которой стоит прийти

```text
UI
 ↓
ViewModel
 ↓
Mapper
 ↓
Request DTO
 ↓
API
 ↓
Response DTO
 ↓
Mapper
 ↓
Domain Model
```

Это будет уже production-grade архитектура для enterprise React + Spring Boot проекта.

