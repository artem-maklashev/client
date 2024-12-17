import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import Plan from '../../../model/gypsumBoard/Plan';
import BoardProduction from '../../../model/production/BoardProduction';
import { Card, Col, Table } from 'react-bootstrap';
import BatteryImage from './batteryImage';
import gkl from '../../../images/dekorator-gsp-a-pk.svg'

interface BatteryChartProps {
    planData: Plan[];
    factData: BoardProduction[];
}

const BatteryChart: React.FC<BatteryChartProps> = ({ planData, factData }) => {
    const plan = planData.reduce((acc, plan) => acc + plan.planValue, 0);
    const fact = factData.reduce((acc, fact) => acc + fact.value, 0);
    const lastProductionDateMils = (
        Math.max.apply(
            null,
            factData.map(fact => new Date(fact.productionList.productionDate).getTime())
        )
    );

    const lastProductionDate = new Date(lastProductionDateMils);
    lastProductionDate.setDate(lastProductionDate.getDate() + 1);
    const planToLastProductionDate = planData.filter((plan) => new Date(new Date(plan.planDate).toISOString()) <= lastProductionDate).reduce((acc, plan) => acc + plan.planValue, 0);
    console.log(planToLastProductionDate);
    // Данные для отображения
    const data = [{ name: 'Plan vs Fact', value: fact }];
    const maxValue = Math.max(plan, fact);
    const batteryBlok = (
        <ResponsiveContainer height={50} width={100} className="align-content center">

            <BarChart
                // width={150}
                // height={150}
                data={data}
                layout="vertical"
                margin={{ top: 0, right: 32, left: 30, bottom: 0 }}
            >

                <defs>
                    <BatteryImage key={Date.now()} />
                </defs>
                <rect x={0} y={0} width={'100%'} height={'100%'} fill="url(#bgImage)" />



                {/* <CartesianGrid strokeDasharray="3 3" /> */}
                <XAxis type="number" hide domain={[0, maxValue]} />
                <YAxis type="category" dataKey="name" hide />
                {/* <Tooltip /> */}
                {/* <ReferenceLine y={plan} stroke="gray" strokeWidth={2} label="Plan" /> */}
                <Bar dataKey="value" fill={fact >= planToLastProductionDate ? "#4CAF50" : "#F44336"}
                    fillOpacity={0.6} // прозрачность
                    barSize={22} />
            </BarChart>
        </ResponsiveContainer>
    );
    return (
        <Col className="col-12 mt-2">
            <Card
                style={{
                    backgroundImage: `url(${gkl})`,
                    backgroundSize: 'cover', // Увеличить или уменьшить изображение, чтобы оно заполнило карточку
                    backgroundPosition: 'center', // Центрировать изображение
                    backgroundRepeat: 'no-repeat', // Избежать повторения
                }}
            >
                <Card.Header className="text-center">
                    <h5>Выполнение плана</h5>
                </Card.Header>
                <Card.Body
                    style={{ width: '100%', height: '100%' }}
                    className="d-flex justify-content-center align-items-center"
                >
                    <Col className="text-left">
                        <strong>
                            <Card.Body className="text-center">
                                <Table className='transparent-table striped'                                    
                                >
                                    {/* <thead  >  
                                        <tr >
                                            <td></td>
                                            <td>м²</td>
                                            <td>%</td>
                                        </tr>
                                    </thead> */}
                                    <tbody>
                                        <tr>
                                            <td className="align-middle">План</td>
                                            <td className="align-middle">{plan} м²</td>
                                            <td className="d-flex justify-content-center align-items-center">{batteryBlok}</td>
                                        </tr>
                                        <tr>
                                            <td>Факт</td>
                                            <td>{fact.toFixed(0)} м²</td>
                                            <td>{plan ? ((fact * 100) / plan).toFixed(2) : 0} % </td>
                                        </tr>
                                        <tr>
                                            <td>Откл.</td>
                                            <td>{fact > plan ? '+' : ''}{(fact - plan).toFixed(0)} м²</td>
                                            <td>{((fact - plan) * 100 / plan).toFixed(2)} %</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </strong>
                    </Col>
                </Card.Body>
            </Card>
        </Col>
    );
}

export default BatteryChart;
