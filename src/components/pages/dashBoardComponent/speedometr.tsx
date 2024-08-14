import React, { ReactNode } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import BoardProduction from '../../../model/production/BoardProduction';
import { Card, Col } from 'react-bootstrap';

interface SpeedometrProps {
    productionData: BoardProduction[];
}

const Speedometr: React.FC<SpeedometrProps> = ({ productionData }) => {
    const RADIAN = Math.PI / 180;

    interface DataItem {
        name: string;
        value: number;
        color: string;
    }

    const data: DataItem[] = [
        { name: '0 - 2 %', value: 2, color: '#00FF7F' },
        { name: '2 - 2.5 %', value: 0.5, color: '#FFA07A' },
        { name: '2.5 - 3%', value: 0.5, color: '#CD5C5C' },
    ];

    const cx = 135;
    const cy = 75;
    const iR = 50;
    const oR = 75;
    

    const totalValue = productionData
        .filter(production => production.category.id === 1)
        .reduce((acc, prod) => acc + prod.value, 0);


    const productionValue = productionData
        .filter(production => [2, 3, 4].includes(production.category.id))
        .reduce((acc, prod) => acc + prod.value, 0);

    const value = totalValue === 0 ? 0 : ((totalValue - productionValue) * 100) / totalValue;

    const needle = (
        value: number,
        cx: number,
        cy: number,
        iR: number,
        oR: number,
        color: string
    ): ReactNode[] => {
        let total = 0;
        data.forEach((v) => {
            total += v.value;
        });
        const angle =value<=total ? 180.0 * ( value / total) : 180;  // Преобразуем значение в угол в градусах
        const length = (iR + 2 * oR) / 3;   // Длина стрелки
        const sin = Math.sin(RADIAN * angle);
        const cos = Math.cos(RADIAN * angle);
        const r = 5;
        const x0 = cx;
        const y0 = cy;
        const xba = x0 - r * sin;
        const yba = y0 + r * cos;
        const xbb = x0 + r * sin;
        const ybb = y0 - r * cos;
        const xp = x0 - length * cos;
        const yp = y0 - length * sin;

        return [
            <circle key="circle" cx={x0} cy={y0} r={r} fill={color} stroke="none" />,
            <path
                key="path"
                d={`M${xba} ${yba}L${xbb} ${ybb} L${xp} ${yp} L${xba} ${yba}`}
                stroke="none"
                fill={color}
            />,
        ];
    };

    return (
        <Col className="col-12 mt-2" >
            <Card >
                <Card.Header className='text-center'>Процет брака</Card.Header>
                <Card.Body style={{ width: '100%', height: '150px' }}>
                    <h3 className='text-center'>{value.toFixed(2)} %</h3>
                    <ResponsiveContainer >
                        <PieChart width={200} height={100}>
                            <Pie
                                dataKey="value"
                                startAngle={180}
                                endAngle={0}
                                data={data}
                                cx={cx}
                                cy={cy}
                                innerRadius={iR}
                                outerRadius={oR}
                                fill="#8884d8"
                                stroke="none"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}                           
                            </Pie>
                            {needle(value, cx, cy, iR, oR, '#FF00FF')}
                        </PieChart>
                    </ResponsiveContainer>
                </Card.Body>
            </Card>
        </Col>
    );
};

export default Speedometr;
