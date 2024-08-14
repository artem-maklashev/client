import React from "react";
import { Card, Col } from "react-bootstrap";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Plan from "../../../model/gypsumBoard/Plan";
import BoardProduction from "../../../model/production/BoardProduction";

interface PlanFactChartProps {
    planData: Plan[];
    productionData: BoardProduction[];
}

interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{ payload: any }>;  // Упрощено для обработки различных типов данных
}

interface CombinedData {
    planDate: string;
    planValue: number;
    productionValue: number;
}

const PlanFactChart: React.FC<PlanFactChartProps> = ({ planData, productionData }) => {
    console.log("Данные по производству: " + productionData?.length);
    console.log((productionData[0]?.productionList.productionDate));
    console.log(planData[0]?.planDate);
    const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
        if (active && payload && payload.length) {
            // Убедитесь, что данные корректно обрабатываются
            const { planDate, planValue, productionValue } = payload[0]?.payload || {};
            return (
                <div className="custom-tooltip" style={{ background: 'white' }}>
                    <p className="label">{`Дата: ${planDate}`}</p>
                    <p className="label">{`План: ${planValue}`}</p>
                    <p className="intro">{`Факт: ${productionValue.toFixed(0)}`}</p>
                    <p className="desc">{`Отклонение: ${(productionValue - planValue).toFixed(0)}`}</p>
                </div>
            );
        }

        return null;
    };

    const combinedData: CombinedData[] = planData.reduce((acc: CombinedData[], plan: Plan) => {
        // Преобразуем planDate в строку формата YYYY-MM-DD для сравнения
        const planDateStr = new Date(plan.planDate).toISOString().split('T')[0];

        // Ищем в аккумуляторе запись с данной датой
        const existingEntry = acc.find(entry => entry.planDate === planDateStr);

        // Если запись найдена, обновляем значения
        if (existingEntry) {
            existingEntry.planValue += plan.planValue; // Суммируем плановые значения
        } else {
            // Если записи с такой датой нет, создаем новую
            acc.push({
                planDate: planDateStr,
                planValue: plan.planValue,
                productionValue: 0 // Изначально значение производства равно 0
            });
        }

        return acc;
    }, []);

    // Теперь суммируем значения производства для каждой даты
    combinedData.forEach(entry => {
        const productionValues = productionData
            .filter((prod: BoardProduction) => {

                const prodDate = new Date(prod.productionList.productionDate);
                prodDate.setDate(prodDate.getDate() + 1);//TODO типы возвращаемых дат не сходятся
                const prodDateStr = prodDate.toISOString().split('T')[0];
                return prodDateStr === entry.planDate;
            })
            .map((prod: BoardProduction) => prod.value);

        // Суммируем значения производства и обновляем запись
        entry.productionValue = productionValues.reduce((acc: number, value: number) => acc + value, 0);
    });

    
    // Функция для форматирования подписи в легенде
    const legendFormatter = (value: string) => {
        switch (value) {
            case 'planValue':
                return 'Плановое значение';
            case 'productionValue':
                return 'Фактическое производство';
            default:
                return value;
        }
    };

    return (

        <Card className="mt-lg-5 text-center bg-body-primary">
            <Card.Header><h5>План-факт производства</h5></Card.Header>
            <Card.Body>
                <Col className="col-12 " style={{ width: '100%', height: '300px' }}>
                    <ResponsiveContainer>
                        <LineChart
                            title="План-факт производства"
                            width={500}
                            height={300}
                            data={combinedData}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="planDate" />
                            <YAxis />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend formatter={legendFormatter}/>
                            <Line type="monotone" dataKey="planValue" stroke="#8884d8" activeDot={{ r: 8 }} strokeWidth={3} />
                            <Line type="monotone" dataKey="productionValue" stroke="#FF1493" activeDot={{ r: 8 }} strokeWidth={3}/>
                            {/* Примечание: Строка `Line` ниже закомментирована, но может быть использована */}
                        </LineChart>
                    </ResponsiveContainer>
                </Col>
            </Card.Body>
            {/* <Card.Footer>План на месяц: {planData.reduce((acc, plan) => acc + plan.planValue,0)} м²</Card.Footer> */}
        </Card>
    );
};

export default PlanFactChart;
