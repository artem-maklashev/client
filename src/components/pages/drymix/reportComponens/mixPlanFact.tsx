import { FC, useEffect, useState } from "react";
import MixCategoryProduction from "../../../../model/mix/prodution/MixCategoryProduction";
import { Card, Col, } from "react-bootstrap";
import React from "react";
import { Tooltip, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { addDays } from "date-fns";
import MixPlan from "../../../../model/mix/plan";
import MixPlanFactModal from "./mixPlanFactModal";
import { start } from "repl";

interface MixPlanFactProps {
    mixProduction: MixCategoryProduction[];
    mixPlan: MixPlan[];
}

interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{ payload: any }>;  // Упрощено для обработки различных типов данных
}

interface CombinedData {
    planDate: string;
    planValue: number;
    productionValue: number;}


const PlanFact: FC<MixPlanFactProps> = ({ mixProduction, mixPlan }) => {

    const [modalPlan, setModalPlan] = React.useState<MixPlan[]>([]);
    const [modalFact, setModalFact] = useState<MixCategoryProduction[]>([]);
    const [modalDate, setModalDate] = useState<string>('');
    const [showModal, setShowModal] = useState<boolean>(false);
    const [combinedData, setCombinedData] = useState<CombinedData[]>([]);


    const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
        if (active && payload && payload.length) {
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

    function findMinDate(dates: Date[]): Date | null {
        if (dates.length === 0) return null;
        return dates.reduce((minDate, date) => {
            return date < minDate ? date : minDate;
        }, dates[0]);
    }

    function findMaxDate(dates: Date[]) {
        if (dates.length === 0) return null;
        return dates.reduce((maxDate, date) => {
            return date > maxDate ? date : maxDate;
        }, dates[0]);
    }


    useEffect(() => {
        function generateDateRange(): string[] {

            const planDates = mixPlan.map((plan) => new Date(plan.planDate));
            const productionDates = mixProduction.map((prod) => new Date(prod.production.productionDate));

            const minPlanDate = findMinDate(planDates);
            const minProdDate = findMinDate(productionDates);
            const maxPlanDate = findMaxDate(planDates);
            const maxProdDate = findMaxDate(productionDates);

            const startDate = minPlanDate && minProdDate ? (minPlanDate < minProdDate ? minPlanDate : minProdDate) : minPlanDate || minProdDate;
            const endDate = maxPlanDate && maxProdDate ? (maxPlanDate > maxProdDate ? maxPlanDate : maxProdDate) : maxPlanDate || maxProdDate;

            console.log(startDate, endDate);           

            console.log("Start date:", startDate, "End date:", endDate); // Логирование для проверки

            const dateArray: string[] = [];
            if (startDate && endDate) {
                let currentDate = new Date(startDate);
                while (currentDate <= endDate) {
                    dateArray.push(new Date(currentDate).toISOString().split("T")[0]);
                    currentDate.setDate(currentDate.getDate() + 1);
                }
            }
    
            return dateArray;
        }

        const dateRange = generateDateRange();
        console.log(dateRange);

        const draftCombinedData = dateRange.map((date) => {
            const plan = mixPlan.filter((plan) => {
                const planDate = new Date(plan.planDate);
                return planDate.toLocaleDateString() === new Date(date).toLocaleDateString();
            });
        
            const productionForDate = mixProduction.filter((prod) => {
                const productionDate = new Date(prod.production.productionDate);
                return (
                    productionDate.toLocaleDateString() === new Date(date).toLocaleDateString() &&
                    prod.category.id === 2
                );
            });
        
            console.log('Filtered production', productionForDate);
        
            const totalProductionValue = productionForDate
                ? productionForDate.reduce((acc, prod) => acc + prod.quantity, 0)
                : 0;
            const totalPlanValue = plan
                ? plan.reduce((acc, plan) => acc + plan.value, 0)
                : 0;
        
            return {
                planDate: date,
                planValue: totalPlanValue,
                productionValue: totalProductionValue,
            };      
        
        });
        console.log(draftCombinedData);
        setCombinedData(draftCombinedData);
    }, [mixProduction, mixPlan]);



    const handleClick = (data: any) => {
        if (data) {
            console.log('Дата:', data.planDate);
            console.log('Плановое значение:', data.planValue);
            console.log('Фактическое значение:', data.productionValue);
            const factData = mixProduction.filter((prod) =>
                new Date((prod.production.productionDate)).toLocaleDateString() === new Date(data.planDate).toLocaleDateString()
                );
            const plan = mixPlan.filter((plan) =>
                new Date(plan.planDate).toISOString().split('T')[0] === data.planDate);
            setModalPlan(plan);
            setModalDate(data.planDate);
            setModalFact(factData.filter((prod) => prod.category.id === 2));
            
            setShowModal(true);
        } else {
            console.error('Данные не определены');
        }
    };

    const closeModal = () => {
        setShowModal(false);
    }


    return (
        <Card className="text-center bg-body-primary shadow-sm border-0">
            <Card.Header  className="bg-primary text-white text-center py-2">
                <h6 className="m-0 text-uppercase">План-факт производства</h6></Card.Header>
            <Card.Body style={{ overflowX: 'auto' }}>
                <Col className="col-12 " style={{ minWidth: '500px', width: '100%', height: '278px' }}>
                    <ResponsiveContainer style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '8px' }}>
                        <LineChart
                            title="План-факт производства"
                            width={500}
                            height={200}
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
                            <XAxis dataKey="planDate" padding={{ left: 30, right: 30 }} height={20}/>
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
            <MixPlanFactModal show={showModal} plan={modalPlan} fact={modalFact} delays={[]} onHide={closeModal} date={modalDate} />
        </Card>
    );
}
export default PlanFact;