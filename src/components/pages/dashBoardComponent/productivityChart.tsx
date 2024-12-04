import { Card } from "primereact/card"
import React, { useEffect, useState } from "react"
import { Col, Container } from "react-bootstrap"
import BoardProduction from "../../../model/production/BoardProduction"
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Legend, Line, Tooltip } from "recharts";
import Delays from "../../../model/delays/Delays";
import ApiService from "../../../service/ApiService";

interface ProductivityChartProps {
    productions: BoardProduction[];
    delays: Delays[];
}

interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{ payload: any }>;  // Упрощено для обработки различных типов данных
}

interface LineChartPayload {
    payload: {
        [key: string]: string | number; // Замените any на конкретные типы данных, если они известны
    };
}

interface CombinedData { 
    date: string;
    value: number;
    time: number;
    productivity: number;
}

const ProductivityChart: React.FC<ProductivityChartProps> = ({productions, delays}) => {
    
    const [productionData, setProductionData] = useState<BoardProduction[]>([]);
    const [delaysData, setDelaysData] = useState<Delays[]>([]);
    const [combinedData, setCombinedData] = useState<CombinedData[]>([]);
    
    const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
        if (active && payload && payload.length) {
            // Убедитесь, что данные корректно обрабатываются
            const { date, value, time, productivity } = payload[0]?.payload || {};
            return (
                <div className="custom-tooltip" style={{ background: 'transparent ' }}>
                    <strong>
                        <p className="label">{`Дата: ${date}`}</p>
                        <p className="label">{`Заформовано: ${value.toFixed(0)} м2`}</p>
                        <p className="intro">{`Время простоев: ${time.toFixed(0)}`}</p>
                        <p className="desc">{`Производительность: ${(productivity).toFixed(0)}`}</p>
                    </strong>
                </div>
            );
        }

        return null;
    };


    // Функция для форматирования подписи в легенде
    const legendFormatter = (value: string) => {
        switch (value) {
            case 'productivity':
                return 'Производительность';
            case 'planValue':
                return 'Плановое значение';
            case 'productionValue':
                return 'Фактическое производство';
            case 'defectPercent':
                return 'Процент брака'
            default:
                return value;
        }
    };
    
    useEffect(() => {
        setProductionData(productions.filter(p => p.category.id === 1));
    }, [productions]);
    
    useEffect(() => { 
        setDelaysData(delays);
    }, [delays]);

    const getCombinedData = () => {
        const data: CombinedData[] = [];

        productionData.map((item) => {
            const existingData = data.find((d) => d.date === ApiService.formatDateToISO(item.productionList.productionDate).split('T')[0]);
            const thickness = Number(item.product.thickness.value.replace(",","."));
            console.log('Толщина', thickness);
            const normalizedValue =  thickness * item.value / 12.5;
            if (existingData) {
                existingData.value += normalizedValue;
            } else {
                data.push({
                    date: ApiService.formatDateToISO(item.productionList.productionDate).split('T')[0],
                    value: normalizedValue,
                    time: 0,
                    productivity: 0,
                });
            }
        });
        delaysData.map((item) => {
            const existingData = data.find((d) => d.date === ApiService.formatDateToISO(item.delayDate).split('T')[0]);
            if (existingData) {
                existingData.time += (new Date(item.endTime).getTime() - new Date(item.startTime).getTime()) / (1000 * 60);
            } else {
                data.push({
                    date: ApiService.formatDateToISO(item.delayDate).split('T')[0],
                    value: 0,
                    time: (new Date(item.endTime).getTime() - new Date(item.startTime).getTime()) / (1000 * 60),
                    productivity: 0,
                });
            }
        });
        data.forEach((item) => {(item.productivity = item.value /(1440- item.time)) });
        return data;
    }

    useEffect(() => {
        if (productionData) {
            setCombinedData(getCombinedData());
        }
    }, [productionData, delaysData]);


    return (
        <Container>
            <Card title="Производительность при толщине 12,5 мм" className="mb-3 text-center" style={{ width: '100%' , fontSize: 13}}>
                <Col className="col-12 " style={{ minWidth: '500px', width: '100%', height: '278px' }}>
                    <ResponsiveContainer>
                        <LineChart
                            title="Производительность линии"
                            width={500}
                            height={300}
                            data={combinedData}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                            // onClick={(data) => handleClick(data?.activePayload?.[0]?.payload)}

                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" padding={{ left: 30, right: 30 }} />
                            <YAxis yAxisId="left" />
                            {/* <YAxis yAxisId="right" orientation="right" label={{ value: '%', position: 'right' }} domain={[0, 'dataMax + 5']} /> */}
                            <Tooltip content={<CustomTooltip />} />
                            <Legend formatter={legendFormatter} />
                            <Line yAxisId="left" type="monotone" dataKey="productivity" stroke="#8884d8" activeDot={{ r: 8, }} strokeWidth={3} />
                            {/* <Line yAxisId="left" type="monotone" dataKey="productionValue" stroke="#FF1493" activeDot={{ r: 8 }} strokeWidth={3} /> */}
                            {/* <Line yAxisId="right" type="step" dataKey="defectPercent" stroke="#82ca9d" strokeWidth={2} /> */}

                        </LineChart>
                    </ResponsiveContainer>
                </Col>
            </Card>
        </Container>
    )
}
export default ProductivityChart;