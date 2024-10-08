import React, { useEffect, useState } from "react";
import Material from "../../../model/specification/Material";
import ApiService from "../../../service/ApiService";
import MaterialConsumption from "../../../model/specification/MaterialConsumption";
import { Card, Col, Container } from "react-bootstrap";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface SummaryConsumptionProps {
    startDate: Date;
    endDate: Date;
    material: Material | null;
}

interface ChartData {
    date: string;
    totalValue: number;
}

const SummaryConsumptionBarChart: React.FC<SummaryConsumptionProps> = ({ startDate, endDate, material }) => {

    const [consumptions, setConsumptions] = useState<MaterialConsumption[]>([]);
    const [chartData, setChartData] = useState<ChartData[]>([]);

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

    useEffect(() => {
        if (consumptions.length > 0) {
            const data: ChartData[] = [];
            consumptions.forEach((cons) => {
                const date = new Date(cons.productionList.productionDate).toLocaleDateString();
                const existingData = data.find(d => d.date === date);
                if (existingData) {
                    existingData.totalValue += Number(cons.quantity.toFixed(0));
                } else {
                    data.push({ date: date, totalValue: Number(cons.quantity.toFixed(0)) });
                }
            });
            data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            setChartData(data);
            console.log(material);
        }
    }, [consumptions, material]);

    useEffect(() => {
        if (chartData.length > 0) {
            console.log(JSON.stringify(chartData));
        }
    }, [chartData]);

    return (
        <Container>
            <Card className="text-center bg-body-primary">
                <Card.Title>Суммарный расход: {material?.name}</Card.Title>
                <Card.Body style={{ overflowX: 'auto' }}>
                    <Col className="col-12" style={{ minWidth: '500px', width: '100%', height: '278px' }}>
                        <ResponsiveContainer>
                            <BarChart data={chartData} margin={{top: 20}}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                {/* <Legend /> */}
                                <Bar dataKey="totalValue" fill="#8884d8" label={{position: 'top'}}/>
                            </BarChart>
                        </ResponsiveContainer>
                    </Col>
                    <Card.Footer>Средний расход в день {
                        (chartData.reduce((acc, item) => acc + item.totalValue, 0)/chartData.length).toFixed(0)
                        }</Card.Footer>
                </Card.Body>
            </Card>
        </Container>
    );
}
export default SummaryConsumptionBarChart;