import React, { useEffect, useMemo, useState } from "react";
import { Card } from "react-bootstrap";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    LabelList,
    Legend,
    LegendProps,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";
import Plan from "../../../model/gypsumBoard/Plan";
import BoardProduction from "../../../model/production/BoardProduction";
import ApiService from "../../../service/ApiService";

// Стили
const COLORS = {
    positive: "#10b981",
    negative: "#ef4444",
    totalGradientStart: "#818cf8",
    totalGradientEnd: "#4f46e5",
    totalSolid: "#6366f1"
};

const CARD_STYLE: React.CSSProperties = {
    width: "100%",
    height: "500px",
    borderRadius: "16px",
    border: "none",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    background: "linear-gradient(145deg, #ffffff, #f8fafc)",
    overflow: "hidden"
};

// Легенда
const LEGEND_PAYLOAD: LegendProps["payload"] = [
    { value: "Положительное отклонение", type: "rect", color: COLORS.positive },
    { value: "Отрицательное отклонение", type: "rect", color: COLORS.negative },
    { value: "Итог", type: "rect", color: COLORS.totalSolid }
];

// Типы
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

// Утилиты
const getLocalDateString = (dateInput: string | Date): string => {
    const date = new Date(dateInput);
    return [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0")
    ].join("-");
};

const getBarColor = (entry: WaterfallData) =>
    entry.isTotal ? COLORS.totalSolid : entry.value >= 0 ? COLORS.positive : COLORS.negative;

// Основной компонент
const PlanFactDinamics: React.FC<GypsumBoardTableProps> = ({ startDate, endDate }) => {
    const [plan, setPlan] = useState<Plan[]>([]);
    const [fact, setFact] = useState<BoardProduction[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Загрузка данных
    useEffect(() => {
        if (!startDate || !endDate) return;

        setLoading(true);
        setError(null);

        (async () => {
            try {
                const [fetchedPlan, fetchedProduction] = await Promise.all([
                    ApiService.fetchPlan(new Date(startDate), new Date(endDate)),
                    ApiService.fetchBoardProduction(new Date(startDate), new Date(endDate))
                ]);

                setPlan(Array.isArray(fetchedPlan) ? fetchedPlan : []);
                setFact(
                    (Array.isArray(fetchedProduction) ? fetchedProduction : [])
                        .filter(p => p.category?.id && p.category.id > 1 && p.category.id <= 4)
                );
            } catch (error) {
                console.error("Ошибка загрузки данных:", error);
                setError("Не удалось загрузить данные");
            } finally {
                setLoading(false);
            }
        })();
    }, [startDate, endDate]);
    // Уникальные даты
    const uniqueDates = useMemo(() => {
        const planDates = plan.map(p => getLocalDateString(p.planDate));
        const factDates = fact.map(f => getLocalDateString(f.productionList.productionDate));
        return [
            ...new Set([...planDates, ...factDates])
        ].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    }, [plan, fact]);

    // Данные план/факт
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

        return uniqueDates.map(date => ({
            date,
            deviation: Math.round((factLookup[date] || 0) - (planLookup[date] || 0))
        }));
    }, [plan, fact, uniqueDates]);

    // Данные для водопада
    const waterfallData = useMemo(() => {
        let runningTotal = 0;
        const data: WaterfallData[] = planFactData.map(item => {
            const bridge = runningTotal;
            runningTotal += item.deviation;
            return { name: item.date, value: item.deviation, bridge };
        });

        data.push({ name: "Итог", value: runningTotal, bridge: 0, isTotal: true });
        return data;
    }, [planFactData]);

    // Рендер
    return (
        <Card style={CARD_STYLE} className="shadow-sm">
            {loading && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(255,255,255,0.8)'
                }}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Загрузка...</span>
                    </div>
                </div>
            )}

            {error && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(255,255,255,0.8)'
                }}>
                    <div style={{
                        color: '#ef4444',
                        fontWeight: 600
                    }}>
                        {error}
                    </div>
                </div>
            )}

            <Card.Header style={{
                backgroundColor: 'transparent',
                borderBottom: '1px solid #e2e8f0',
                padding: '1.5rem'
            }}>
                <Card.Title style={{
                    margin: 0,
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    color: '#334155',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="20" x2="18" y2="10" />
                        <line x1="12" y1="20" x2="12" y2="4" />
                        <line x1="6" y1="20" x2="6" y2="14" />
                    </svg>
                    Динамика отклонений от плана
                    <span style={{
                        fontSize: "0.875rem",
                        fontWeight: 400,
                        color: "#64748b",
                        backgroundColor: "#f1f5f9",
                        padding: "0.25rem 0.75rem",
                        borderRadius: "9999px"
                    }}>
                        {startDate} по {endDate}
                    </span>
                </Card.Title>
            </Card.Header>

            <div style={{ padding: "1rem", height: "calc(100% - 80px)" }}>
                {!loading && !error && (
                    <ResponsiveContainer width="100%" height={500}>
                        <BarChart
                            data={waterfallData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 150 }}
                        >
                            <defs>
                                <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={COLORS.totalGradientStart} />
                                    <stop offset="100%" stopColor={COLORS.totalGradientEnd} />
                                </linearGradient>
                            </defs>

                            <CartesianGrid
                                strokeDasharray="4 4"
                                vertical
                                horizontal={false}
                                stroke="#e2e8f0"
                            />

                            <XAxis
                                dataKey="name"
                                tick={{ fontSize: 12, fill: "#64748b" }}
                                height={100}
                                angle={-45}
                                textAnchor="end"
                            />

                            <YAxis
                                tickFormatter={v => new Intl.NumberFormat("ru-RU").format(v)}
                                tick={{ fontSize: 12, fill: "#64748b" }}
                                padding={{ bottom: 20 }}
                            />

                            <Tooltip
                                formatter={(v: number) => [
                                    new Intl.NumberFormat("ru-RU").format(v),
                                    "Отклонение"
                                ]}
                            />

                            <Bar
                                dataKey="bridge"
                                stackId="a"
                                fill="transparent"
                            />

                            <Bar
                                dataKey="value"
                                stackId="a"
                                barSize={32}
                            >
                                {waterfallData.map((entry, idx) => (
                                    <Cell
                                        key={idx}
                                        fill={entry.isTotal ? "url(#totalGradient)" : getBarColor(entry)}
                                        radius={entry.isTotal ? 6 : "4 4 0 0"}
                                    />
                                ))}

                                <LabelList
                                    dataKey="value"
                                    position="centerTop"
                                    fill="#353536ff"
                                    fontSize={11}
                                    fontWeight={600}
                                    angle={270}
                                    
                                />
                            </Bar>

                            <ReferenceLine
                                y={0}
                                stroke="#94a3b8"
                                strokeDasharray="4 4"
                            />

                            <Legend
                                payload={LEGEND_PAYLOAD}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </Card>
    );

    // Оптимизации производительности
    // 1. Добавлен индикатор загрузки
    // 2. Добавлена обработка ошибок
    // 3. Улучшена структура компонентов
    // 4. Добавлены стили для состояний загрузки и ошибки
    // 5. Улучшена читаемость кода через форматирование
}
    export default PlanFactDinamics;