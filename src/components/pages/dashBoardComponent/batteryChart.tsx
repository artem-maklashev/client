import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';
import Plan from '../../../model/gypsumBoard/Plan';
import BoardProduction from '../../../model/production/BoardProduction';
import battery from './images/battery_outline_in_a_circle_blhptsyz0g2b.svg'; // Импорт изображения
import { Card, Col } from 'react-bootstrap';

interface BatteryChartProps {
    planData: Plan[];
    factData: BoardProduction[];
}

const BatteryChart: React.FC<BatteryChartProps> = ({ planData, factData }) => {
    const plan = planData.reduce((acc, plan) => acc + plan.planValue, 0);
    const fact = factData.reduce((acc, fact) => acc + fact.value, 0);

    // Данные для отображения
    const data = [{ name: 'Plan vs Fact', value: fact }];
    const maxValue = Math.max(plan, fact);

    return (
        <Col className="col-12 mt-2" >
            <Card>
                <Card.Header className='text-center'>Выполнение плана</Card.Header>
                <Card.Body style={{ width: '300px', height: '320px' }}>
                    <Card.Text className='text-center'>План: {plan} м²</Card.Text>
                    <Card.Text className='text-center'>Факт: {fact.toFixed(2)} м²</Card.Text>
                    <Card.Text className='text-center'>Отклонение: {fact>plan ? '+':""}{(fact-plan).toFixed(2)} м² ({((fact-plan)*100/plan).toFixed(2)} %)</Card.Text>
                    <ResponsiveContainer>
                        <BarChart
                            width={300}
                            height={180}
                            data={data}
                            layout="vertical"
                            margin={{ top: 0, right: 50, left: 72, bottom: 88 }}
                        >
                            <defs>
                                <pattern id="bgImage" patternUnits="userSpaceOnUse" width="300" height="200">
                                    <image href={battery} x="0" y="0" width="300" height="200" />
                                </pattern>
                            </defs>
                            <rect x={0} y={0} width={300} height={180} fill="url(#bgImage)" />
                            {/* <CartesianGrid strokeDasharray="3 3" /> */}
                            <XAxis type="number" hide domain={[0, maxValue]} />
                            <YAxis type="category" dataKey="name" hide />
                            {/* <Tooltip /> */}
                            <ReferenceLine y={plan} stroke="gray" strokeWidth={2} label="Plan" />
                            <Bar dataKey="value" fill={fact >= plan ? "#4CAF50" : "#F44336"}
                                fillOpacity={0.6} // прозрачность
                                barSize={92} />
                        </BarChart>
                    </ResponsiveContainer>
                </Card.Body>
            </Card>
        </Col>
    );
}

export default BatteryChart;
