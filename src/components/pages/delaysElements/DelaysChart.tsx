import React from "react";
import Delays from "../../../model/delays/Delays";
import DalayDataPrepare from "./DalayDataPrepare";
import {Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import { Row} from "react-bootstrap";


interface DelaysChartProps {
    delays_data: Delays[];
}

const DelaysChart: React.FC<DelaysChartProps> = ({delays_data}) => {
    const preparedData = new DalayDataPrepare(delays_data).getSummary();
    const summaryDelays = preparedData.delaysSummary;
    const summary = Object.entries(summaryDelays).sort((a,b) => b[1] - a[1]);
    const unitDelays = (preparedData.unitData);
    const total = summary.reduce((sum, current) => sum + current[1], 0);
    console.log('Summary', summary);
    console.log('UnitData', unitDelays);


    const charts = Object.entries(unitDelays).map(
        ([delayType, chartData], chartIndex) => {
            const totalDelta = chartData.reduce((sum, data) => sum + data.delta, 0);

            return (
                <Row>
                    <div key={`chart-${chartIndex}`}>
                        <h4>{delayType}: {totalDelta} минут</h4>
                        <Row id={`delaysChart-${chartIndex}`}>
                            <div className="col" style={{width: "100%", height: `${chartData.length * 50 + 40}px`}}>
                                <ResponsiveContainer width="100%" height="100%" className="mt-1 mb-1">
                                    
                                    <BarChart
                                        data={chartData}
                                        layout="vertical"
                                        margin={{top: 5, right: 50, bottom: 20, left: 10}}
                                    >
                                        <CartesianGrid strokeDasharray="3 3"/>
                                        <XAxis type="number"
                                               dataKey={"delta"}/> {/* Use entry[1] for the delay value */}
                                        <YAxis
                                            type="category"
                                            dataKey={"unitPart.unit.name"} // Extract category name from unitPart.unit.name
                                            tick={{stroke: "black", strokeWidth: 0.5, fontSize: 12}}
                                            width={120}
                                            height={30}
                                        />
                                        <Tooltip/>
                                        {/* ... rest of your Bar components */}
                                        <Bar dataKey={"delta"} fill="#3498db" animationDuration={500}>
                                            <LabelList position="right"/>
                                        </Bar>
                                        {/* ... rest of your Bar components */}
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </Row>
                    </div>
                </Row>
            );
        }
    );


    return (

            <Row>
                <h3>Суммарное количество простоев: {total} минут</h3>
                <div className="col mx-auto" style={{width: '100%', height: `${summary.length * 50 + 35}px`}}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={summary}
                            layout="vertical"
                            margin={{top: 5, right: 50, bottom: 20, left: 10}}
                        >
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis type="number" dataKey={entry => entry[1]}/> {/* Use entry[1] for the delay value */}
                            <YAxis
                                type="category"
                                dataKey={entry => entry[0]} // Use entry[0] for the delay type
                                tick={{stroke: 'black', strokeWidth: 0.5, fontSize: 12}}
                                width={120}
                            />
                            <Tooltip/>
                            {/*<Legend verticalAlign="top" height={36} />*/}
                            <Bar dataKey={entry => entry[1]} fill="#3498db" animationDuration={500}>
                                <LabelList position="right"/>
                            </Bar>
                            {/* ... rest of your Bar components */}
                        </BarChart>
                    </ResponsiveContainer>

                </div>
                <div>{charts}</div>
            </Row>

    );
}
export default DelaysChart;