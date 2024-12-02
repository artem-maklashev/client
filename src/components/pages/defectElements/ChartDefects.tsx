import BoardDefectsLog from "../../../model/defects/BoardDefectsLog";
import BoardProduction from "../../../model/production/BoardProduction";
import React, {FC} from "react";
import DefectsDataPrepare from "./DefectsDataPrepare";
import {Col, Row} from "react-bootstrap";
import {
    Area,
    AreaChart,
    Bar,
    BarChart, 
    CartesianGrid, Cell,  LabelList,
     Pie, PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";
import DefectChartData from "../gypsumBoardElements/DefectChartData";


interface ChartDefectsProps {
    defectsLog: BoardDefectsLog[];
    data: BoardProduction[];
}
interface Data {
    key: string;
    value: number;
}

interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{ payload: Data }>;
}


const ChartDefects: React.FC<ChartDefectsProps> = ({defectsLog, data}) => {
    if (data.length === 0 && defectsLog.length === 0) {
        return <div>Данных нет</div>;
    } else {
        console.log("Получены данные для графиков по браку в размере  " + data.length);
    }
    const preparedData = new DefectsDataPrepare(defectsLog, data);
    const productionData = preparedData.getProductionDict();
    const originalProductionChartData = Object.entries(productionData);
    const defectsData = preparedData.getCategorySummary();
    // const defectsDataToChart: Data[]= Object.entries(defectsData);
    const defectsDataToChart: Data[] = Object.entries(defectsData).map(([key, value]) => ({ key, value }));

    const productionChartData = () => {
        const chartData: [shift: string, percent: number][] = [];
        originalProductionChartData.forEach(item => {
            const percent: number = ((1 - item[1].goodProduct / item[1].total) * 100);
            chartData.push([item[0], percent]);
        });
        return chartData;
    };

    const toChartData = productionChartData().sort((a, b) => b[1] - a[1]);

    let chartData = preparedData.getDefectsByDate();

    chartData = chartData.map(value => ({
        ...value,
        defectsPresent: value.totalValue !== 0 ? Number(((value.totalValue - value.value) * 100 / value.totalValue).toFixed(2)) : 0
    })).sort((a, b) => {
        const pDate1 = new Date(a.pDate);
        const pDate2 = new Date(b.pDate);
        return pDate1.getTime() - pDate2.getTime();
    });

    if (chartData && chartData.length > 0) {
        const firstDate = chartData[0].pDate;
        console.log("первый день графика pDate " + firstDate);
        console.log("последний день " + chartData[chartData.length - 1].pDate);
    } else {
        console.error('chartData is empty or undefined');
    }


    const tempArray: DefectChartData[] = [];

    chartData.forEach((value) => {
        const dateValue = new Date(value.pDate);
        if (isNaN(dateValue.getTime())) {
            throw new Error('Invalid date object');
        }
        const day = dateValue.getDate().toString().padStart(2, '0');
        tempArray.push({...value, pDay: day});
    });
    for (let i = 0; i < tempArray.length; i++) {
        chartData[i] = tempArray[i];
    }
    // console.log("---->"+chartData[0].pDay);

    const COLORS = ['#0088FE', '#00C49F', '#282cff', '#38054a',
        '#720779', "#e228ff"];

    if (chartData && chartData.length > 0) {
        const firstDate = chartData[0].pDay;
        console.log("первый день графика " + firstDate);
    } else {
        console.error('chartData is empty or undefined');
    }

    const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0]?.payload as Data;

            // Проверяем, определено ли значение data.value
            if (data && typeof data.value !== 'undefined') {
                return (
                    <div style={{ background: 'white', border: '1px solid #ccc', padding: '10px' }}>
                        <p>{`${data.key}: ${data.value.toFixed(2)}`}</p>
                    </div>
                );
            }
        }

        return null;
    };




    return <Col>
        <Row>
            <h3 className="text-center">Процент брака по дням</h3>
            <Col className="col-12" style={{width: '100%', height: '300px'}}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}
                               margin={{top: 30, right: 30, left: 0, bottom: 0}}>
                        {/*{defectData[0].pList.id}*/}
                        <defs>
                            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="pDay"/>
                        <YAxis dataKey="defectsPresent" label="%" domain={[0, 'dataMax']}/>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <Tooltip/>
                        {/*<text x={600} y={15} textAnchor="middle" dominantBaseline="middle" fill="black">*/}
                        {/*    Процент брака*/}
                        {/*</text>*/}
                        <Area type="monotone" dataKey="defectsPresent" stroke="#8884d8" fillOpacity={1}
                              fill="url(#colorUv)"/>

                    </AreaChart>
                </ResponsiveContainer>
            </Col>
        </Row>
        <Row>
            <Col className="col-lg-6 col-12 mb-5" style={{height: '300px'}}>
                <h3 className="text-center">Процент брака по сменам</h3>
                <ResponsiveContainer>
                    <BarChart
                        data={toChartData}
                        layout="vertical"
                        margin={{top: 5, right: 100, bottom: 20, left: 10}}
                    >
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis type="number" dataKey={entry => entry[1]} hide/>
                        <YAxis
                            type="category"
                            dataKey={entry => entry[0]}
                            tick={{stroke: 'black', strokeWidth: 0.5, fontSize: 12}}
                            width={10}
                        />
                        <Tooltip/>
                        <Bar dataKey={entry => entry[1]} fill="#3498db" animationDuration={500}>
                            <LabelList position="right"
                                       formatter={(value: number, entry: any) => {
                                           return value.toFixed(2) + " %";
                                       }}/>
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </Col>
            <Col className="col-lg-6 col-12 mb-5 " >
                <h3 className="text-center">Виды брака</h3>
                <Row className="d-flex justify-content-center" >
                <Col className="col-12" style={{width: '100%', height: '300px'}}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart width={500} height={300}>

                            <Pie
                                data={defectsDataToChart}
                                dataKey="value"
                                // nameKey={(entry) => entry[0]}
                                nameKey="key"
                                cx="50%"
                                cy="50%"
                                innerRadius={75}
                                outerRadius={100}
                                fill="#8884d8"
                                animationDuration={500}
                                label={({value}) => `${value.toFixed(2)}`}
                            >
                                {defectsDataToChart.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                </Col>
                    {/*<ResponsiveContainer width="100%" height="100%">*/}
                    {/*    <PieChart width={500} height={300}>*/}
                    {/*        <Tooltip/>*/}
                    {/*        <Pie*/}
                    {/*            data={defectsDataToChart}*/}
                    {/*            dataKey={(entry) => entry[1]}*/}
                    {/*            nameKey={(entry) => entry[0]}*/}
                    {/*            cx="50%"*/}
                    {/*            cy="50%"*/}
                    {/*            innerRadius={75}*/}
                    {/*            outerRadius={100}*/}
                    {/*            fill="#8884d8"*/}
                    {/*            animationDuration={500}*/}
                    {/*            label={({value}) => `${value.toFixed(2)}`}*/}
                    {/*        >*/}
                    {/*            {defectsDataToChart.map((entry, index) => (*/}
                    {/*                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>*/}
                    {/*            ))}*/}
                    {/*        </Pie>*/}
                    {/*    </PieChart>*/}
                    {/*</ResponsiveContainer>*/}
                </Row>
            </Col>
        </Row>
    </Col>;
};
export default ChartDefects;