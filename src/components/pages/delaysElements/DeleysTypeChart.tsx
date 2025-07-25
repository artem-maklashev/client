import React from "react";
import Delays from "../../../model/delays/Delays";
import { Card, Col, Container, Row } from "react-bootstrap";
import { Bar, BarChart, CartesianGrid, LabelList, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface DelaysTypeChartProps {
    data:  Delays[] ;
}

const DelaysTypeChart: React.FC<DelaysTypeChartProps> = ({ data }) => {

    const uniqueDelayTypes = Array.from(new Set(data.map(d => d.delayType.name)));   
    const allShifts = Array.from(new Set(Object.values(data).flat().map(d => d.shift.name))).sort((a, b) => a.localeCompare(b));

    const chartsByShift = uniqueDelayTypes.map((delayType, chartIndex) => {
    // Фильтруем только простои текущего типа
    const delaysOfType = data.filter(delay => delay.delayType.name === delayType);
    
    // 1. Группируем данные по участкам (только для текущего типа простоев)
    const unitData: Record<string, { shift: string; delta: number }[]> = {};

    delaysOfType.forEach(delay => {
        const unitName = delay.unitPart.unit.name;
        const delta = (new Date(delay.endTime).getTime() - new Date(delay.startTime).getTime()) / (1000 * 60);

        if (!unitData[unitName]) {
            unitData[unitName] = [];
        }

        unitData[unitName].push({
            shift: delay.shift.name,
            delta: delta
        });
    });      
       
        // 2. Преобразуем в массив для графика
        const processedData = Object.entries(unitData).map(([unitName, shiftsData]) => {
            // Суммируем дельты по сменам
            const shiftTotals = allShifts.reduce((acc, shift) => {
                acc[`deltaShift${shift}`] = shiftsData
                    .filter(d => d.shift === shift)
                    .reduce((sum, d) => sum + d.delta, 0);
                return acc;
            }, {} as Record<string, number>);

            

            return {
                unitPart: { unit: { name: unitName } },
                ...shiftTotals,
                delta: Object.values(shiftTotals).reduce((sum, val) => sum + val, 0)
            };
        }).sort((a, b) => b.delta - a.delta);

        const totalDelta = processedData.reduce((sum, data) => sum + data.delta, 0);



        return (
            <Col key={`chart-col-${chartIndex}`} md={6} className="mb-4 p-3 rounded-3 shadow-sm">
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
                                {delayType}: <span style={{ fontWeight: 700 }}>{totalDelta} мин</span>
                            </h4>
                        </div>

                        {/* График */}
                        <div style={{
                            width: "100%",
                            height: `${processedData.length * 50 + 40}px`,
                            filter: "drop-shadow(0px 4px 8px rgba(136, 132, 216, 0.3))"
                        }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={processedData}
                                    layout="vertical"
                                    margin={{ top: 5, right: 50, bottom: 20, left: 5 }}
                                    stackOffset="none"
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
                                        formatter={(value, name) => {
                                            const shiftName = name.toString().replace('deltaShift', '');
                                            return [`${value} минут`, `Смена ${shiftName}`];
                                        }}
                                        labelFormatter={(label) => `Участок: ${label}`}
                                    />
                                    <Legend />

                                    {allShifts.map((shift, index) => (
                                        <Bar
                                            key={`shift-${shift}`}
                                            dataKey={`deltaShift${shift}`}
                                            stackId="stack"
                                            fill={`hsl(${index * 90}, 70%, 60%)`}
                                            name={`Смена ${shift}`}
                                            barSize={25}
                                            radius={index === allShifts.length - 1 ? [0, 4, 4, 0] : 0}
                                            animationDuration={500}
                                            filter="url(#shadow)"
                                        >
                                            {index === allShifts.length - 1 && (
                                                <LabelList
                                                    dataKey="delta"
                                                    position="right"
                                                    formatter={(value: number) => `${value} мин`}
                                                />
                                            )}
                                        </Bar>
                                    ))}
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card.Body>
                </Card>
            </Col>
        );
    });


    return (
        <Container>
        <Row className="mb-4 p-2 bg-light rounded-3 shadow-sm justify-content-center">
            {chartsByShift}
        </Row>
        </Container>
    );

}
export default DelaysTypeChart;