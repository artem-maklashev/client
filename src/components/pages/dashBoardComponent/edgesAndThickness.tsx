import { useEffect, useState } from "react";
import BoardProduction from "../../../model/production/BoardProduction";
import { Bar, BarChart, CartesianGrid, Legend, LegendProps, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "react-bootstrap";
import React from "react";

interface Edges {
    edgeName: string;
    value: number;
}

interface Thickness {
    edge: string;
    thickness: string;
    value: number;
}

interface CustomLegendProps extends LegendProps {
    payload?: { value: string; color: string }[];
}

interface EdgesAndThiknessProps {
    allProductionData: BoardProduction[];
    tradeMark: string;
}

const EdgesAndThikness: React.FC<EdgesAndThiknessProps> = ({ allProductionData, tradeMark }) => {
    const [data, setData] = useState<BoardProduction[]>(allProductionData);

    useEffect(() => {
        if (allProductionData) {
            setData(allProductionData);
        }
    }, [allProductionData]);

    const edgesData: Edges[] = data.reduce((acc: Edges[], prod) => {
        const existingEntry = acc.find(entry => entry.edgeName === prod.product.edge.name);

        if (existingEntry) {
            existingEntry.value += prod.value;
        } else {
            acc.push({
                edgeName: prod.product.edge.name,
                value: prod.value
            });
        }

        return acc;
    }, []);

    const thicknessData: Thickness[] = data.reduce((acc: Thickness[], prod) => {
        const existingEntry = acc.find(entry => entry.edge === prod.product.edge.name && entry.thickness === prod.product.thickness.value);

        if (existingEntry) {
            existingEntry.value += prod.value;
        } else {
            acc.push({
                edge: prod.product.edge.name,
                thickness: prod.product.thickness.value,
                value: prod.value
            });
        }

        return acc;
    }, []);

    // Объединяем данные для отображения
    const combinedData = edgesData.map(edge => {
        const thicknessValues = thicknessData
            .filter(th => th.edge === edge.edgeName)
            .reduce((acc, th) => {
                acc[th.thickness] = Number(th.value.toFixed(2));
                return acc;
            }, {} as { [key: string]: number });

        return {
            edgeName: edge.edgeName,
            totalValue: edge.value,
            ...thicknessValues
        };
    });
    const sortedData = combinedData.sort((a, b) => b.totalValue - a.totalValue);

    // Извлекаем уникальные значения толщин для динамического создания Bar компонентов
    const uniqueThicknesses = thicknessData.reduce((acc, curr) => {
        if (!acc.includes(curr.thickness)) {
            acc.push(curr.thickness);
        }
        return acc;
    }, [] as string[]);

    const COLORS = ['#0088FE', '#00C49F', '#282cff', '#370548'];

    const CustomLegend: React.FC<CustomLegendProps> = ({ payload = [] }) => {
        return (
            <div style={{ fontSize: '12px', textAlign: 'center', marginBottom: '5px' }}>
                {payload.length > 0 ? (
                    payload.map(entry => (
                        // <div key={entry.value} style={{ marginBottom: '5px' }}>
                        <span style={{ color: entry.color }}>{entry.value} {" "}</span>
                        // </div>
                    ))
                ) : (
                    <div>No data available</div> // Покажите сообщение, если данных нет
                )}
            </div>
        );
    }

    return (
        <Card className="mt-2 text-center" style={{ backgroundColor: '#f9f9f9' }}>
            <Card.Header><h5>Кромка и толщина. {tradeMark}</h5></Card.Header>
            <Card.Body style={{ width: '100%', height: '200px', marginTop: '1px' }} className='d-flex justify-content-center align-items-center'>
                <ResponsiveContainer width="100%" height="100%" >
                    <BarChart
                        width={500}
                        height={300}
                        data={sortedData}
                        layout="vertical"
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                        maxBarSize={50}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <YAxis dataKey="edgeName" type='category'
                            tick={{ fontSize: 12, fill: '#555' }}
                            axisLine={{ stroke: '#888' }}
                            tickLine={{ stroke: '#888' }} />
                        <XAxis type="number"
                            tick={{ fontSize: 12, fill: '#555' }}
                            axisLine={{ stroke: '#888' }}
                            tickLine={{ stroke: '#888' }} />
                        <Tooltip />
                        <Legend align='right' verticalAlign='top'
                            content={<CustomLegend />} />
                        {
                            uniqueThicknesses.map((thickness, index) => (
                                <Bar key={thickness} dataKey={thickness} stackId="a" name={`${thickness} mm`} fill={COLORS[index % COLORS.length]} />
                            ))
                        }
                    </BarChart>
                </ResponsiveContainer>
            </Card.Body>
        </Card>
    );
}



export default EdgesAndThikness;
