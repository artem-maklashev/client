import { CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis, Tooltip, Bar, ComposedChart, Line, LegendProps, TooltipProps } from "recharts";
import Delays from "../../../model/delays/Delays";
import { Card, Col } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent";
import DelaysModal from "./delaysModal";

interface DelaysChartBoardProps {
    delays: Delays[];
}

interface CombinedData {
    date: string;
    [key: string]: number | string;
    totalTime: number;
}

interface CustomLegendPayload {
    value: string;
    color: string;
    dataKey: string; // Добавляем dataKey для типизации
}

interface CustomLegendProps extends LegendProps {
    payload?: CustomLegendPayload[]; // payload может быть undefined
}



const DelaysChartBoard: React.FC<DelaysChartBoardProps> = ({ delays }) => {
    const [data, setData] = useState<Delays[]>(delays);
    const [combinedData, setCombinedData] = useState<CombinedData[]>([]);
    const [modalDelays, setModalDelays] = useState<Delays[]>([]);
    const [modalShow, setShowModal] = useState<boolean>(false);
    const [modalDate, setModalDate] = useState<string>('');
    const [delayTypeName, setDelayTypeName] = useState<string[]>([]);

    useEffect(() => {
        if (delays) {
            setData(delays);
        }
    }, [delays]);

    // Вычисляем длительность задержки в минутах
    function getDeltaTime(delay: Delays): number {
        return (new Date(delay.endTime).getTime() - new Date(delay.startTime).getTime()) / (1000 * 60);
    }

    // function sortDelayTypes<T extends { name: string }>(types: T[]): T {
    //     // Сортировка типов задержек (по алфавиту)
    //     return types.sort((a, b) => a.name.localeCompare(b.name));
    //     // return types;
    // }


    useEffect(() => {
        if (data) {
            const groupedData: CombinedData[] = [];

            data.sort((a, b) => new Date(a.delayDate).getTime() - new Date(b.delayDate).getTime()).forEach((item) => {
                const dateStr = new Date(item.delayDate).toISOString().split('T')[0];
                const existingEntry = groupedData.find((entry) => entry.date === dateStr);

                if (existingEntry) {
                    existingEntry[item.delayType.name] = (existingEntry[item.delayType.name] as number || 0) + getDeltaTime(item);
                } else {

                    groupedData.push({
                        date: dateStr,
                        totalTime: 0,
                        // Ключи добавляются в отсортированном порядке
                        // ...sortedDelayTypes.reduce((obj, type) => ({ ...obj, type: 0 }), {})
                        [item.delayType.name]: getDeltaTime(item) || 0,
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

    useEffect(() => {
        if (combinedData) {
            console.log(JSON.stringify(combinedData));
            const result = Array.from(
                new Set(
                    combinedData.flatMap(item => 
                    Object.keys(item).filter(key => key !== "date" && key !== "totalTime")
                  )
                )
              );
            setDelayTypeName(result);
            console.log("Наименования простоев", JSON.stringify(result));
        }

    }, [combinedData])

    const COLORS = ['#8884d8', '#FF1493', '#282cff', '#370548'];

    const CustomLegend: React.FC<CustomLegendProps> = (props) => {
        const { payload } = props;

        if (!payload) {
            return null; // Возвращаем null, если payload не определен
        }

        return (
            <div style={{ fontSize: '12px', textAlign: 'center' }}>
                {payload.map((entry) => {
                    // Условие для скрытия легенды для линии
                    if (entry.dataKey !== 'type') { // Здесь проверяем dataKey
                        return (
                            // <div key={entry.dataKey} style={{ marginBottom: '5px' }}>
                            <span style={{ color: entry.color }}>{entry.value} {'    '}</span>
                            // </div>
                        );
                    }
                    return null;
                })}
            </div>
        );
    };

    const CustomTooltip: React.FC<TooltipProps<ValueType, NameType>> = ({ active, payload = [], label }) => {
        if (!active || !payload || payload.length === 0) {
            return null;
        }
        return (
            <div style={{ fontSize: '14px', textAlign: 'center', background: 'AppWorkspace', fontFamily: 'sans-serif' }}>
                <p style={{ marginBottom: '5px', fontWeight: 'bold' }}>{label}</p>
                {payload.map((entry) => {
                    // Условие для скрытия легенды для линии
                    if (entry.dataKey !== 'type') { // Здесь проверяем dataKey
                        return (
                            <div key={entry.dataKey} style={{ marginBottom: '5px' }}>

                                <span style={{ color: entry.color }}>{entry.dataKey}: {entry.value} {'    '}</span>
                            </div>
                        );
                    }
                    return null;
                })}
            </div>
        );
    }


    const handleClick = (chartData: CombinedData | undefined) => {
        if (chartData) {
            const date = chartData.date;
            setModalDate(date);
            console.log('Clicked date:', date);
            const filteredDelays = data.filter((delay) => new Date(delay.delayDate).toISOString().split('T')[0] === date)
            .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
            setModalDelays(filteredDelays);
            setShowModal(true);
        } else {
            console.log('No data available');
        }
    };

    const closeModal = () => {
        setShowModal(false);
    }


    return (
        <Card className="mt-2 text-center bg-body-primary">
            <Card.Header><h5>Простои</h5></Card.Header>
            <Card.Body style={{ overflowX: 'auto' }}>
                <Col className="col-12 " style={{ minWidth: '500px', width: '100%', height: '278px' }}>
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
                        onClick={(data) => handleClick(data?.activePayload?.[0]?.payload)}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis type="number" hide />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend content={<CustomLegend />} />
                        {/* {combinedData.length > 0 && Object.keys(combinedData[0]).filter(key => key !== 'date' && key !== 'totalTime').map((key, index) => { */}
                        {combinedData.length > 0 && delayTypeName.map((key, index) => {
                            console.log("Rendering Bar for key:", key);
                            return (
                                <Bar
                                    key={key}
                                    dataKey={key}
                                    stackId="a"
                                    fill={COLORS[index % COLORS.length] || '#E6399B'}
                                    legendType='circle'

                                >


                                </Bar>
                            )
                        })}
                        <Line type="monotone" dot={false} dataKey="totalTime" stroke='transparent'
                            label={{ fill: 'blue', fontSize: 12, position: 'top' }}
                            legendType='none' 
                            />
                    </ComposedChart>
                </ResponsiveContainer>
                </Col>
            </Card.Body>
            <Card.Footer>
                <DelaysModal date={modalDate} delays={modalDelays} onHide={closeModal} show={modalShow} />
            </Card.Footer>
        </Card>
    );
}

export default DelaysChartBoard;
