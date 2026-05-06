import { CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis, Tooltip, Bar, ComposedChart, Line, LegendProps, TooltipProps, RectangleProps } from "recharts";
import Delays from "../../../model/delays/Delays";
import { Card, Col, Container } from "react-bootstrap";
import React, { useEffect, useMemo, useState } from "react";
import { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent";
import DelaysModal from "./delaysModal";
import { DelaysByTypeDTO } from "../../../model/DTO/gypsumboard/delays/DelaysByTypeDTO";

interface DelaysChartBoardProps {
    delays: DelaysByTypeDTO[];
    rawDelays: Delays[];
}


interface CombinedData {
    date: string;
    [key: string]: number | string;    
    totalTime: number;
    // delayTypes: DelayData;
}

interface CustomLegendPayload {
    value: string;
    color: string;
    dataKey: string; // Добавляем dataKey для типизации
}

interface CustomLegendProps extends LegendProps {
    payload?: CustomLegendPayload[]; // payload может быть undefined
}

type RoundedBarProps = RectangleProps & {
    radius?: number;
};



const DelaysChartBoard: React.FC<DelaysChartBoardProps> = ({ delays, rawDelays }) => {
    const [data, setData] = useState<DelaysByTypeDTO[]>(delays);
    const [rawData, setRawData] = useState<Delays[]>([]);
    // const [combinedData, setCombinedData] = useState<CombinedData[]>([]);
    const [modalDelays, setModalDelays] = useState<Delays[]>([]);
    const [modalShow, setShowModal] = useState<boolean>(false);
    const [modalDate, setModalDate] = useState<string>('');
    const [delayTypeName, setDelayTypeName] = useState<string[]>([]);

    useEffect(() => {
        if (delays) {
            setData(delays);
        }
    }, [delays]);

    useEffect(() => {
        if (rawDelays) {
            setRawData(rawDelays);
        }
    }, [rawDelays]);

    // Вычисляем длительность задержки в минутах
    function getDeltaTime(delay: Delays): number {
        return (new Date(delay.endTime).getTime() - new Date(delay.startTime).getTime()) / (1000 * 60);
    }

    // function sortDelayTypes<T extends { name: string }>(types: T[]): T {
    //     // Сортировка типов задержек (по алфавиту)
    //     return types.sort((a, b) => a.name.localeCompare(b.name));
    //     // return types;
    // }


    // useEffect(() => {
    //     if (data) {
    //         const groupedData = useMemo(() =>
    //             delays.map(dto => ({
    //                 date: dto.getDate(),
    //                 totalTime: dto.getTotalTime(),
    //                 ...dto.getDelayTypes()
    //             })),
    //             [delays]
    //         );
            

    //     //     data.sort((a, b) => new Date(a.delayDate).getTime() - new Date(b.delayDate).getTime()).forEach((item) => {
    //     //         const dateStr = new Date(item.delayDate).toISOString().split('T')[0];
    //     //         const existingEntry = groupedData.find((entry) => entry.date === dateStr);

    //     //         if (existingEntry) {
    //     //             existingEntry[item.delayType.name] = (existingEntry[item.delayType.name] as number || 0) + getDeltaTime(item);
    //     //         } else {

    //     //             groupedData.push({
    //     //                 date: dateStr,
    //     //                 totalTime: 0,
    //     //                 // Ключи добавляются в отсортированном порядке
    //     //                 // ...sortedDelayTypes.reduce((obj, type) => ({ ...obj, type: 0 }), {})
    //     //                 [item.delayType.name]: getDeltaTime(item) || 0,
    //     //             });
    //     //         }
    //     //     });

    //     //     groupedData.forEach((item) => {
    //     //         item.totalTime = Object.keys(item)
    //     //             .filter((key) => key !== "date" && key !== "totalTime")
    //     //             .reduce((sum, key) => sum + (item[key] as number), 0);
    //     //     });


    //         setCombinedData(data as CombinedData[]);
    //     }
    // }, [data]);

    const combinedData = useMemo(() => {
        if (!delays || delays.length === 0) return [];

        return delays.map(dto => ({
            date: dto.getDate(),
            totalTime: dto.getTotalTime(),
            ...dto.getDelayTypes()   // разворачивает Record<string, number>
        }));
    }, [delays]);

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

    // const RoundedBar: React.FC<RoundedBarProps> = (props) => {
    //     const { x, y, width, height, fill, radius = 6 } = props;
    
    //     // Проверка на валидность координат
    //     if (x === undefined || y === undefined || width === undefined || height === undefined) {
    //         console.error("Invalid props for RoundedBar:", { x, y, width, height });
    //         return null;
    //     }
    
    //     // Убедиться, что радиус не превышает половину высоты
    //     const adjustedRadius = Math.min(radius, height / 2);
    
    //     return (
    //         <path
    //             d={`M${x},${y + height} 
    //                L${x},${y + adjustedRadius} 
    //                Q${x},${y} ${x + adjustedRadius},${y} 
    //                L${x + width - adjustedRadius},${y} 
    //                Q${x + width},${y} ${x + width},${y + adjustedRadius} 
    //                L${x + width},${y + height} 
    //                Z`}
    //             fill={fill}
    //         />
    //     );
    // };


    const handleClick = (chartData: CombinedData | undefined) => {
        if (chartData) {
            const date = chartData.date;
            setModalDate(date);
            console.log('Clicked date:', date);
            const filteredDelays = rawData.filter((delay) => new Date(delay.delayDate).toISOString().split('T')[0] === date)
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


        <Card className="mt-2 text-center shadow-sm border-0" style={{ backgroundColor: '#f9f9f9' }}>
            <Card.Header className=" text-center py-2"><h5 className="m-0 ">Простои</h5></Card.Header>
            <Card.Body style={{ overflowX: 'auto' }} >
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
                            <XAxis dataKey="date"
                                tick={{ fontSize: 12, fill: '#555' }}
                                axisLine={{ stroke: '#888' }}
                                tickLine={{ stroke: '#888' }} />
                            <YAxis type="number" hide />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend content={<CustomLegend />} />
                            {/* {combinedData.length > 0 && Object.keys(combinedData[0]).filter(key => key !== 'date' && key !== 'totalTime').map((key, index) => { */}
                            {combinedData.length > 0 &&
                                delayTypeName.map((key, index) => {
                                    console.log("Rendering Bar for key:", key);
                                    const isLastBar = index === delayTypeName.length - 1; // Проверяем, последний ли это элемент
                                    // const isTopBar = combinedData.some(
                                    //     (item) => item[key] !== undefined &&
                                    //         item[key] === Math.max(
                                    //             ...Object.keys(item)
                                    //                 .filter(k => k !== 'date' && k !== 'totalTime')
                                    //                 .map(k => Number(item[k] || 0)) // Приведение к числу
                                    //         )
                                    // );
                                    // const isTopBar = combinedData.some((item) => {
                                    //     // Собираем список всех ключей, кроме служебных
                                    //     const keys = Object.keys(item).filter(k => k !== 'date' && k !== 'totalTime');
                                        
                                    //     // Находим последний ключ по порядку
                                    //     const lastKey = keys[keys.length - 1];
                                    //     // Сравниваем текущий ключ (key) с найденным lastKey
                                    //     return lastKey === key;
                                    // });
                                    // const isLastBar = combinedData.filter(k => k !== 'date' && k !== 'totalTime')[combinedData.length - 1][key] !== undefined;

                                    
                                    
                                    
                                    return (
                                        <Bar
                                            key={key}
                                            dataKey={key}
                                            stackId="a"
                                            fill={COLORS[index % COLORS.length] || '#E6399B'}
                                            legendType="circle"
                                            // shape={<RoundedBar radius={isLastBar ? 8 : 0} />}
                                        />
                                    );
                                })}

                            <Line type="monotone" dot={false} dataKey="totalTime" stroke='transparent'
                                label={{ fill: 'blue', fontSize: 12, position: 'top' }}
                                legendType='none'
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </Col>
                <DelaysModal date={modalDate} delays={modalDelays} onHide={closeModal} show={modalShow} />
            </Card.Body>
        </Card>

    );
}

export default DelaysChartBoard;
