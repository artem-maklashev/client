import React from 'react';
import { PieChart, Pie, Tooltip, Cell, Legend, ResponsiveContainer } from 'recharts';
import BoardProduction from "../../../model/production/BoardProduction";

// Класс для представления данных
class ChartData {
    name: string;
    value: number;

    constructor(name: string, value: number) {
        this.name = name;
        this.value = value;
    }
}

interface BoardProductionProps {
    edgeData: BoardProduction[];
}

const EdgeChart: React.FC<BoardProductionProps> = ({ edgeData }) => {
    const data = edgeData.filter(
        (value) =>
            value.category.id === 2 ||
            value.category.id === 3 ||
            value.category.id === 4
    );
    if (data.length === 0) {
        return (<div>Данных нет</div>);
    } else {
        console.log('Получены данные в размере ' + data.length);
    }

    let data1: ChartData[] = [];

    data.forEach((value) => {
        const existingData = data1.find((item) => item.name === value.product.edge.name);

        if (existingData) {
            // Если данные существуют, добавьте значение к существующему значению
            existingData.value += value.value;
        } else {
            // Если данных нет, создайте новый объект ChartData и добавьте его в массив
            const newData = new ChartData(value.product.edge.name, value.value);
            data1.push(newData);
        }
    });

    // Цвета секторов диаграммы
    const COLORS = ['#0088FE', '#00C49F', '#282cff', '#370548'];

    const RADIAN = Math.PI / 180;

    const containerWidth = 400;

    return (       
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Tooltip label="name>" />
                    {/*<Legend name="name" verticalAlign="top" />*/}
                    <Pie
                        data={data1}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={90}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent, value }) => (
                                `${name} 
                                 ${(percent * 100).toFixed(0)}%`
                                // (${value.toFixed(2)}м²)`
                        )}
                    >
                        {data1.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
       
    );
};

export default EdgeChart;
