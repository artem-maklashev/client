import { useEffect, useState } from "react";
import { ButtonGroup, Card, ToggleButton, Spinner } from "react-bootstrap";
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
    
    // Раскомментировали ваш кастомный хук!
    const { productConsumptions, isLoadingConsumption } = useBoardConsumption(ids, 5);

    // 1. Установка дня по умолчанию
    useEffect(() => {
        if (lastThreeDays.length > 0) {
            setSelectedDay(lastThreeDays[0].toLocaleDateString("ru-RU"));
        }
    }, [lastThreeDays]);

    // 2. Безопасное обновление ID на основе выбранного дня
    useEffect(() => {
        if (selectedDay && productionDict[selectedDay]) {
            // Безопасно проверяем длину и устанавливаем значения
            if (productionDict[selectedDay].length > 0) {
                setIds(productionDict[selectedDay]);
            } else {
                setIds([]); // Если пустой массив
            }
        } else {
            setIds([]); // Если ключа вообще нет в словаре
        }
    }, [selectedDay, productionDict]);

    return (
        <Card className="p-4 shadow-sm border-0 rounded-4 bg-white mt-4">
            <h5 className="mb-4 fw-bold text-dark">
                Данные по расходу материалов, требующие внимания
            </h5>
            
            {lastThreeDays.length > 0 ? (
                <>
                    <ButtonGroup className="mb-4">
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

                    <div className="p-3 bg-light rounded-3 mb-3 d-inline-block">
                        <span className="text-muted fw-medium me-2">Количество партий производства:</span>
                        <strong className="text-dark fs-5">{ids.length}</strong>
                        <p>ids: {ids.join(", ")}</p>
                    </div>

                    {/* Вывод результата от React Query */}
                    <div className="mt-2">
                        {isLoadingConsumption ? (
                            <div className="d-flex align-items-center gap-2 text-primary">
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