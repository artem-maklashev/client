import React from "react";
import Delays from "../../../model/delays/Delays";
import DalayDataPrepare from "./DalayDataPrepare";
import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Badge, Card, Col, Row } from "react-bootstrap";


interface DelaysChartProps {
    delays_data: Delays[];
}

const DelaysChart: React.FC<DelaysChartProps> = ({ delays_data }) => {
    const preparedData = new DalayDataPrepare(delays_data).getSummary();
    const summaryDelays = preparedData.delaysSummary;
    const summary = Object.entries(summaryDelays).sort((a, b) => b[1] - a[1]);
    const unitDelays = (preparedData.unitData);
    const total = summary.reduce((sum, current) => sum + current[1], 0);
    console.log('Summary', summary);
    console.log('UnitData', unitDelays);


    const charts = Object.entries(unitDelays).map(([delayType, chartData], chartIndex) => {
        const totalDelta = chartData.reduce((sum, data) => sum + data.delta, 0);

        return (
            <Col key={`chart-col-${chartIndex}`} md={6} className="mb-4 g-3"> {/* Основная колонка с отступами */}
                <Card className="shadow-sm border-primary h-100"> {/* h-100 для одинаковой высоты карточек */}
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
                                {delayType}: <span style={{ fontWeight: 700 }}>{totalDelta} мин</span>
                            </h4>
                        </div>

                        {/* График */}
                        <div style={{
                            width: "100%",
                            height: `${chartData.length * 50 + 40}px`,
                            filter: "drop-shadow(0px 4px 8px rgba(136, 132, 216, 0.3))"
                        }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={chartData}
                                    layout="vertical"
                                    margin={{ top: 5, right: 50, bottom: 20, left: 5 }}
                                >
                                    <defs>
                                        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                                            <feGaussianBlur stdDeviation="2" result="blur" />
                                            <feOffset dx="1" dy="1" in="blur" result="offsetBlur" />
                                            <feComposite in="SourceGraphic" in2="offsetBlur" operator="over" />
                                        </filter>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                    <XAxis
                                        type="number"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12 }}
                                    />
                                    <YAxis
                                        type="category"
                                        dataKey="unitPart.unit.name"
                                        tick={{ fontSize: 12 }}
                                        axisLine={false}
                                        tickLine={false}
                                        width={120}
                                    />
                                    <Tooltip
                                        formatter={(value) => [`${value} минут`, 'Длительность']}
                                        labelFormatter={(label) => `Тип простоя: ${label}`}
                                    />
                                    <Bar
                                        dataKey="delta"
                                        fill="#8884d8"
                                        barSize={25}
                                        radius={[0, 4, 4, 0]}
                                        animationDuration={500}
                                        filter="url(#shadow)"
                                    >
                                        <LabelList
                                            position="right"
                                            formatter={(value: number) => `${value} мин`}
                                        />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card.Body>
                </Card>
            </Col>
        );
    });

    return (
        <div className="container">
            <Row>
                <h3>Суммарное количество простоев: {total} минут</h3>
                <div className="col mx-auto" style={{ width: '100%', height: `${summary.length * 50 + 35}px` }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={summary}
                            layout="vertical"
                            margin={{ top: 5, right: 50, bottom: 20, left: 10 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" dataKey={entry => entry[1]} /> {/* Use entry[1] for the delay value */}
                            <YAxis
                                type="category"
                                dataKey={entry => entry[0]} // Use entry[0] for the delay type
                                tick={{ stroke: 'black', strokeWidth: 0.5, fontSize: 12 }}
                                width={120}
                            />
                            <Tooltip />
                            {/*<Legend verticalAlign="top" height={36} />*/}
                            <Bar dataKey={entry => entry[1]} fill="#3498db" animationDuration={500}>
                                <LabelList position="right" />
                            </Bar>
                            {/* ... rest of your Bar components */}
                        </BarChart>
                    </ResponsiveContainer>

                </div>
            </Row>
            <Row className="col-12">{charts}</Row>
        </div>
    );
}
export default DelaysChart;