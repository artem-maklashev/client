import { FC, useEffect, useState } from "react";
import MixCategoryProduction from "../../../../model/mix/prodution/MixCategoryProduction";
import { Card, Col,  } from "react-bootstrap";
import React from "react";
import { Tooltip, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { addDays } from "date-fns";
import MixPlan from "../../../../model/mix/plan";

interface MixPlanFactProps {
    mixProduction: MixCategoryProduction[];
    mixPlan: MixPlan[];
}

interface PlanFactChartProps {
    planData: MixPlan[];
    productionData: MixCategoryProduction[];
    allProductionData: MixCategoryProduction[];
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

interface LineChartPayload {
    payload: {
        [key: string]: string | number; // Замените any на конкретные типы данных, если они известны
    };
}
const PlanFact: FC<MixPlanFactProps> = ({ mixProduction, mixPlan }) => {

    const [modalPlan, setModalPlan] = React.useState<MixPlan[]>([]);
    const [modalFact, setModalFact] = useState<MixCategoryProduction[]>([]);
    const [modalDate, setModalDate] = useState<string>('');
    const [showModal, setShowModal] = useState<boolean>(false);
    const [combinedData, setCombinedData] = useState<CombinedData[]>([]);


    const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
        if (active && payload && payload.length) {
            // Убедитесь, что данные корректно обрабатываются
            const { planDate, planValue, productionValue } = payload[0]?.payload || {};
            return (
                <div className="custom-tooltip" style={{ background: 'transparent ' }}>
                    <strong>
                        <p className="label">{`Дата: ${planDate}`}</p>
                        <p className="label">{`План: ${planValue}`}</p>
                        <p className="intro">{`Факт: ${productionValue.toFixed(0)}`}</p>
                        <p className="desc">{`Отклонение: ${(productionValue - planValue).toFixed(0)}`}</p>
                        
                    </strong>
                </div>
            );
        }

        return null;
    };

    const legendFormatter = (value: string) => {
        switch (value) {
            case 'planValue':
                return 'Плановое значение';
            case 'productionValue':
                return 'Фактическое производство';
            case 'defectPercent':
                return 'Процент брака'
            default:
                return value;
        }
    };

    useEffect(() => {
        if (mixProduction.length > 0 && mixPlan.length > 0) {
            const draftCombinedData = mixProduction
                .filter((prod) => prod.category.id > 1 && prod.category.id < 4)
                .map((prod: MixCategoryProduction) => {
                    const plan = mixPlan.find((plan) =>
                        new Date(plan.planDate).toISOString().split('T')[0] === new Date(prod.production.productionDate).toISOString().split('T')[0]);

                    return {
                        planDate: plan ? new Date(plan.planDate).toISOString().split('T')[0] : new Date(prod.production.productionDate).toISOString().split('T')[0],
                        planValue: plan ? plan.value : 0,
                        productionValue: prod.quantity
                    };
                });

            const combinedData: CombinedData[] = [];
            draftCombinedData.forEach((data) => {
                const date = data.planDate;
                const planValue = data.planValue;
                const productionValue = data.productionValue;
                const existingEntry = combinedData.find((entry) => entry.planDate === date);
                if (existingEntry) {
                    existingEntry.planValue += planValue;
                    existingEntry.productionValue += productionValue;
                } else {
                    combinedData.push({
                        planDate: date,
                        planValue: planValue,
                        productionValue: productionValue
                    });
                }

            })
            setCombinedData(combinedData);
        }
    }, [mixProduction, mixPlan]);



    const handleClick = (data: any) => {
        if (data) {
            console.log('Дата:', data.planDate);
            console.log('Плановое значение:', data.planValue);
            const factData = mixProduction.filter((prod) =>
                new Date(addDays(prod.production.productionDate, 1)).toISOString().split('T')[0] === data.planDate
                && prod.category.id > 1
                && prod.category.id < 4);
            const plan = mixPlan.filter((plan) =>
                new Date(plan.planDate).toISOString().split('T')[0] === data.planDate);
            setModalPlan(plan);
            setModalDate(data.planDate);
            setModalFact(factData);
            setShowModal(true);
        } else {
            console.error('Данные не определены');
        }
    };

    return (
        <Card className="text-center bg-body-primary">
            <Card.Header><h5>План-факт производства</h5></Card.Header>
            <Card.Body style={{ overflowX: 'auto' }}>
                <Col className="col-12 " style={{ minWidth: '500px', width: '100%', height: '278px' }}>
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
                            onClick={(data) => handleClick(data?.activePayload?.[0]?.payload)}

                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="planDate" padding={{ left: 30, right: 30 }} />
                            <YAxis yAxisId="left" />
                            <YAxis yAxisId="right" orientation="right" label={{ value: '%', position: 'right' }} domain={[0, 'dataMax + 5']} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend formatter={legendFormatter} />
                            <Line yAxisId="left" type="monotone" dataKey="planValue" stroke="#8884d8" activeDot={{ r: 8, }} strokeWidth={3} />
                            <Line yAxisId="left" type="monotone" dataKey="productionValue" stroke="#FF1493" activeDot={{ r: 8 }} strokeWidth={3} />


                        </LineChart>
                    </ResponsiveContainer>
                </Col>
            </Card.Body>
        </Card>
    );
}
export default PlanFact;