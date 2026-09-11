import { useEffect, useState } from "react";
import { ButtonGroup, Card, ToggleButton, Spinner, Form, Col, Row } from "react-bootstrap";
import { useBoardConsumption } from "./service/useBoardConsumption";
import { ConsumptionTreeView } from "./ConsumptionTreeView";
import { useDelays } from "../boardProductionInput/delayComponents/useDelays";
import { DelaysTreeView } from "../delaysElements/DelaysTreeView";

interface ConsumptionDataProps {
    startDate: Date;
    endDate: Date;
    lastThreeDays?: Date[];
    productionDict?: Record<string, number[]>;
}

export const ConsumptionData: React.FC<ConsumptionDataProps> = ({
    startDate,
    endDate,
    lastThreeDays = [],
    productionDict = {}
}) => {

    // Храним выбранный день как Date, чтобы корректно передавать его в useDelays.
    // Строку формата "ДД.ММ.ГГГГ" используем только как ключ для productionDict.
    const [selectedDay, setSelectedDay] = useState<Date | null>(lastThreeDays[0] ?? null);
    const [ids, setIds] = useState<number[]>([]);

    const [difference, setDifference] = useState<number>(10);

    // 2. Передаем состояние difference в хук вместо жестко заданного числа
    const { productConsumptions, isLoadingConsumption } = useBoardConsumption(ids, difference);
    // Пока день не выбран — используем запасную валидную дату,
    // чтобы запрос простоев не падал и не уходил за «сегодня».
    const delayDate = selectedDay ?? lastThreeDays[0] ?? new Date();
    const { delays, isLoadingDelays, errorDelays } = useDelays(delayDate, delayDate);

    // Установка дня по умолчанию
    useEffect(() => {
        if (lastThreeDays.length > 0) {
            setSelectedDay(lastThreeDays[0]);
        }
    }, [lastThreeDays]);

    // Безопасное обновление ID на основе выбранного дня
    useEffect(() => {
        const dayKey = selectedDay ? selectedDay.toLocaleDateString("ru-RU") : "";
        const listForDay = dayKey ? productionDict[dayKey] : undefined;
        if (listForDay && listForDay.length > 0) {
            setIds(listForDay);
        } else {
            setIds([]);
        }
    }, [selectedDay, productionDict]);

    return (
        <Card className="border-0 shadow-sm rounded-4 overflow-hidden"
            style={{ backgroundColor: '#fffbf48f' }}>
            <Card.Header
                className="border-bottom-0  pb-2 px-4 d-flex justify-content-between align-items-center flex-wrap gap-2 fw-semibold text-dark"
                style={{ backgroundColor: '#6968688f' }}
            >

                Данные по расходу и простоям

            </Card.Header>
            {lastThreeDays.length > 0 ? (
                <div className="p-3">
                    {/* Панель управления: выбор даты и настройка отклонения */}
                    <Row className="align-items-center mb-4 gy-3">
                        <Col xs={12} lg={7}>
                            <ButtonGroup className="w-100 shadow-sm">
                                {lastThreeDays.map((day, index) => {
                                    const dayValue = day.toLocaleDateString("ru-RU");
                                    const isActive = selectedDay?.toLocaleDateString("ru-RU") === dayValue;
                                    return (
                                        <ToggleButton
                                            key={index}
                                            id={`day-${index}`}
                                            type="radio"
                                            variant={isActive ? "primary" : "outline-primary"}
                                            name="day"
                                            value={dayValue}
                                            checked={isActive}
                                            onChange={() => setSelectedDay(day)}
                                        >
                                            {day.toLocaleDateString("ru-RU", { day: 'numeric', month: 'long' })}
                                        </ToggleButton>
                                    );
                                })}
                            </ButtonGroup>
                        </Col>

                        <Col xs={12} lg={5}>
                            <Form.Group className="mb-0">
                                <Form.Label className="fw-semibold text-dark small d-flex justify-content-between align-items-center mb-1">
                                    <span>Допустимое отклонение</span>
                                    <span className="badge bg-primary rounded-pill">
                                        {difference}%
                                    </span>
                                </Form.Label>
                                <Form.Range
                                    min={0}
                                    max={50}
                                    step={1}
                                    value={difference}
                                    onChange={(e) => setDifference(Number(e.target.value))}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* Сетка с деревьями: начинаются строго на одном уровне */}
                    <Row className="g-4">
                        {/* Левая колонка: Расход */}
                        <Col xs={12} md={6}>
                            <div
                                className="border rounded-3 p-3 h-100 shadow-sm"
                                style={{ backgroundColor: '#fff9f4' }} // Замените на нужный цвет (например #f4f6f8 или #ffffff)
                            >                                <div className="fw-semibold text-secondary mb-3 pb-2 border-bottom">
                                    Расход материалов
                                </div>
                                {isLoadingConsumption ? (
                                    <div className="d-flex align-items-center gap-2 text-primary my-4">
                                        <Spinner animation="border" size="sm" />
                                        <span>Загрузка данных расхода...</span>
                                    </div>
                                ) : (
                                    <ConsumptionTreeView consumptions={productConsumptions} />
                                )}
                            </div>
                        </Col>

                        {/* Правая колонка: Простои */}
                        <Col xs={12} md={6}>
                            <div
                                className="border rounded-3 p-3 h-100 shadow-sm"
                                style={{ backgroundColor: '#fff9f4' }} // Замените на нужный цвет (например #f4f6f8 или #ffffff)
                            >
                                <div className="fw-semibold text-secondary mb-3 pb-2 border-bottom">

                                    Журнал простоев
                                </div>
                                {isLoadingDelays ? (
                                    <div className="d-flex align-items-center gap-2 text-primary my-4">
                                        <Spinner animation="border" size="sm" />
                                        <span>Загрузка данных о простоях...</span>
                                    </div>
                                ) : errorDelays ? (
                                    <div className="text-danger my-4">Не удалось загрузить данные о простоях.</div>
                                ) : delays && delays.length > 0 ? (
                                    <DelaysTreeView delays={delays} />
                                ) : (
                                    <div className="text-muted my-4">Данные о простоях отсутствуют.</div>
                                )}
                            </div>
                        </Col>
                    </Row>
                </div>
            ) : (
                <div className="p-4">
                    <p className="text-muted fst-italic mb-0">Нет данных для отображения за выбранный период.</p>
                </div>
            )}
        </Card>
    );
};