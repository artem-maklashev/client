import React, { useMemo } from "react";
import BoardProduction from "../../../model/production/BoardProduction";
import Shift from "../../../model/Shift";
import { Badge, Button, Row } from "react-bootstrap";
import {
    ResponsiveContainer,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    BarChart,
    Bar,
    LabelList,
    Cell,
    ReferenceLine,
    LegendProps,    
} from "recharts";

interface DefectsByShiftProps {
    production: BoardProduction[];
}

interface ByDayDefects {
    day: string;
    total: number;
    fact: number;
    defectsPercentage: number;
    defectsPercentageAvg: number;
}

interface WaterfallData {
    name: string;
    value: number;
    bridge: number;
    isTotal?: boolean;
}

const getLocalDateString = (dateInput: string | Date): string => {
    const date = new Date(dateInput);
    return [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, '0'),
        String(date.getDate()).padStart(2, '0')
    ].join('-');
};

const DefectsByShift: React.FC<DefectsByShiftProps> = ({ production }) => {
    const uniqueShifts = Array.from(
        new Map(
            production.map(p => [p.productionList.shift.id, p.productionList.shift])
        ).values()
    ).sort((a, b) => a.id - b.id);

    const calculatePercentage = (bp: BoardProduction[]): ByDayDefects[] => {
        const result: Record<string, ByDayDefects> = {};

        bp.forEach(p => {
            if (!p.productionList?.productionDate) return;

            const dateStr = getLocalDateString(p.productionList.productionDate);
            const isTotal = p.category.id === 1;
            const isDefect = [2, 3, 4].includes(p.category.id);

            if (!result[dateStr]) {
                result[dateStr] = { day: dateStr, total: 0, fact: 0, defectsPercentage: 0, defectsPercentageAvg: 0 };
            }

            if (isTotal) result[dateStr].total += p.value;
            if (isDefect) result[dateStr].fact += p.value;
        });

        let sum = 0;
        let counter = 0;

        return Object.values(result).map(r => {
            r.defectsPercentage = r.total > 0 ? (1 - r.fact / r.total) * 100 : 0;
            sum += r.defectsPercentage;
            counter++;
            r.defectsPercentageAvg = sum / counter;
            return r;
        });
    };

    const generateWaterfallData = (bp: BoardProduction[]): WaterfallData[] => {
        const percentages = calculatePercentage(bp);
        let runningTotal = 0;
        let previousValue = 0;

        const result = percentages.map(p => {
            const bridge = runningTotal;
            const deviation = p.defectsPercentageAvg - previousValue;
            runningTotal += deviation;
            previousValue = p.defectsPercentageAvg;

            return { name: p.day, value: deviation, bridge, isTotal: false };
        });

        if (percentages.length > 0) {
            result.push({ name: 'Итого', value: runningTotal, bridge: 0, isTotal: true });
        }

        return result;
    };

    const handlePrint = () => {
        const printContent = document.getElementById('print-content');
        if (!printContent) return;

        const printWindow = window.open('', '_blank');
        if (!printWindow) return alert('Разрешите всплывающие окна');

        const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
            .map(el => el.outerHTML)
            .join('');

        const printStyles = `
      <style>
        body { margin: 0; padding: 20px; font-family: Arial; }
        .print-section { page-break-after: auto; margin-bottom: 30px; }
        h4 { text-align: center; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background: #f2f2f2; }
      </style>
    `;

        printWindow.document.write(`
      <html><head><title>Отчет по браку</title>${styles}${printStyles}</head>
      <body>${printContent.innerHTML}<script>
        window.onload = () => setTimeout(() => { window.print(); window.close(); }, 200);
      </script></body></html>
    `);

        printWindow.document.close();
    };

    const getBarColor = (entry: WaterfallData) => entry.isTotal ? '#6366f1' : (entry.value >= 0 ? '#ef4444' : '#10b981');

    const legendPayload = useMemo<LegendProps['payload']>(() => {
        if (!generateWaterfallData || generateWaterfallData.length === 0) return [];

        return [
            { value: 'Увеличение', type: 'circle', color: '#ef4444', id: 'increase' },
            { value: 'Снижение', type: 'circle', color: '#10b981', id: 'decrease' },
            { value: 'Итог', type: 'circle', color: '#6366f1', id: 'total' }
        ];
    }, [generateWaterfallData]);


    return (
        <div>
            <style>{`@media print { .no-print { display: none !important; } .print-section { page-break-after: always; } }`}</style>

            <div className="no-print mb-3 d-flex justify-content-between align-items-center">
                <h2>Процент брака по сменам</h2>
                <Button variant="primary" onClick={handlePrint}>Печать</Button>
            </div>

            <div id="print-content">
                {uniqueShifts.map((shift, index) => {
                    const data = generateWaterfallData(production.filter(p => p.productionList.shift.id === shift.id));

                    return (
                        <Row key={shift.id} className="print-section border" style={{ paddingBottom: '20px', borderColor: 'grey' }}>
                            <Badge className="bg-secondary mb-2 " style={{ fontSize: '20px'}}>Смена {shift.name}</Badge>

                            <ResponsiveContainer width="100%" height={500}>
                                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 150 }}>
                                    <defs>
                                        <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#818cf8" />
                                            <stop offset="100%" stopColor="#4f46e5" />
                                        </linearGradient>
                                    </defs>

                                    <CartesianGrid strokeDasharray="4 4" vertical horizontal={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} />
                                    <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={{ stroke: '#cbd5e1' }} />
                                    <Tooltip formatter={(v: number) => [v.toFixed(2), 'Отклонение']} />

                                    <Bar dataKey="bridge" stackId="a" fill="transparent" />
                                    <Bar dataKey="value" name="Отклонение" stackId="a" barSize={32}>
                                        {data.map((entry, i) => (
                                            <Cell
                                                key={`cell-${i}`}
                                                fill={entry.isTotal ? 'url(#totalGradient)' : getBarColor(entry)}
                                                radius={entry.isTotal ? '6 6 6 6' : '4 4 0 0'}
                                            />
                                        ))}
                                        <LabelList dataKey="value" position="top" formatter={(value: number, entry: any) => {
    if (!entry || !entry.payload) return value.toFixed(2);
    return entry.payload.name || value;}} />
                                    </Bar>

                                    <ReferenceLine y={3} stroke="#19437fff" strokeWidth={1.5} strokeDasharray="4 4" />

                                    <Legend
                                        wrapperStyle={{ paddingTop: '16px' }}
                                        payload={legendPayload}
                                        content={({ payload }) => {
                                            if (!payload) return null;

                                            return (
                                                <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                                                    {payload.map((entry, i) => (
                                                        <div key={`legend-${i}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                            <div style={{ width: 12, height: 12, backgroundColor: entry.color, borderRadius: 2 }} />
                                                            <span style={{ fontSize: '0.875rem', color: '#64748b' }}>{entry.value}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            );
                                        }}/>;

                            </BarChart>
                        </ResponsiveContainer>
            </Row>
            );
        })}
        </div>
    </div >
  );
};

export default DefectsByShift;
