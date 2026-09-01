import { useEffect, useState } from "react";
import { ButtonGroup, Card, ToggleButton, Spinner, Form } from "react-bootstrap";
import { useBoardConsumption } from "./service/useBoardConsumption";
import { ConsumptionTreeView } from "./ConsumptionTreeView";

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
    
    const [selectedDay, setSelectedDay] = useState<string>("");
    const [ids, setIds] = useState<number[]>([]);
    
    // 1. Добавляем состояние для ползунка. По умолчанию ставим 5 (как было в вашем хуке)
    const [difference, setDifference] = useState<number>(5);
    
    // 2. Передаем состояние difference в хук вместо жестко заданного числа
    const { productConsumptions, isLoadingConsumption } = useBoardConsumption(ids, difference);

    // Установка дня по умолчанию
    useEffect(() => {
        if (lastThreeDays.length > 0) {
            setSelectedDay(lastThreeDays[0].toLocaleDateString("ru-RU"));
        }
    }, [lastThreeDays]);

    // Безопасное обновление ID на основе выбранного дня
    useEffect(() => {
        if (selectedDay && productionDict[selectedDay]) {
            if (productionDict[selectedDay].length > 0) {
                setIds(productionDict[selectedDay]);
            } else {
                setIds([]);
            }
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
                
                    Данные по расходу материалов, требующие внимания
               
            </Card.Header>
            {lastThreeDays.length > 0 ? (
                <>
                    <ButtonGroup className={`mb-4 mt-2 shadow-sm ${lastThreeDays.length > 1 ? 'w-100' : '50'}`}>
                        {lastThreeDays.map((day, index) => {
                            const dayValue = day.toLocaleDateString("ru-RU");
                            return (
                                <ToggleButton 
                                    key={index}
                                    id={`day-${index}`}
                                    type="radio"
                                    variant={selectedDay === dayValue ? "primary" : "outline-primary"}
                                    name="day"
                                    value={dayValue}
                                    checked={selectedDay === dayValue}
                                    onChange={(e) => setSelectedDay(e.currentTarget.value)}
                                    className="shadow-sm"
                                >
                                    {day.toLocaleDateString("ru-RU", { day: 'numeric', month: 'long' })}
                                </ToggleButton>
                            );
                        })}
                    </ButtonGroup>

                    {/* 3. Обернули Range в Form.Group для отступов и добавили обработчик */}
                    <Form.Group className="mb-4 w-50 mx-auto">
                        <Form.Label className="fw-bold text-dark d-flex justify-content-between align-items-center">
                            <span>Допустимое отклонение</span>
                            {/* Красиво показываем текущее выбранное значение */}
                            <span className="badge bg-primary rounded-pill fs-6">
                                {difference}%
                            </span>
                        </Form.Label>
                        <Form.Range 
                            min={0} 
                            max={50} 
                            step={1} // Изменил step на 1 для более плавной настройки, но можно вернуть 5
                            value={difference}
                            onChange={(e) => setDifference(Number(e.target.value))}
                        />
                    </Form.Group>

                    {/* Вывод результата от React Query */}
                    <div className="mt-2 px-2 pb-2">
                        {isLoadingConsumption ? (
                            <div className="d-flex align-items-center gap-2 text-primary my-4">
                                <Spinner animation="border" size="sm" />
                                <span>Загрузка данных расхода...</span>
                            </div>
                        ) : (
                            <ConsumptionTreeView consumptions={productConsumptions} />
                        )}
                    </div>
                </>
            ) : (
                <p className="text-muted fst-italic">Нет данных для отображения за выбранный период.</p>
            )}
        </Card>
    );
};