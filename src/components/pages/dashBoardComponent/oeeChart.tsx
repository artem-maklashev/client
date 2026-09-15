import { Card } from "primereact/card"
import React, { useEffect, useState } from "react"
import { Col, Container } from "react-bootstrap"
import BoardProduction from "../../../model/production/BoardProduction"
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Legend, Line, Tooltip, ReferenceLine } from "recharts";
import Delays from "../../../model/delays/Delays";
import ApiService from "../../../service/ApiService";
import { Accordion, AccordionTab } from "primereact/accordion";

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
            const { date = '', bruttoProduction = 0, delaysTime = 0, oee = 0, startTime = '', nettoProduction = 0, plantime = 0 } = payload[0]?.payload || {};
            return (
                <div className="custom-tooltip" style={{ background: 'transparent ' }}>
                    <strong>
                        <p className="label">{`Дата: ${date}`}</p>
                        <p className="label">{`Начало производства: ${startTime ? startTime.substring(0, 5) : ''}`}</p>
                        <p className="label">{`Заформовано: ${Number(bruttoProduction).toFixed(0)} м2`}</p>
                        <p className="label">{`Товар: ${Number(nettoProduction).toFixed(0)} м2`}</p>
                        <p className="label">{`Плановое время: ${Number(plantime).toFixed(0)}`}</p>
                        <p className="intro">{`Время простоев: ${Number(delaysTime).toFixed(0)}`}</p>
                        <p className="desc">{`OEE: ${(Number(oee)).toFixed(2)}`}</p>
                    </strong>
                </div>
            );
        }

        return null;
    };


    // Функция для форматирования подписи в легенде
    const legendFormatter = (value: string) => {
        switch (value) {
            case 'oee':
                return 'OEE';
            case 'availability':
                return 'Доступность';
            case 'performance':
                return 'Производительность';
            case 'quality':
                return 'Качество';
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
                const date = ApiService.formatDateToISO(new Date(item.productionList.productionDate)).split('T')[0];
                const startTime = ApiService.formatDateToISO(new Date(item.productionList.productionStart)).split('T')[1];
                const plantime = (new Date(item.productionList.productionFinish).getTime() - new Date(item.productionList.productionStart).getTime()) / (1000 * 60);
                const productionSpeed = item.product.productionSpeed;
                const width = Number(item.product.width.value.replace(",", ".")) / 1000;

                // Группируем по дате + смене + виду ГК: внутри одной смены все категории
                // (заформовано / товар) попадают в одну запись, даже если время начала
                // у строк отчёта отличается. Иначе brutto и netto разъезжаются по разным
                // точкам и OEE не может быть посчитан (все линии на нуле).
                const existingData = data.find((d) =>
                    d.date === date
                    && d.shiftId === item.productionList.shift.id
                    && d.gypsumBoardId === item.product.id);

                if (existingData) {
    // Не трогаем existingData.plantime!
    if (item.category.id === 1) {
        existingData.bruttoProduction += item.value;
    } else if (item.category.id === 2 || item.category.id === 3 || item.category.id === 4) {
        existingData.nettoProduction += item.value;
    }
} else {
    data.push({
        date,
        startTime,
        plantime, // Устанавливается один раз для группы
        delaysTime: 0,
        gypsumBoardId: item.product.id,
        productionSpeed,
        width,
        bruttoProduction: item.category.id === 1 ? item.value : 0,
        nettoProduction: (item.category.id >= 2 && item.category.id <= 4) ? item.value : 0,
        oee: 0,
        availability: 0,
        performance: 0,
        quality: 0,
        shiftId: item.productionList.shift.id,
    });
}
            });

            delaysData.forEach((item) => {
                const delayDate = ApiService.formatDateToISO(new Date(item.delayDate)).split('T')[0];
                const existingData = data.find((d) =>
                    d.date === delayDate
                    && d.shiftId === item.shift?.id
                    && d.gypsumBoardId === item.product?.id);
                if (existingData) {
                    const delayMinutes = (new Date(item.endTime).getTime() - new Date(item.startTime).getTime()) / (1000 * 60);
                    if (!isNaN(delayMinutes) && delayMinutes > 0) {
                        existingData.delaysTime += delayMinutes;
                    }
                }
            });

            data.forEach((item) => {
                const hasTime = item.plantime > 0;
                const hasSpeed = item.width > 0 && item.productionSpeed > 0;
                const workingTime = item.plantime - item.delaysTime;

                // Availability (Доступность)
                item.availability = hasTime
                    ? Math.max(0, Math.min(1, workingTime / item.plantime))
                    : 0;

                // Performance (Производительность) = факт/(рабочее время) / (ширина*скорость)
                item.performance = (hasTime && hasSpeed && item.bruttoProduction > 0 && workingTime > 0)
                    ? (item.bruttoProduction / workingTime) / (item.width * item.productionSpeed)
                    : 0;

                // Quality (Качество) = товар / заформовано
                item.quality = (item.bruttoProduction > 0)
                    ? Math.max(0, Math.min(1, item.nettoProduction / item.bruttoProduction))
                    : 0;

                // OEE
                item.oee = item.availability * item.performance * item.quality;
            });

            data.sort((a, b) => {
                const timeA = new Date(`${a.date}T${a.startTime}`).getTime();
                const timeB = new Date(`${b.date}T${b.startTime}`).getTime();
                return (isNaN(timeA) ? 0 : timeA) - (isNaN(timeB) ? 0 : timeB);
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
                <Accordion>
                    <AccordionTab header="показать график" className="flex align-items-center gap-2 w-full">
                        <Col
                            className="col-12"
                            style={{ minWidth: '500px', width: '100%', height: '350px', padding: '10px' }}
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
                                        domain={['auto', 'auto']}
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
                                        // strokeDasharray="5 5" // Пунктирная линия
                                        strokeWidth={1} // Тонкая линия
                                    // activeDot={{ r: 6, fill: '#ff6b6b' }}
                                    />
                                    {/* Линия Performance (пунктирная, тонкая, другой цвет) */}
                                    <Line
                                        yAxisId="left"
                                        type="monotone"
                                        dataKey="performance"
                                        stroke="#6bff6b" // Зеленый цвет
                                        // strokeDasharray="5 5" // Пунктирная линия
                                        strokeWidth={1} // Тонкая линия
                                    // activeDot={{ r: 6, fill: '#6bff6b' }}
                                    />
                                    {/* Линия Quality (пунктирная, тонкая, другой цвет) */}
                                    <Line
                                        yAxisId="left"
                                        type="monotone"
                                        dataKey="quality"
                                        stroke="#ffa500" // Оранжевый цвет
                                        // strokeDasharray="5 5" // Пунктирная линия
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
                                    <ReferenceLine
                                        yAxisId="left"
                                        y={1} // Значение константы
                                        stroke="black" // Цвет линии
                                        // strokeDasharray="3 3" // Пунктирная линия
                                        strokeWidth={2} // Толщина линии
                                        label={{ value: '1', position: 'right', fill: '#888', fontSize: 12 }} // Подпись линии
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </Col>
                    </AccordionTab>
                </Accordion>
            </Card>

        </Container>
    )
}
export default OeeChart;