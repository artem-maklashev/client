import { Card } from "primereact/card"
import React, { useEffect, useState } from "react"
import { Col, Container } from "react-bootstrap"
import BoardProduction from "../../../model/production/BoardProduction"
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Legend, Line, Tooltip, ReferenceLine } from "recharts";
import Delays from "../../../model/delays/Delays";
import ApiService from "../../../service/ApiService";

interface OeeChartProps {
    productions: BoardProduction[];
    delays: Delays[];
}

interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{ payload: any }>;  // Упрощено для обработки различных типов данных
}

interface CombinedData {
    date: string;
    startTime: string;
    shiftId: number;
    gypsumBoardId: number;
    plantime: number;
    delaysTime: number;
    width: number;
    productionSpeed: number;
    bruttoProduction: number;
    nettoProduction: number;
    availability: number;
    performance: number;
    quality: number;
    oee: number;
}

const OeeChart: React.FC<OeeChartProps> = ({ productions, delays }) => {

    const [productionData, setProductionData] = useState<BoardProduction[]>([]);
    const [delaysData, setDelaysData] = useState<Delays[]>([]);
    const [combinedData, setCombinedData] = useState<CombinedData[]>([]);

    const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
        if (active && payload && payload.length) {
            // Убедитесь, что данные корректно обрабатываются
            const { date, bruttoProduction, delaysTime, oee, startTime,  nettoProduction, plantime } = payload[0]?.payload || {};
            return (
                <div className="custom-tooltip" style={{ background: 'transparent ' }}>
                    <strong>
                        <p className="label">{`Дата: ${date}`}</p>
                        <p className="label">{`Начало смены: ${startTime}`}</p>
                        <p className="label">{`Заформовано: ${bruttoProduction.toFixed(0)} м2`}</p>
                        <p className="label">{`Товар: ${nettoProduction.toFixed(0)} м2`}</p>
                        <p className="label">{`Плановое время: ${plantime.toFixed(0)}`}</p>
                        <p className="intro">{`Время простоев: ${delaysTime.toFixed(0)}`}</p>
                        <p className="desc">{`"Эффективность": ${(oee).toFixed(0)}`}</p>
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
        setProductionData(productions);
    }, [productions]);

    useEffect(() => {
        setDelaysData(delays);
    }, [delays]);



    useEffect(() => {
        const getCombinedData = () => {
            const data: CombinedData[] = [];

            productionData.forEach((item) => {
                const existingData = data.find((d) => d.date === ApiService.formatDateToISO(item.productionList.productionDate).split('T')[0] 
                && d.startTime === ApiService.formatDateToISO(item.productionList.productionStart).split('T')[1] && d.shiftId === item.productionList.shift.id && d.gypsumBoardId === item.product.id);
                const productionSpeed = item.product.productionSpeed;
                const width = Number(item.product.width.value.replace(",", "."))/1000;
                if (existingData) {
                    if (item.category.id === 1) {
                        existingData.bruttoProduction += item.value;
                    } else if (item.category.id === 2 || item.category.id === 3) {
                        existingData.nettoProduction += item.value;
                    }      
                } else {
                    data.push({
                        date: ApiService.formatDateToISO(item.productionList.productionDate).split('T')[0],
                        startTime: ApiService.formatDateToISO(item.productionList.productionStart).split('T')[1], 
                        plantime: (new Date(item.productionList.productionFinish).getTime() - new Date(item.productionList.productionStart).getTime())/(1000*60),
                        delaysTime: 0,
                        gypsumBoardId: item.product.id,
                        productionSpeed: productionSpeed,
                        width: width,
                        bruttoProduction: item.category.id === 1 ? item.value : 0 ,
                        nettoProduction: item.category.id === 2 || item.category.id === 3 || item.category.id === 4 ? item.value: 0,
                        oee: 0,
                        availability: 0,
                        performance: 0,
                        quality: 0,
                        shiftId: item.productionList.shift.id,
                    });
                }
            });
            delaysData.forEach((item) => {
                const existingData = data.find((d) => d.date === ApiService.formatDateToISO(item.delayDate).split('T')[0] 
                && d.shiftId === item.shift.id && d.gypsumBoardId === item.product.id);
                if (existingData) {
                    existingData.delaysTime += (new Date(item.endTime).getTime() - new Date(item.startTime).getTime())/(1000*60); 
                }                 
            });
            
            data.forEach((item) => {
                if (item.bruttoProduction && item.plantime && item.width && item.productionSpeed && item.nettoProduction) {
                    // Availability (Доступность)
                    item.availability = (item.plantime - item.delaysTime) / item.plantime;
            
                    // Performance (Производительность)
                    item.performance = (item.bruttoProduction / (item.plantime - item.delaysTime)) / 
                                        (item.width * item.productionSpeed);
            
                    // Quality (Качество)
                    item.quality = item.nettoProduction / item.bruttoProduction;
            
                    // OEE
                    item.oee = item.availability * item.performance * item.quality;
                    // console.log( performance, item.oee, "planTime:", item.plantime, "delaysTime:", item.delaysTime);
                    // if (item.plantime < 0)  {
                    //     console.log("отрицательное время", "дата", item.date);
                    // }
                    if (item.performance === 0) {
                        console.log("perfomance равен 0", item.bruttoProduction, item.plantime,item.delaysTime,item.width, item.productionSpeed)}
                } else {
                    item.oee = 0; // Если данные отсутствуют, OEE = 0
                    console.log("perfomance равен 0", item.bruttoProduction, item.plantime,item.delaysTime,item.width, item.productionSpeed);
                }
            });
            data.sort((a, b) => {
                const dateTimeA = `${a.date}T${a.startTime}Z`;
                const dateTimeB = `${b.date}T${b.startTime}Z`;
                return new Date(dateTimeA).getTime() - new Date(dateTimeB).getTime();
            });
            return data;
        }
        if (productionData) {
            setCombinedData(getCombinedData());
        }
    }, [productionData, delaysData]);


    return (
        <Container>
            <Card
                title={<h5 style={{ fontSize: '14px', fontWeight: 'bold', color: '#4a4a4a' }}>Общая эффективность оборудования</h5>}
                className="mb-2 mt-2 text-center shadow-sm"
                style={{ width: '100%', borderRadius: '8px', padding: '10px', backgroundColor: '#f9f9f9', overflowX: 'auto' }}
            > 
                <Col
                    className="col-12"
                    style={{ minWidth: '500px', width: '100%', height: '250px', padding: '10px' }}
                >
                    <ResponsiveContainer>
    <LineChart
        data={combinedData}
        margin={{
            top: 20,
            right: 20,
            left: 20,
            bottom: 20,
        }}
    >
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis
            dataKey="date"
            padding={{ left: 20, right: 20 }}
            tick={{ fontSize: 12, fill: '#555' }}
            axisLine={{ stroke: '#888' }}
            tickLine={{ stroke: '#888' }}
        />
        <YAxis
            yAxisId="left"
            tick={{ fontSize: 12, fill: '#555' }}
            axisLine={{ stroke: '#888' }}
            tickLine={{ stroke: '#888' }}
        />
        <Tooltip
            contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #ddd', borderRadius: '5px', fontSize: '12px' }}
            itemStyle={{ color: '#555' }}
            content={<CustomTooltip />}
        />
        <Legend
            formatter={(value) => {
                const formattedValue = legendFormatter(value);
                return <span style={{ color: '#555', fontSize: '12px' }}>{formattedValue}</span>;
            }}
        />
        {/* Линия OEE (основная, жирная и сплошная) */}
        <Line
            yAxisId="left"
            type="monotone"
            dataKey="oee"
            stroke="#4a90e2" // Синий цвет
            activeDot={{ r: 8, fill: '#4a90e2' }}
            strokeWidth={3} // Толстая линия
        />
        {/* Линия Availability (пунктирная, тонкая, другой цвет) */}
        <Line
            yAxisId="left"
            type="monotone"
            dataKey="availability"
            stroke="#ff6b6b" // Красный цвет
            strokeDasharray="5 5" // Пунктирная линия
            strokeWidth={1} // Тонкая линия
            // activeDot={{ r: 6, fill: '#ff6b6b' }}
        />
        {/* Линия Performance (пунктирная, тонкая, другой цвет) */}
        <Line
            yAxisId="left"
            type="monotone"
            dataKey="performance"
            stroke="#6bff6b" // Зеленый цвет
            strokeDasharray="5 5" // Пунктирная линия
            strokeWidth={1} // Тонкая линия
            // activeDot={{ r: 6, fill: '#6bff6b' }}
        />
        {/* Линия Quality (пунктирная, тонкая, другой цвет) */}
        <Line
            yAxisId="left"
            type="monotone"
            dataKey="quality"
            stroke="#ffa500" // Оранжевый цвет
            strokeDasharray="5 5" // Пунктирная линия
            strokeWidth={1} // Тонкая линия
            // activeDot={{ r: 6, fill: '#ffa500' }}
        />
        <ReferenceLine
            yAxisId="left"
            y={0.85} // Значение константы
            stroke="#888" // Цвет линии
            // strokeDasharray="3 3" // Пунктирная линия
            strokeWidth={1} // Толщина линии
            label={{ value: 'Цель: 0.85', position: 'insideRight', fill: '#888', fontSize: 12 }} // Подпись линии
        />
    </LineChart>
</ResponsiveContainer>
                </Col>
            </Card>

        </Container>
    )
}
export default OeeChart;