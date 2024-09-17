import React, { useEffect, useState } from "react";
import BoardProduction from "../../../model/production/BoardProduction";

import { BarChart, CartesianGrid, XAxis, YAxis, Bar, Cell, ResponsiveContainer } from "recharts";
import { Card, Col } from "react-bootstrap";

interface ShiftDefectProps {
    shiftProduction: BoardProduction[];
}

interface ShiftDefect {
    name: string;
    total: number;
    fact: number;
}

interface ShiftDefectPercent {
    name: string;
    percent: number;
}

const ShiftDefects: React.FC<ShiftDefectProps> = ({ shiftProduction }) => {
    const [data, setData] = useState<ShiftDefectPercent[]>([]);

    useEffect(() => {
        if (shiftProduction) {
            const sortedData = shiftProduction.filter((production) => production.category.id <= 4);
            const draftData: ShiftDefect[] = [];
            sortedData.forEach((production) => {
                const existingShift = draftData.find((item) => item.name === production.productionList.shift.name);
                if (!existingShift) {
                    if (production.category.id === 1) {
                        draftData.push({ name: production.productionList.shift.name, total: production.value, fact: 0 });
                    } else {
                        draftData.push({ name: production.productionList.shift.name, total: 0, fact: production.value });
                    }
                } else {
                    if (production.category.id === 1) {
                        existingShift.total += production.value;
                    } else {
                        existingShift.fact += production.value;
                    }
                }
            });

            const percents: ShiftDefectPercent[] = draftData.map((item) => {
                return { name: item.name, percent: item.total ? Number(((item.total - item.fact) * 100 / item.total).toFixed(2)) : 0 }
            });
            percents.sort((a, b) => a.name.localeCompare(b.name));
            setData(percents);

        }
    }, [shiftProduction]);


    const getPath = (x: number, y: number, width: number, height: number) => {
        return `M${x},${y + height}C${x + width / 3},${y + height} ${x + width / 2},${y + height / 3}
        ${x + width / 2}, ${y}
        C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${x + width}, ${y + height}
        Z`;
    };

    const TriangleBar = (props: any) => {
        const { fill, x, y, width, height } = props;

        return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
    };

    const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', 'red', 'pink'];

    return (
        <Col className="col-12 mt-2" >
            <Card>
                <Card.Header className='text-center'><h5>Брак по сменам</h5></Card.Header>
                <Card.Body style={{ width: '100%', height: '300px', marginTop: '1px' }} className='d-flex justify-content-center align-items-center'>
                    <ResponsiveContainer width={'100%'} height={'100%'}>
                        <BarChart
                            width={400}
                            height={300}
                            data={data}
                            margin={{
                                top: 20,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis hide />
                            <Bar dataKey="percent" fill="#8884d8" shape={<TriangleBar />} label={({ x, y, width, value }) => (
                                <text
                                    x={x + 10 + width / 2}
                                    y={y - 10}
                                    fill="#8884d8"
                                    textAnchor="middle"
                                    fontWeight='bold'
                                >
                                    {`${value} %`}
                                </text>
                            )}>
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={colors[index % 20]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </Card.Body>
            </Card>
        </Col>
    );
}

export default ShiftDefects;