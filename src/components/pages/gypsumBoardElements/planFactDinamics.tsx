import React, { useEffect, useMemo } from "react";
import Plan from "../../../model/gypsumBoard/Plan";
import BoardProduction from "../../../model/production/BoardProduction";
import ApiService from "../../../service/ApiService";
import { Bar, BarChart, CartesianGrid, Cell, LabelList, Legend, LegendProps, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "react-bootstrap";

interface GypsumBoardTableProps {
    startDate: string | null;
    endDate: string | null;
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

const PlanFactDinamics: React.FC<GypsumBoardTableProps> = ({ startDate, endDate }) => {
    const [plan, setPlan] = React.useState<Plan[]>([]);
    const [fact, setFact] = React.useState<BoardProduction[]>([]);

    useEffect(() => {
        if (!startDate || !endDate) return;
        
        const fetchData = async () => {
            try {
                const [fetchedPlan, fetchedProduction] = await Promise.all([
                    ApiService.fetchPlan(new Date(startDate), new Date(endDate)),
                    ApiService.fetchBoardProduction(new Date(startDate), new Date(endDate))
                ]);

                const filteredProduction = fetchedProduction.filter(p =>
                    p.category?.id !== undefined && p.category.id > 1 && p.category.id <= 4
                );

                setPlan(Array.isArray(fetchedPlan) ? fetchedPlan : []);
                setFact(Array.isArray(filteredProduction) ? filteredProduction : []);
            } catch (error) {
                console.error('Error fetching data:', error);
                setPlan([]);
                setFact([]);
            }
        };

        fetchData();
    }, [startDate, endDate]);

    const uniqueDates = useMemo(() => {
        const planDates = plan.map(p => getLocalDateString(p.planDate));
        const factDates = fact.map(f => getLocalDateString(f.productionList.productionDate));
        return Array.from(new Set([...planDates, ...factDates]))
            .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    }, [plan, fact]);

    const planFactData = useMemo(() => {
        const planLookup: Record<string, number> = {};
        const factLookup: Record<string, number> = {};

        plan.forEach(item => {
            const dateKey = getLocalDateString(item.planDate);
            planLookup[dateKey] = (planLookup[dateKey] || 0) + (item.planValue || 0);
        });

        fact.forEach(item => {
            const dateKey = getLocalDateString(item.productionList.productionDate);
            factLookup[dateKey] = (factLookup[dateKey] || 0) + (item.value || 0);
        });

        return uniqueDates.map(date => {
            const planSum = planLookup[date] || 0;
            const factSum = factLookup[date] || 0;
            return {
                date,
                planValue: planSum,
                factValue: factSum,
                deviation: Math.round(factSum - planSum)
            };
        });
    }, [plan, fact, uniqueDates]);

    const waterfallData = useMemo<(WaterfallData)[]>(() => {
        const data: WaterfallData[] = [];
        let runningTotal = 0;

        planFactData.forEach(item => {
            const bridge = runningTotal;
            const deviation = item.deviation;
            runningTotal += deviation;
            data.push({
                name: item.date,
                value: deviation,
                bridge,
                isTotal: false
            });
        });

        data.push({
            name: 'Итог',
            value: runningTotal,
            bridge: 0,
            isTotal: true
        });

        return data;
    }, [planFactData]);

    const renderTotalLabel = (value: number | string): string => {
        if (typeof value !== 'number' || waterfallData.length === 0) {
            return '';
        }

        const entry = waterfallData.find(e => e.value === value);
        
        if (entry && entry.isTotal) {
            return new Intl.NumberFormat('ru-RU').format(value);
        }
        return '';
    };

    const getBarColor = (entry: WaterfallData) => {
        if (entry.isTotal) return '#6366f1'; // Индиго для итога (современный акцент)
        return entry.value >= 0 ? '#10b981' : '#ef4444'; // Emerald/Red для положительных/отрицательных
    };

    const legendPayload: LegendProps['payload'] = [
        { value: 'Положительное отклонение', type: 'rect', color: '#10b981' },
        { value: 'Отрицательное отклонение', type: 'rect', color: '#ef4444' },
        { value: 'Итог', type: 'rect', color: '#6366f1' }
    ];

    // Современные стили для карточки
    const cardStyle: React.CSSProperties = {
        width: '100%',
        height: '500px',
        borderRadius: '16px', // Закругленные углы
        border: 'none', // Убираем границу
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', // Тонкая тень
        background: 'linear-gradient(145deg, #ffffff, #f8fafc)', // Легкий градиентный фон
        overflow: 'hidden'
    };

    return (
        <Card style={cardStyle} className="shadow-sm">
            <Card.Header style={{
                backgroundColor: 'transparent', // Прозрачный фон заголовка
                borderBottom: '1px solid #e2e8f0', // Тонкая разделительная линия
                padding: '1.5rem'
            }}>
                <Card.Title style={{
                    margin: 0,
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    color: '#334155',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                }}>
                    {/* Иконка графика */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="20" x2="18" y2="10"></line>
                        <line x1="12" y1="20" x2="12" y2="4"></line>
                        <line x1="6" y1="20" x2="6" y2="14"></line>
                    </svg>
                    Динамика отклонений от плана
                    <span style={{ 
                        fontSize: '0.875rem', 
                        fontWeight: 400, 
                        color: '#64748b',
                        backgroundColor: '#f1f5f9',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px'
                    }}>
                        {startDate} по {endDate}
                    </span>
                </Card.Title>
            </Card.Header>
            
            <div style={{ padding: '1rem', height: 'calc(100% - 80px)' }}>
                <ResponsiveContainer width="100%" height={500}>
                    <BarChart
                        data={waterfallData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 150 }}
                        layout="horizontal"
                    >
                        <defs>
                            {/* Современный градиент для тени */}
                            <filter id="modernShadow" x="-10%" y="-10%" width="120%" height="120%">
                                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.08"/>
                                <feDropShadow dx="0" dy="4" stdDeviation="2" floodColor="#000000" floodOpacity="0.04"/>
                            </filter>
                            
                            {/* Градиент для итогового столбца */}
                            <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#818cf8" />
                                <stop offset="100%" stopColor="#4f46e5" />
                            </linearGradient>
                        </defs>
                        
                        <CartesianGrid
                            strokeDasharray="4 4"
                            vertical={true}
                            horizontal={false}
                            stroke="#e2e8f0"
                        />
                        
                        <XAxis
                            dataKey="name"
                            type="category"
                            tick={{ 
                                fontSize: 12, 
                                fill: '#64748b',
                                fontWeight: 500
                            }}
                            axisLine={{ stroke: '#cbd5e1' }}
                            height={100}
                            angle={-45}
                            textAnchor="end"
                        />
                        
                        <YAxis
                            type="number"
                            tickFormatter={(value) => new Intl.NumberFormat('ru-RU').format(value)}
                            tick={{ 
                                fill: '#64748b',
                                fontSize: 12,
                                fontWeight: 500
                            }}
                            axisLine={{ stroke: '#cbd5e1' }}
                        />
                        
                        <Tooltip
                            formatter={(value: number) => [new Intl.NumberFormat('ru-RU').format(value), 'Отклонение']}
                            contentStyle={{
                                borderRadius: '12px',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                                border: '1px solid #e2e8f0',
                                background: 'rgba(255, 255, 255, 0.95)',
                                backdropFilter: 'blur(10px)',
                                padding: '0.75rem'
                            }}
                            labelStyle={{
                                fontWeight: 600,
                                color: '#1e293b',
                                marginBottom: '0.25rem'
                            }}
                        />
                        
                        <Bar dataKey="bridge" stackId="a" fill="transparent" />
                        
                        <Bar 
                            dataKey="value" 
                            name="Отклонение" 
                            stackId="a" 
                            barSize={32}
                            filter="url(#modernShadow)"
                        >
                            {waterfallData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.isTotal ? "url(#totalGradient)" : getBarColor(entry)}
                                    radius={entry.isTotal ? "6 6 6 6" : "4 4 0 0"} // Исправлено: строка вместо массива
                                    style={{
                                        transition: 'all 0.2s ease'
                                    }}
                                />
                            ))}
                            
                            <LabelList
                                dataKey="value"
                                position="inside"
                                angle={-90}
                                formatter={renderTotalLabel}
                                fill="#ffffff"
                                fontSize={12}
                                fontWeight={600}
                            />
                        </Bar>
                        
                        <ReferenceLine y={0} stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="4 4" />
                        
                        <Legend
                            wrapperStyle={{ 
                                paddingTop: '16px',
                                paddingBottom: '8px'
                            }}
                            payload={legendPayload}
                            content={(props) => (
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    gap: '1.5rem',
                                    paddingTop: '16px',
                                    flexWrap: 'wrap'
                                }}>
                                    {props.payload?.map((entry, index) => (
                                        <div key={`item-${index}`} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}>
                                            <div style={{
                                                width: '12px',
                                                height: '12px',
                                                backgroundColor: entry.color,
                                                borderRadius: entry.value === 'Итог' ? '2px' : '2px',
                                                border: entry.value === 'Итог' ? 'none' : 'none'
                                            }} />
                                            <span style={{
                                                fontSize: '0.875rem',
                                                color: '#64748b',
                                                fontWeight: 500
                                            }}>
                                                {entry.value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};

export default PlanFactDinamics;