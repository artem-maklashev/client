import BoardProduction from "../../../model/production/BoardProduction";
import {Tooltip, AreaChart, YAxis, CartesianGrid, XAxis, Area, Label, ResponsiveContainer} from "recharts";
import React from "react";
import DefectChartData from "./DefectChartData";
import { Card } from "react-bootstrap";

// Класс для представления данных
// class ChartData {
//     pDate: Date;
//     value: number;
//     totalValue: number;
//     defectsPresent: number;
//     pDay: string;
//
//
//     constructor(pDate: Date, value: number, totalValue: number, defectsPercent: number) {
//         this.pDate = pDate;
//         this.value = value;
//         this.totalValue = totalValue;
//         this.defectsPresent = defectsPercent;
//         this.pDay = "";
//     }
//
// }

interface BoardProductionProps {
    data: BoardProduction[];
}

const DefectChart: React.FC<BoardProductionProps> = ({data}) => {
    if (data.length === 0) {
        return <div>Данных нет</div>;
    } else {
        data = data.sort((a, b) => (a.productionList.productionDate < b.productionList.productionDate ? -1 : 1));
        console.log("Получены данные в размере " + data.length);
        const defectData = data.filter(
            (item) => item.category.id <= 4);
        console.log("Преобразованные данные " + defectData.length);


        let data1: DefectChartData[] = [];

        defectData.forEach((production) => {

                const existingData = data1.find((item) => {
                    return item.pDate === production.productionList.productionDate;
                });
                if (existingData) {
                    // Если данные существуют, добавьте значение к существующему значению
                    if (production.category.id === 2 || production.category.id === 3 || production.category.id === 4) {
                        existingData.value += production.value;
                    } else {
                        existingData.totalValue += production.value;
                    }
                } else {
                    // Если данных нет, создайте новый объект ChartData и добавьте его в массив
                    let newData: DefectChartData;
                    if (production.category.id === 2 || production.category.id === 3) {
                        newData = new DefectChartData(production.productionList.productionDate, production.value, 0, 0);
                    } else {
                        newData = new DefectChartData(production.productionList.productionDate, 0, production.value, 0);
                    }
                    data1.push(newData);
                }
                console.log("Получены данные в размере " + data1.length);
            }
        );

        data1 = data1.map(value => ({
            ...value,
            defectsPresent: value.totalValue !== 0 ? Number(((value.totalValue - value.value) * 100 / value.totalValue).toFixed(2)) : 0
        }));
        data1.forEach(value => {
            const dateValue = new Date(value.pDate); // Assuming pDate is the date property in your data

            if (isNaN(dateValue.getTime())) {
                throw new Error('Invalid date object');
            }

            const day = dateValue.getDate().toString().padStart(2, '0');
            value.pDay = `${day}`;
        });


        console.log("Получены данные в размере " + data1.length + " Первые данные\n" +
            " pDate=" + data1[0].pDate +
            " total=" + data1[0].totalValue +
            " value=" + data1[0].value +
            " defectsPresent=" + data1[0].defectsPresent);


        return (
            // <div className="row">
            <div className="col-12 mb-5" style={{width: '100%', height: '300px'}}>
                <Card className="col-12 mb-5" style={{width: '100%', height: '300px'}}>
                <Card.Title className="text-center">Процент брака</Card.Title>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data1}
                               margin={{top: 30, right: 30, left: 0, bottom: 0}}>
                        {/*{defectData[0].pList.id}*/}
                        <defs>
                            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#8884d8" stopOpacity={0.2}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="pDay"/>
                        <YAxis dataKey="defectsPresent" label="%"/>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <Tooltip/>
                            {/*<text x={600} y={15} textAnchor="middle" dominantBaseline="middle" fill="black">*/}
                            {/*    Процент брака*/}
                            {/*</text>*/}
                        <Area type="monotone" dataKey="defectsPresent" stroke="#8884d8" fillOpacity={1}
                              fill="url(#colorUv)"/>
                    </AreaChart>
                </ResponsiveContainer>
                </Card>
            </div>

        );
    }
};

export default DefectChart;
