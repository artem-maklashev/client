import { BarChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis, Tooltip, Bar, LabelList, ComposedChart, Line } from "recharts";
import Delays from "../../../model/delays/Delays";
import { Card } from "react-bootstrap";
import React, { useEffect, useState } from "react";

interface DelaysChartBoardProps {
    delays: Delays[];
}

interface CombinedData {
    date: string;
    [key: string]: number | string;
    totalTime: number;
}

const DelaysChartBoard: React.FC<DelaysChartBoardProps> = ({ delays }) => {
    const [data, setData] = useState<Delays[]>(delays);
    const [combinedData, setCombinedData] = useState<CombinedData[]>([]);

    useEffect(() => {
        if (delays) {
            setData(delays);
        }
    }, [delays]);

    // Вычисляем длительность задержки в минутах
    function getDeltaTime(delay: Delays): number {
        return (new Date(delay.endTime).getTime() - new Date(delay.startTime).getTime()) / (1000 * 60);
    }

    const sortDelayTypes = <T extends { name: string }>(types: T[]): T[] => {
        // Сортировка типов задержек (по алфавиту)
        return types.sort((a, b) => a.name.localeCompare(b.name));
    }

    useEffect(() => {
        if (data) {
          const groupedData: CombinedData[] = [];
    
          data.forEach((item) => {
            const dateStr = new Date(item.delayDate).toLocaleDateString();
            const existingEntry = groupedData.find((entry) => entry.date === dateStr);
    
            if (existingEntry) {
              existingEntry[item.delayType.name] = (existingEntry[item.delayType.name] as number || 0) + getDeltaTime(item);
            } else {
                const sortedDelayTypes = sortDelayTypes(data.map((item) => ({ name: item.delayType.name })));
              groupedData.push({
                date: dateStr,
                totalTime: 0,
                // Ключи добавляются в отсортированном порядке
                ...sortedDelayTypes.reduce((obj, type) => ({ ...obj, type: 0 }), {})
              });
            }
          });
    
          groupedData.forEach((item) => {
            item.totalTime = Object.keys(item)
              .filter((key) => key !== "date" && key !== "totalTime")
              .reduce((sum, key) => sum + (item[key] as number), 0);
          });
    
          setCombinedData(groupedData);
        }
      }, [data]);

    const COLORS = ['#8884d8', '#FF1493', '#282cff', '#370548'];



    return (
        <Card className="mt-2 text-center bg-body-primary">
            <Card.Header><h5>Простои</h5></Card.Header>
            <Card.Body style={{ width: '100%', height: '300px', marginTop: '1px' }} className='d-flex justify-content-center align-items-center'>
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                        data={combinedData}
                        layout="horizontal"
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date"  />
                        <YAxis type="number" hide />
                        <Tooltip />
                        <Legend />
                        {combinedData.length > 0 && Object.keys(combinedData[0]).filter(key => key !== 'date' && key !== 'totalTime').map((key, index) => (
                            <Bar
                                key={key}
                                dataKey={key}
                                stackId="a"
                                fill={COLORS[index % COLORS.length]}
                            >


                            </Bar>
                        ))}
                        <Line type="monotone" dot={false} dataKey="totalTime" stroke='transparent' label={{ fill: 'blue', fontSize: 12, position: 'top' }}

                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </Card.Body>
        </Card>
    );
};

export default DelaysChartBoard;
