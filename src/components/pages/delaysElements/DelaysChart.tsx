import React from "react";
import Delays from "../../../model/delays/Delays";
import DalayDataPrepare from "./DalayDataPrepare";
import { Bar, BarChart, CartesianGrid, LabelList, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Badge, Card, Col, Row } from "react-bootstrap";
import DelaysTypeChart from "./DeleysTypeChart";


interface DelaysChartProps {
    delays_data: Delays[];
}

interface GroupedDelay {
    delayType: string;          // Тип простоя
    shifts: Record<string, number>; // Суммы простоев по сменам (динамические ключи)
    total: number;              // Общая сумма по типу простоя
    unitName?: string;          // Опционально: название участка/оборудования
}

const DelaysChart: React.FC<DelaysChartProps> = ({ delays_data }) => {
    const preparedData = new DalayDataPrepare(delays_data).getSummary();
    const summaryDelays = preparedData.delaysSummary;
    const summary = Object.entries(summaryDelays).sort((a, b) => b[1] - a[1]);
    const unitDelays = (preparedData.unitData);
    const total = summary.reduce((sum, current) => sum + current[1], 0);
    console.log('Summary', summary);
    console.log('UnitData', unitDelays);


    // const charts = Object.entries(unitDelays).map(([delayType, chartData], chartIndex) => {

    //     const totalDelta = chartData.reduce((sum, data) => sum + data.delta, 0);

    //     return (
    //         <Col key={`chart-col-${chartIndex}`} md={6} className="mb-4 g-3"> {/* Основная колонка с отступами */}
    //             <Card className="shadow-sm border-primary h-100"> {/* h-100 для одинаковой высоты карточек */}
    //                 <Card.Body className="p-3">
    //                     {/* Заголовок карточки */}
    //                     <div className="d-inline-block p-2 rounded-3 mb-3" style={{
    //                         backgroundColor: 'rgba(136, 132, 216, 0.1)',
    //                         borderLeft: '4px solid #8884d8',
    //                         boxShadow: '0 2px 6px rgba(136, 132, 216, 0.2)',
    //                         width: '100%'
    //                     }}>
    //                         <h4 className="mb-0" style={{
    //                             fontWeight: 600,
    //                             color: '#8884d8',
    //                             fontSize: '1.3rem',
    //                             letterSpacing: '0.5px'
    //                         }}>
    //                             {delayType}: <span style={{ fontWeight: 700 }}>{totalDelta} мин</span>
    //                         </h4>
    //                     </div>

    //                     {/* График */}
    //                     <div style={{
    //                         width: "100%",
    //                         height: `${chartData.length * 50 + 40}px`,
    //                         filter: "drop-shadow(0px 4px 8px rgba(136, 132, 216, 0.3))"
    //                     }}>
    //                         <ResponsiveContainer width="100%" height="100%">
    //                             <BarChart
    //                                 data={chartData}
    //                                 layout="vertical"
    //                                 margin={{ top: 5, right: 50, bottom: 20, left: 5 }}
    //                             >
    //                                 <defs>
    //                                     <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
    //                                         <feGaussianBlur stdDeviation="2" result="blur" />
    //                                         <feOffset dx="1" dy="1" in="blur" result="offsetBlur" />
    //                                         <feComposite in="SourceGraphic" in2="offsetBlur" operator="over" />
    //                                     </filter>
    //                                 </defs>
    //                                 <CartesianGrid strokeDasharray="3 3" horizontal={false} />
    //                                 <XAxis
    //                                     type="number"
    //                                     axisLine={false}
    //                                     tickLine={false}
    //                                     tick={{ fontSize: 12 }}
    //                                 />
    //                                 <YAxis
    //                                     type="category"
    //                                     dataKey="unitPart.unit.name"
    //                                     tick={{ fontSize: 12 }}
    //                                     axisLine={false}
    //                                     tickLine={false}
    //                                     width={120}
    //                                 />
    //                                 <Tooltip
    //                                     formatter={(value) => [`${value} минут`, 'Длительность']}
    //                                     labelFormatter={(label) => `Тип простоя: ${label}`}
    //                                 />
    //                                 <Bar
    //                                     dataKey="delta"
    //                                     fill="#8884d8"
    //                                     barSize={25}
    //                                     radius={[0, 4, 4, 0]}
    //                                     animationDuration={500}
    //                                     filter="url(#shadow)"
    //                                 >
    //                                     <LabelList
    //                                         position="right"
    //                                         formatter={(value: number) => `${value} мин`}
    //                                     />
    //                                 </Bar>
    //                             </BarChart>
    //                         </ResponsiveContainer>
    //                     </div>
    //                 </Card.Body>
    //             </Card>
    //         </Col>
    //     );
    // });


    return (

        <div className="container">
            <Row className="mb-4 p-4 bg-light rounded-3 shadow-sm justify-content-center">
                {/* <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3 className="mb-0" style={{
                        fontWeight: 600,
                        color: '#2c3e50',
                        fontSize: '1.4rem'
                    }}>
                        Суммарное количество простоев: <span style={{ color: '#e74c3c' }}>{total}</span> минут
                    </h3>
                </div> */}

                <Card className="shadow-sm border-primary h-100">
                                    <Card.Body className="p-3">
                                        {/* Заголовок карточки */}
                                        <div className="d-inline-block p-2 rounded-3 mb-3" style={{
                                            backgroundColor: 'rgba(136, 132, 216, 0.1)',
                                            borderLeft: '4px solid #8884d8',
                                            boxShadow: '0 2px 6px rgba(136, 132, 216, 0.2)',
                                            width: '100%'
                                        }}>
                                            <h4 className="mb-0" style={{
                                                fontWeight: 600,
                                                color: '#8884d8',
                                                fontSize: '1.3rem',
                                                letterSpacing: '0.5px'
                                            }}>
                                                 Суммарное количество простоев: {total} минут
                                            </h4>
                                        </div>

                <Col className="bg-white p-3 rounded-3 shadow-sm" style={{
                    width: '100%',
                    height: `${summary.length * 75 + 35}px`,
                    border: '1px solid #ecf0f1'
                }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={summary}
                            layout="vertical"
                            margin={{ top: 15, right: 50, bottom: 10, left: 0 }} // Увеличил left margin для длинных названий
                        >
                                    <defs>
                                        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                                            <feGaussianBlur stdDeviation="2" result="blur" />
                                            <feOffset dx="1" dy="1" in="blur" result="offsetBlur" />
                                            <feComposite in="SourceGraphic" in2="offsetBlur" operator="over" />
                                        </filter>
                                    </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ecf0f1" />

                            <XAxis
                                type="number"
                                dataKey={entry => entry[1]}
                                tick={{ fill: '#7f8c8d', fontSize: 12 }}
                                axisLine={{ stroke: '#bdc3c7' }}
                            />

                            <YAxis
                                type="category"
                                dataKey={entry => entry[0]}
                                tick={{
                                    fill: '#2c3e50',
                                    fontSize: 12,
                                    fontWeight: 500
                                }}
                                width={150} // Увеличил ширину для названий
                                axisLine={false}
                            />

                            <Tooltip
                                contentStyle={{
                                    background: '#fff',
                                    border: '1px solid #dfe6e9',
                                    borderRadius: '6px',
                                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                                }}
                                formatter={(value) => [`${value} минут`, 'Длительность']}
                            />

                            <Bar
                                dataKey={entry => entry[1]}
                                fill="#3498db"
                                animationDuration={800}
                                radius={[0, 4, 4, 0]}
                                filter="url(#shadow)"
                            >
                                <LabelList
                                    position="right"
                                    formatter={(value: number) => `${value} мин`}
                                    style={{
                                        fill: '#2c3e50',
                                        fontSize: 12,
                                        fontWeight: 500
                                    }}
                                />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </Col>
            </Card.Body>
            </Card>
            </Row>
            {/* <Row className="col-12">{charts}</Row> */}
            
                <DelaysTypeChart data={delays_data} />
            
        </div>
    );
}
export default DelaysChart;