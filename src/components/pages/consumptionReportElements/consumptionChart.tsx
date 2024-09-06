import React, { useEffect, useState } from "react";
import GypsumBoard from "../../../model/gypsumBoard/GypsumBoard";
import BoardProduction from "../../../model/production/BoardProduction";
import ApiService from "../../../service/ApiService";
import MaterialConsumption from "../../../model/specification/MaterialConsumption";
import Material from "../../../model/specification/Material";
import { Card, Col } from "react-bootstrap";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface ConsumptionChartProps {
    startDate: Date;
    endDate: Date;
    gypsumBoard: GypsumBoard | null;
    material: Material | null;
}

interface ChartData {
    productionValue: number;
    consumption: number;
    consumptionPerSquare: number;
    rate: number;
}

interface CombinedData {
    date: string;
    consumptionPerSquare: number;
    rate: number;
}

interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{ payload: CombinedData }>; 
}

const ConsumptionChart: React.FC<ConsumptionChartProps> = ({ startDate, endDate, gypsumBoard, material }) => {
    const [productions, setProduction] = useState<BoardProduction[]>([]);
    const [consumptions, setConsumptions] = useState<MaterialConsumption[]>([]);
    const [data, setData] = useState<{ [date: string]: ChartData }>({});
    const [chartData, setChartData] = useState<CombinedData[]>([]);

    const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const { date, consumptionPerSquare, rate } = payload[0]?.payload || {};
            return (
                <div className="custom-tooltip" style={{ background: 'transparent' }}>
                    <strong>
                        <p className="label">{`Дата: ${date}`}</p>
                        <p className="intro">{`Расход факт: ${consumptionPerSquare.toFixed(4)}`}</p>
                        <p className="intro">{`Норма: ${rate.toFixed(4)}`}</p>
                        <p className="desc">{`Отклонение: ${(consumptionPerSquare - rate).toFixed(4)}`}</p>
                    </strong>
                </div>
            );
        }
        return null;
    };

    useEffect(() => {
        if (gypsumBoard) {
            const fetchProduction = async () => {
                const production = await ApiService.fetchBoardProductionByGypsumBoardAndDate(
                    gypsumBoard,
                    startDate,
                    endDate
                );
                setProduction(production);
            }
            fetchProduction();
        }
    }, [startDate, endDate, gypsumBoard]);

    useEffect(() => {
        if (material) {
            const fetchConsumption = async () => {
                const consumption = await ApiService.fetchConsumptionsByDateAndMaterial(
                    startDate,
                    endDate,
                    material.id
                );
                setConsumptions(consumption);
            }
            fetchConsumption();
        }
    }, [startDate, endDate, material]);

    const processData = (
        productions: BoardProduction[],
        consumptions: MaterialConsumption[]
    ): { [date: string]: ChartData } => {
        const draftData: { [date: string]: ChartData } = {};

        productions.forEach((production) => {
            const date = new Date(production.productionList.productionDate).toLocaleDateString();
            const consumption = consumptions.find(c => c.productionList.id === production.productionList.id)?.quantity || 0;
            const existingData = draftData[date];

            if (existingData) {
                existingData.productionValue += production.value;
                existingData.consumption += consumption;
            } else {
                draftData[date] = {
                    productionValue: production.value,
                    consumption,
                    consumptionPerSquare: 0,
                    rate: 0
                };
            }
        });

        Object.keys(draftData).forEach((date) => {
            const data = draftData[date];
            data.consumptionPerSquare = data.productionValue !== 0 ? data.consumption / data.productionValue : 0;
        });

        return draftData;
    };

    useEffect(() => {
        if (productions.length > 0 && consumptions.length > 0) {
            const draftData = processData(productions, consumptions);
            setData(draftData);
        }
    }, [consumptions, productions]);

    useEffect(() => {
        const combinedData: CombinedData[] = [];
        Object.keys(data).forEach((key) => {
            combinedData.push({
                date: key,
                consumptionPerSquare: data[key].consumptionPerSquare,
                rate: data[key].rate
            });
        });
        setChartData(combinedData);
    }, [data]);

    return (
        <Card className="mt-lg-5 text-center bg-body-primary">
            <Card.Header>               
                <h5>{gypsumBoard === null || gypsumBoard === undefined ? "GypsumBoard is null" : ApiService.getName(gypsumBoard)} расход {material ? material.name : ""} на м²</h5>
            </Card.Header>
            <Card.Body style={{ overflowX: 'auto' }}>
                <Col className="col-12" style={{ minWidth: '500px', width: '100%', height: '278px' }}>
                    <ResponsiveContainer>
                        <LineChart
                            width={500}
                            height={300}
                            data={chartData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis yAxisId="left" />
                            <Tooltip content={<CustomTooltip />} />
                            <Line yAxisId="left" type="monotone" dataKey="consumptionPerSquare" stroke="#8884d8" activeDot={{ r: 8 }} strokeWidth={3} />
                            <Line yAxisId="left" type="monotone" dataKey="rate" stroke="#FF1493" activeDot={{ r: 8 }} strokeWidth={3} />
                        </LineChart>
                    </ResponsiveContainer>
                </Col>
            </Card.Body>
        </Card>
    );
}

export default ConsumptionChart;
