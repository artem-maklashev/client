import React, { useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Plan from "../../../model/gypsumBoard/Plan";
import BoardProduction from "../../../model/production/BoardProduction";
import PlanFactModal from "./planFactModal";
import Delays from "../../../model/delays/Delays";
import { addDays } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import ApiService from "../../../service/ApiService";
import MyCard from "../../../service/library/MyCard";

interface PlanFactChartProps {
    planData: Plan[];
    productionData: BoardProduction[];
    allProductionData: BoardProduction[];
}

interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{ payload: any }>;  // Упрощено для обработки различных типов данных
}

interface CombinedData {
    planDate: string;
    planValue: number;
    productionValue: number;
    totalValue: number;
    defectPercent: number;
}

interface LineChartPayload {
    payload: {
        [key: string]: string | number; // Замените any на конкретные типы данных, если они известны
    };
}

const PlanFactChartByMonth: React.FC<PlanFactChartProps> = ({ planData, productionData, allProductionData }) => {

    console.log("Данные по производству: " + productionData?.length);
    console.log((productionData[0]?.productionList.productionDate));
    console.log(planData[0]?.planDate);

    const [showModal, setShowModal] = useState<boolean>(false);
    const [modalPlan, setModalPlan] = useState<Plan[]>([]);
    const [modalFact, setModalFact] = useState<BoardProduction[]>([]);
    const [modalDate, setModalDate] = useState<string>('');
    // const [modalDelays, setModalDelays] = useState<Delays[]>([]);

    const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
        if (active && payload && payload.length) {
            // Убедитесь, что данные корректно обрабатываются
            const { planDate, planValue, productionValue, defectPercent } = payload[0]?.payload || {};
            return (
                <div className="custom-tooltip" style={{ background: 'transparent ' }}>
                    <strong>
                        <p className="label">{`Дата: ${planDate}`}</p>
                        <p className="label">{`План: ${planValue}`}</p>
                        <p className="intro">{`Факт: ${productionValue.toFixed(0)}`}</p>
                        <p className="desc">{`Отклонение: ${(productionValue - planValue).toFixed(0)}`}</p>
                        <p className="desc">{`Брак: ${defectPercent} %`}</p>
                    </strong>
                </div>
            );
        }

        return null;
    };

    const combinedData: CombinedData[] = planData.reduce((acc: CombinedData[], plan: Plan) => {
        // Преобразуем planDate в строку формата YYYY-MM-DD для сравнения
        const planDateStr = new Date(plan.planDate).toISOString().split('T')[0].substring(0, 7);

        // Ищем в аккумуляторе запись с данной датой
        const existingEntry = acc.find(entry => entry.planDate.substring(0, 7) === planDateStr);

        // Если запись найдена, обновляем значения
        if (existingEntry) {
            existingEntry.planValue += plan.planValue; // Суммируем плановые значения
        } else {
            // Если записи с такой датой нет, создаем новую
            acc.push({
                planDate: planDateStr,
                planValue: plan.planValue,
                productionValue: 0, // Изначально значение производства равно 0
                totalValue: 0,
                defectPercent: 0
            });
        }

        return acc;
    }, []);

    // Теперь суммируем значения производства для каждой даты
    combinedData.forEach(entry => {
        const productionValues = productionData
            .filter((prod: BoardProduction) => {

                const prodDate = ApiService.formatDateToISO(prod.productionList.productionDate);
                // prodDate.setDate(prodDate.getDate() +1);//TODO типы возвращаемых дат не сходятся
                const prodDateStr = prodDate.split('T')[0].substring(0, 7);
                return prodDateStr === entry.planDate.substring(0, 7);
            })
            .map((prod: BoardProduction) => prod.value);
        const totalValues = allProductionData
            .filter((prod) => {
                const prodDate = ApiService.formatDateToISO(prod.productionList.productionDate);
                // const prodDate = new Date(prod.productionList.productionDate);
                // prodDate.setDate(prodDate.getDate() + 1);//TODO типы возвращаемых дат не сходятся
                const prodDateStr = prodDate.split('T')[0].substring(0, 7);
                return prodDateStr === entry.planDate.substring(0, 7) && prod.category.id === 1;
            })
            .map((prod: BoardProduction) => prod.value);

        // Суммируем значения производства и обновляем запись
        entry.productionValue = productionValues.reduce((acc: number, value: number) => acc + value, 0);
        entry.totalValue = totalValues.reduce((acc: number, value: number) => acc + value, 0);
        entry.defectPercent = entry.totalValue ? Number(((1 - entry.productionValue / entry.totalValue) * 100).toFixed(2)) : 0;
    });


    // Функция для форматирования подписи в легенде
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

    const closeModal = () => {
        setShowModal(false);
    }



    const handleClick = (data: any) => {
        if (data) {
            console.log('Дата:', data.planDate);
            console.log('Плановое значение:', data.planValue);
            const factData = allProductionData.filter((prod) =>
                new Date(addDays(prod.productionList.productionDate, 1)).toISOString().split('T')[0].substring(0, 7) === data.planDate
                && prod.category.id > 1
                && prod.category.id < 4);
            const plan = planData.filter((plan) =>
                new Date(plan.planDate).toISOString().split('T')[0].substring(0, 7) === data.planDate);
            setModalPlan(plan);
            setModalDate(data.planDate);
            setModalFact(factData);
            setShowModal(true);
        } else {
            console.error('Данные не определены');
        }
    };

    return (

        // <Card className="text-center bg-body-primary">
        //     <Card.Header><h5>План-факт производства</h5></Card.Header>
        //     <Card.Body style={{ overflowX: 'auto' }}>
        // <Col className="col-12 d-flex align-items-center" >
        <div style={{overflow: 'auto'}}>

            <MyCard label='План-факт производства' value={
                <Col className="col-12 " style={{ minWidth: '350px', width: '100%', height: '278px', }}>
                    <ResponsiveContainer>
                        <LineChart
                            title="План-факт производства"
                            // width={550}
                            // height={300}
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
                            <XAxis dataKey="planDate" />
                            <YAxis yAxisId="left" />
                            <YAxis yAxisId="right" orientation="right" label={{ value: '%', position: 'right' }} domain={[0, 'dataMax + 5']} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend formatter={legendFormatter} />
                            <Line yAxisId="left" type="monotone" dataKey="planValue" stroke="#8884d8" activeDot={{ r: 8, }} strokeWidth={3} />
                            <Line yAxisId="left" type="monotone" dataKey="productionValue" stroke="#FF1493" activeDot={{ r: 8 }} strokeWidth={3} />
                            <Line yAxisId="right" type="step" dataKey="defectPercent" stroke="#82ca9d" strokeWidth={2} />

                        </LineChart>
                    </ResponsiveContainer>
                </Col>
            }
                labelFontSize="14px"
            />
        
        <PlanFactModal show={showModal} plan={modalPlan} fact={modalFact} delays={[]} onHide={closeModal} date={modalDate} />
        </div>
            


        // </Col >

    );
};

export default PlanFactChartByMonth;
