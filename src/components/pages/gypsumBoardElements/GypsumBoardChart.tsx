import GypsumBoardInputData from "../../../model/inputData/GypsumBoardInputData";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend,
    Tooltip,
    ResponsiveContainer,
    LabelList
} from 'recharts';
import React from "react";
import { Card, Col } from "react-bootstrap";

interface GypsumBoardTableProps {
    raw_data: GypsumBoardInputData[];
}

const GypsumBoardChart: React.FC<GypsumBoardTableProps> = ({ raw_data }) => {
    if (raw_data.length === 0) {
        return (<div>Данных нет</div>);
    } else {
        console.log('Получены данные в размере ' + raw_data.length);
    }
    const data = raw_data.sort((a, b) => (a.factValue > b.factValue ? -1 : 1));
    const filteredData = data.filter(item => item.factValue >= 0);
    return (

        <Card style={{ width: '100%' }}>
            <div style={{ width: "100%", height: "800px", overflowY: 'scroll' }}>
                <div style={{ width: "100%", height: `${filteredData.length * 50}px` }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={filteredData}
                            layout="vertical"
                            margin={{ top: 5, right: 15, bottom: 20, left: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis xAxisId="first" type="number" dataKey="factValue" hide />
                            <XAxis xAxisId="second" type="number" dataKey="planValue" hide domain={[0, 'dataMax + 30000']} />
                            <YAxis
                                type="category"
                                dataKey="boardTitle"
                                tick={{ stroke: 'black', strokeWidth: 0.5, fontSize: 12 }}
                                width={180}
                            />
                            <Tooltip />
                            <Legend verticalAlign="top" height={36} />
                            <Bar dataKey="factValue" fill="#3498db" animationDuration={500} xAxisId="second">
                                <LabelList position="right" style={{ stroke: 'black', strokeWidth: 0.5 }} />
                            </Bar>
                            <Bar dataKey="planValue" fill="grey" animationDuration={450} xAxisId="second">
                                <LabelList position="right" />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </Card>

    );
};

export default GypsumBoardChart;