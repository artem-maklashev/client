import React from "react";
import BoardProduction from "../../../model/production/BoardProduction";
import Shift from "../../../model/Shift";
import { Button, Col } from "react-bootstrap";
import { LineChart, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, ReferenceLine } from "recharts";
import { addDays } from "date-fns";

interface DefectsByShiftProps {
    production: BoardProduction[];
}

interface ByDayDefects {
    day: string;
    total: number;
    fact: number;  
    defectsPercentage: number;
}

const DefectsByShift: React.FC<DefectsByShiftProps> = ({ production }) => {
    const uniqueShifts = production.reduce(
        (acc: Shift[], curr) => {
            if (!acc.some(s => s.id === curr.productionList.shift.id)) {
                acc.push(curr.productionList.shift);
            }
            return acc.sort((a, b) => a.id - b.id);
        },
        [] as Shift[]
    );

    const precentage = (bp: BoardProduction[]) => {
        const result: ByDayDefects[] = [];
        if (bp.length !== 0) {
            bp.forEach(p => {
                const StrDate = new Date(addDays(p.productionList.productionDate, 1)).toISOString().split('T')[0];
                const existingEntry = result.find(r => r.day === StrDate);
                
                if (!existingEntry) {
                    if (p.category.id === 1) {
                        result.push({ day: StrDate, total: p.value, fact: 0, defectsPercentage: 0 });
                    } else if (p.category.id === 2 || p.category.id === 3 || p.category.id === 4) {
                        result.push({ day: StrDate, total: 0, fact: p.value, defectsPercentage: 0 });
                    }
                } else {
                    if (p.category.id === 1) {
                        existingEntry.total += p.value;
                    } else if (p.category.id === 2 || p.category.id === 3 || p.category.id === 4) {
                        existingEntry.fact += p.value;
                    }
                }
            });
            
            result.forEach(r => {
                r.defectsPercentage = (r.total > 0 ? 1 - r.fact / r.total : 0)*100;
            });
        }
        return result;
    }

    const handleClick = (data: any) => {
        console.log(data);
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (!active || !payload || payload.length === 0) {
            return null;
        }

        const totalValue = payload.find((item: any) => item.dataKey === 'total')?.value;
        const factValue = payload.find((item: any) => item.dataKey === 'fact')?.value;
        const defectsValue = payload.find((item: any) => item.dataKey === 'defectsPercentage')?.value;

        return (
            <div className="custom-tooltip" style={{
                backgroundColor: '#fff',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px'
            }}>
                <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>{`Дата: ${label}`}</p>
                {totalValue !== undefined && <p>{`План: ${totalValue}`}</p>}
                {factValue !== undefined && <p>{`Факт: ${factValue}`}</p>}
                {defectsValue !== undefined && <p>{`Брак: ${(defectsValue).toFixed(2)}%`}</p>}
            </div>
        );
    };

    const legendFormatter = (value: string) => {
        switch(value) {
            case 'planValue': return 'Plan';
            case 'productionValue': return 'Fact';
            case 'defectPercent': return 'Defects %';
            default: return value;
        }
    };

    const printStyles = `
  @media print {
    body {
      padding: 20px;
      font-family: Arial, sans-serif;
    }
    .no-print {
      display: none !important;
    }
    .print-section {
      width: 100%;
      margin-bottom: 30px;
      page-break-after: always;
    }
    .recharts-wrapper {
      width: 100% !important;
      height: auto !important;
    }
    table {
      margin-top: 20px;
      width: 100%;
    }
  }
`;
    

    const handlePrint = () => {
        const printContent = document.getElementById('print-content');
        
        if (printContent) {
            const printWindow = window.open('', '_blank');
            
            if (printWindow) {
                const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
                    .map(el => el.outerHTML)
                    .join('');
                
                const printStyles = `
                    <style>
                        body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
                        .print-section { 
                            page-break-after: auto; 
                            margin-bottom: 30px;
                        }
                        h4 { text-align: center; margin-bottom: 20px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background-color: #f2f2f2; }
                    </style>
                `;
                
                printWindow.document.write(`
                    <html>
                        <head>
                            <title>Отчет по браку</title>
                            ${styles}
                            ${printStyles}
                        </head>
                        <body>
                            ${printContent.innerHTML}
                            <script>
                                window.onload = function() {
                                    setTimeout(function() {
                                        window.print();
                                        window.close();
                                    }, 200);
                                };
                            </script>
                        </body>
                    </html>
                `);
                
                printWindow.document.close();
            } else {
                alert('Пожалуйста, разрешите всплывающие окна для этого сайта');
            }
        }
    };

    return (
        <div>
            <style>{printStyles}</style>
            <div className="no-print mb-3 d-flex justify-content-between align-items-center">
                <h2>Процент брака по сменам</h2>
                <Button variant="primary" onClick={handlePrint}>
                    Печать 
                </Button>
            </div>
            
            <div id="print-content">
                {uniqueShifts.map((shift, index) => {
                    const data = precentage(production.filter(p => p.productionList.shift.id === shift.id));
                    
                    return (
                        <div
                            key={shift.id}
                            className="print-section"
                            style={{
                                marginBottom: index < uniqueShifts.length - 1 ? '50px' : '0',
                                paddingBottom: '20px'
                            }}
  >
                            <h4>Смена {shift.name}</h4>
                            <ResponsiveContainer width="100%" height={350}>
                            {/* <div style={{ width: '100%', height: '250px' }}> */}
                                <LineChart
                                    width={800}
                                    height={400}
                                    data={data}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                                    
                                >
                                    {/* Заголовок графика */}
                                    {/* <text
                                        x={400}
                                        y={20}
                                        textAnchor="middle"
                                        style={{
                                            fontSize: '16px',
                                            fontWeight: 'bold',
                                            fontFamily: 'Arial, sans-serif'
                                        }}
                                    >
                                        {`Смена ${shift.name}`}
                                    </text> */}
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                                    <XAxis 
                                        dataKey="day"
                                        tick={{ fill: '#000' }}
                                        axisLine={{ stroke: '#000' }}
                                        tickLine={{ stroke: '#000' }}
                                    />
                                    <YAxis 
                                        yAxisId="right" 
                                        orientation="right" 
                                        tick={{ fill: '#000' }}
                                        axisLine={{ stroke: '#000' }}
                                        tickLine={{ stroke: '#000' }}
                                        label={{ value: ' %', position: 'right', fill: '#000', fontSize: 16, fontWeight: 'bold' }}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <ReferenceLine 
                                        y={3} 
                                        yAxisId="right" 
                                        stroke="#f00" 
                                        strokeWidth={2}
                                        strokeDasharray="5 3"
                                        label={{
                                            value: '3',
                                            position: 'right',
                                            fill: '#f00',
                                            fontSize: 16,
                                            fontWeight: 'bold'
                                        }}
                                    />
                                    <Line 
                                        yAxisId="right" 
                                        type="step"
                                        dataKey="defectsPercentage" 
                                        name="Процент брака"
                                        stroke="#10b981" 
                                        strokeWidth={3}
                                        dot={{ r: 4, fill: '#10b981', strokeWidth: 2 }}
                                    />
                                </LineChart>
                                </ResponsiveContainer>
                            {/* </div> */}
                            {/* <div className="mt-3">
                                <h4>Статистика по смене:</h4>
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Дата</th>
                                            <th>План</th>
                                            <th>Факт</th>
                                            <th>% брака</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map(item => (
                                            <tr key={item.day}>
                                                <td>{item.day}</td>
                                                <td>{item.total}</td>
                                                <td>{item.fact}</td>
                                                <td>{item.defectsPercentage.toFixed(2)}%</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div> */}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default DefectsByShift;