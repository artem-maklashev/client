import React from 'react';
import { Card } from 'react-bootstrap';
import { PieChart, Pie, Tooltip, Cell, Legend, ResponsiveContainer } from 'recharts';

// Класс для представления данных
class ChartData {
    name: string;
    value: number;

    constructor(name: string, value: number) {
        this.name = name;
        this.value = value;
    }
}

interface PieChartProps {
    data: ChartData[];
    title: string;
}

const MixPieChart: React.FC<PieChartProps> = ({ data, title }) => {
    // Цвета секторов диаграммы
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    // Функция для кастомного отображения меток
    const renderCustomizedLabel = ({
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        percent,
        index,
    }: any) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
        const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

        const name = data[index].name;
        const percentage = `${(percent * 100).toFixed(0)}%`;
        const value = `${data[index].value.toLocaleString('ru-RU', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} кг`;

        return (
            <text
                x={x}
                y={y}
                fill='black'
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="12px"
                fontWeight={'bold'}
            >
                <tspan x={x} dy="-1em">{name}</tspan>
                <tspan x={x} dy="1.2em">{percentage}</tspan>
                <tspan x={x} dy="1.2em">{value}</tspan>
            </text>
        );
    };

    return (
        <Card className="mt-2 text-center bg-body-primary">
            <Card.Header>
                <h5>{title}</h5>
            </Card.Header>
            <Card.Body>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            labelLine={false}
                            label={renderCustomizedLabel}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        {/* <Legend layout="horizontal" verticalAlign="bottom" align="center" /> */}
                    </PieChart>
                </ResponsiveContainer>
            </Card.Body>
        </Card>
    );
};

export default MixPieChart;
