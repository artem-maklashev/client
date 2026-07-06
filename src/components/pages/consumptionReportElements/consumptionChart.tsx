import React, { useEffect, useState } from "react";
import GypsumBoard from "../../../model/gypsumBoard/GypsumBoard";
import BoardProduction from "../../../model/production/BoardProduction";
import ApiService from "../../../service/ApiService";
import MaterialConsumption from "../../../model/specification/MaterialConsumption";
import Material from "../../../model/specification/Material";
import { Card, Col, Container, ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Specification from "../../../model/specification/Specification";

interface ConsumptionChartProps {
    startDate: Date;
    endDate: Date;
    gypsumBoards: GypsumBoard[];
    material: Material | null;
}

interface ChartData {
    productionValue: number;
    consumption: number;
    consumptionPerSquare: number;
    rate: number;
}

interface CombinedData {
    date: string;
    consumptionPerSquare: number;
    rate: number;
    originalDate: Date;
}

interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{ payload: CombinedData; name: string; color: string; value: number }>;
}

type AggregationType = 'day' | 'month';

const COLORS = {
    fact: "#2563eb",
    rate: "#10b981",
    grid: "#f1f5f9",
    text: "#64748b",
};

const ConsumptionChart: React.FC<ConsumptionChartProps> = ({ startDate, endDate, gypsumBoards, material }) => {
    const [productions, setProduction] = useState<BoardProduction[]>([]);
    const [consumptions, setConsumptions] = useState<MaterialConsumption[]>([]);
    const [chartData, setChartData] = useState<CombinedData[]>([]);
    const [specifications, setSpecifications] = useState<Specification[]>([]);
    const [aggregationType, setAggregationType] = useState<AggregationType>('day');
    const [processingProgress, setProcessingProgress] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [loadingStatus, setLoadingStatus] = useState<string>('');
    const [allGypsumBoards, setAllGypsumBoards] = useState<GypsumBoard[]>([]);

    const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const { date, consumptionPerSquare, rate } = payload[0]?.payload || {};
            const diff = consumptionPerSquare - rate;
            const isOverconsumption = diff > 0;

            return (
                <div style={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    padding: "12px 16px",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                    fontFamily: "inherit"
                }}>
                    <div style={{ fontWeight: 600, color: "#1e293b", marginBottom: "8px", fontSize: "13px" }}>
                        {date}
                    </div>
                    <div style={{ fontSize: "13px", display: "flex", flexDirection: "column", gap: "4px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: "24px", color: "#475569" }}>
                            <span>Расход факт:</span>
                            <span style={{ fontWeight: 600, color: COLORS.fact }}>{consumptionPerSquare?.toFixed(4) || '0.0000'}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: "24px", color: "#475569" }}>
                            <span>Норма:</span>
                            <span style={{ fontWeight: 600, color: COLORS.rate }}>{rate?.toFixed(4) || '0.0000'}</span>
                        </div>
                        <div style={{ 
                            borderTop: "1px solid #f1f5f9", 
                            marginTop: "6px", 
                            paddingTop: "6px",
                            display: "flex", 
                            justifyContent: "space-between", 
                            gap: "24px",
                            color: isOverconsumption ? "#ef4444" : "#059669",
                            fontWeight: 500
                        }}>
                            <span>Отклонение:</span>
                            <span>{isOverconsumption ? `+${diff?.toFixed(4) || '0.0000'}` : diff?.toFixed(4) || '0.0000'}</span>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    // Загрузка всех гипсокартонов, если они не переданы
    useEffect(() => {
        const fetchAllGypsumBoards = async () => {
            try {
                const boards = await ApiService.fetchAllGypsumBoards();
                setAllGypsumBoards(boards);
                console.log('All gypsum boards loaded:', boards.length);
            } catch (error) {
                console.error('Error fetching all gypsum boards:', error);
            }
        };

        // Если gypsumBoards пустой или не передан, загружаем все
        if (!gypsumBoards || gypsumBoards.length === 0) {
            fetchAllGypsumBoards();
        } else {
            setAllGypsumBoards(gypsumBoards);
        }
    }, [gypsumBoards]);

    // Загрузка спецификаций
    useEffect(() => {
        const fetchData = async () => {
            if (material) {
                try {
                    setLoadingStatus('Загрузка спецификаций...');
                    const allSpecs = await ApiService.fetchAllSpecifications();
                    const fetchedData = allSpecs.filter(s => s.material.id === material.id);
                    setSpecifications(fetchedData);
                    console.log('Specifications loaded:', fetchedData.length);
                    setLoadingStatus(`Загружено спецификаций: ${fetchedData.length}`);
                } catch (error) {
                    console.error('Error fetching specifications:', error);
                    setLoadingStatus('Ошибка загрузки спецификаций');
                }
            }
        }
        fetchData();
    }, [material]);

    // Загрузка производств - используем все гипсокартоны если не выбраны конкретные
    useEffect(() => {
        const fetchProduction = async () => {
            // Определяем, какие гипсокартоны использовать
            const boardsToUse = gypsumBoards && gypsumBoards.length > 0 
                ? gypsumBoards 
                : allGypsumBoards;

            if (!boardsToUse || boardsToUse.length === 0) {
                console.log('No gypsum boards available');
                setProduction([]);
                setLoadingStatus('Нет доступных гипсокартонов');
                return;
            }

            try {
                setLoadingStatus('Загрузка производств...');
                console.log('Fetching productions for boards:', boardsToUse.length);
                console.log('Using boards:', boardsToUse.map(b => ({ id: b.id, name: ApiService.getName(b) })));
                console.log('Date range:', startDate, 'to', endDate);
                
                let production = await ApiService.fetchBoardProductionByGypsumBoardAndDate(
                    boardsToUse,
                    startDate,
                    endDate
                );
                
                if (!production) {
                    console.warn('Production is null or undefined, using empty array');
                    production = [];
                }
                
                console.log('Productions loaded:', production.length);
                if (production.length > 0) {
                    console.log('Production data sample:', production[0]);
                    console.log('Production dates:', production.map(p => p.productionList?.productionDate));
                }
                
                setProduction(production);
                setLoadingStatus(`Загружено производств: ${production.length}`);
            } catch (error) {
                console.error('Error fetching productions:', error);
                setProduction([]);
                setLoadingStatus('Ошибка загрузки производств');
            }
        };
        
        // Ждем загрузки всех гипсокартонов, если они нужны
        if (gypsumBoards && gypsumBoards.length > 0) {
            fetchProduction();
        } else if (allGypsumBoards.length > 0) {
            fetchProduction();
        }
    }, [startDate, endDate, gypsumBoards, allGypsumBoards]);

    // Загрузка потребления
    useEffect(() => {
        const fetchConsumption = async () => {
            if (!material) {
                console.log('No material selected');
                setConsumptions([]);
                return;
            }

            try {
                setLoadingStatus('Загрузка списаний...');
                console.log('Fetching consumptions for material:', material.id);
                
                let consumption = await ApiService.fetchConsumptionsByDateAndMaterial(
                    startDate,
                    endDate,
                    material.id
                );
                
                if (!consumption) {
                    console.warn('Consumption is null or undefined, using empty array');
                    consumption = [];
                }
                
                console.log('Consumptions loaded:', consumption.length);
                if (consumption.length > 0) {
                    console.log('Consumption data sample:', consumption[0]);
                }
                
                setConsumptions(consumption);
                setLoadingStatus(`Загружено списаний: ${consumption.length}`);
            } catch (error) {
                console.error('Error fetching consumptions:', error);
                setConsumptions([]);
                setLoadingStatus('Ошибка загрузки списаний');
            }
        };
        
        fetchConsumption();
    }, [startDate, endDate, material]);

    // Обработка данных
    const processData = async (
        productions: BoardProduction[],
        consumptions: MaterialConsumption[],
        aggregation: AggregationType,
        onProgress?: (progress: number) => void
    ): Promise<{ [date: string]: ChartData & { dateObj: Date } }> => {
        const draftData: { [date: string]: ChartData & { dateObj: Date } } = {};
        const totalItems = productions.length;

        if (totalItems === 0) {
            console.warn('No productions to process');
            return draftData;
        }

        // Создаем карту для быстрого поиска спецификаций по продукту
        const specMap = new Map();
        specifications.forEach(spec => {
            if (spec.product && spec.product.id) {
                specMap.set(spec.product.id, spec);
            }
        });

        // Создаем карту для быстрого поиска потребления по productionList.id
        const consumptionMap = new Map();
        consumptions.forEach(cons => {
            if (cons.productionList && cons.productionList.id) {
                consumptionMap.set(cons.productionList.id, cons);
            }
        });

        console.log('Spec map size:', specMap.size);
        console.log('Consumption map size:', consumptionMap.size);

        for (let i = 0; i < productions.length; i++) {
            const production = productions[i];
            
            if (onProgress) {
                const progress = Math.round(((i + 1) / totalItems) * 100);
                onProgress(progress);
            }
            
            if (!production.productionList) {
                console.warn('Production without productionList:', production);
                continue;
            }
            
            const originalDate = new Date(production.productionList.productionDate);
            let dateKey: string;
            let dateObj: Date;

            if (aggregation === 'month') {
                dateObj = new Date(originalDate.getFullYear(), originalDate.getMonth(), 1);
                dateKey = `${originalDate.getFullYear()}-${String(originalDate.getMonth() + 1).padStart(2, '0')}`;
            } else {
                dateObj = new Date(originalDate.getFullYear(), originalDate.getMonth(), originalDate.getDate());
                dateKey = originalDate.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
            }

            const consumption = consumptionMap.get(production.productionList.id)?.quantity || 0;
            const spec = specMap.get(production.product.id);
            const rate = spec ? spec.quantity : 0;

            const existingData = draftData[dateKey];

            if (existingData) {
                existingData.rate += rate * production.value;
                existingData.productionValue += production.value;
                existingData.consumption += consumption;
            } else {
                draftData[dateKey] = {
                    productionValue: production.value,
                    consumption: consumption,
                    consumptionPerSquare: 0,
                    rate: rate * production.value,
                    dateObj: dateObj,
                };
            }
            
            if (i % 100 === 0) {
                await new Promise(resolve => setTimeout(resolve, 0));
            }
        }

        const dateKeys = Object.keys(draftData);
        for (let i = 0; i < dateKeys.length; i++) {
            const dateKey = dateKeys[i];
            const data = draftData[dateKey];
            data.consumptionPerSquare = data.productionValue !== 0 ? data.consumption / data.productionValue : 0;
            data.rate = data.productionValue !== 0 ? data.rate / data.productionValue : 0;
            
            console.log(`Date: ${dateKey}, productionValue: ${data.productionValue}, consumption: ${data.consumption}, rate: ${data.rate}, consumptionPerSquare: ${data.consumptionPerSquare}`);
        }

        return draftData;
    };

    const formatXAxis = (dateKey: string, aggregation: AggregationType): string => {
        if (aggregation === 'month') {
            const [year, month] = dateKey.split('-');
            const date = new Date(parseInt(year), parseInt(month) - 1);
            return date.toLocaleDateString('ru-RU', { month: 'short', year: '2-digit' });
        }
        return dateKey;
    };

    useEffect(() => {
        const updateChartData = async () => {
            console.log('Updating chart data...');
            console.log('Productions:', productions.length);
            console.log('Consumptions:', consumptions.length);
            console.log('Specifications:', specifications.length);
            
            if (productions.length > 0) {
                setIsProcessing(true);
                setProcessingProgress(0);
                
                try {
                    const draftData = await processData(
                        productions, 
                        consumptions, 
                        aggregationType,
                        (progress) => setProcessingProgress(progress)
                    );
                    
                    const sortedEntries = Object.entries(draftData).sort((a, b) => 
                        a[1].dateObj.getTime() - b[1].dateObj.getTime()
                    );
                    
                    const combinedData: CombinedData[] = sortedEntries.map(([dateKey, value]) => ({
                        date: formatXAxis(dateKey, aggregationType),
                        consumptionPerSquare: value.consumptionPerSquare,
                        rate: value.rate,
                        originalDate: value.dateObj
                    }));
                    
                    console.log('Chart data prepared:', combinedData.length);
                    setChartData(combinedData);
                } catch (error) {
                    console.error('Ошибка обработки данных:', error);
                } finally {
                    setIsProcessing(false);
                    setProcessingProgress(0);
                }
            } else {
                console.log('No productions data');
                setChartData([]);
                setIsProcessing(false);
            }
        };
        
        updateChartData();
    }, [productions, consumptions, specifications, aggregationType]);

    const ProgressBar = () => (
        <div className="text-center py-5" style={{ maxWidth: '400px', margin: '0 auto' }}>
            <div className="progress" style={{ height: '8px', borderRadius: '100px', backgroundColor: '#f1f5f9' }}>
                <div 
                    className="progress-bar bg-primary"
                    role="progressbar"
                    style={{ 
                        width: `${processingProgress}%`,
                        transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        borderRadius: '100px'
                    }}
                />
            </div>
            <p className="mt-3 text-muted small">
                Анализ данных... {processingProgress}%
            </p>
        </div>
    );

    const legendFormatter = (value: string) => {
        return value === 'rate' ? 'Норма расхода' : 'Фактический расход';
    };

    const handleManualRefresh = () => {
        setProduction([]);
        setConsumptions([]);
        setChartData([]);
        setLoadingStatus('Обновление...');
        // Принудительно перезагружаем
        setTimeout(() => {
            setLoadingStatus('Обновление данных...');
        }, 100);
    };

    const getBoardNames = () => {
        const boardsToShow = gypsumBoards && gypsumBoards.length > 0 ? gypsumBoards : allGypsumBoards;
        if (boardsToShow.length === 0) return 'Нет гипсокартонов';
        if (boardsToShow.length > 3) {
            return `${boardsToShow.slice(0, 3).map(b => ApiService.getName(b)).join(', ')} и еще ${boardsToShow.length - 3}`;
        }
        return boardsToShow.map(b => ApiService.getName(b)).join(', ');
    };

    if (!material) {
        return (
            <Container>
                <Card className="mt-lg-5 shadow-sm border-0" style={{ borderRadius: '16px', overflow: 'hidden', background: '#fff' }}>
                    <Card.Body className="text-center py-5">
                        <p className="text-muted">Выберите материал для отображения графика</p>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    return (
        <Container>
            <Card className="mt-lg-5 shadow-sm border-0" style={{ borderRadius: '16px', overflow: 'hidden', background: '#fff' }}>
                <Card.Header className="bg-transparent border-0 pt-4 px-4">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                        <div>
                            <h5 className="mb-1" style={{ fontWeight: 600, color: '#0f172a', textTransform: 'capitalize' }}>
                                Расход на м²: {material ? material.name.toLowerCase() : "Не выбран материал"}
                            </h5>
                            <p className="text-muted small mb-0">Сравнение плановых нормативов и фактического списания сырья</p>
                            {loadingStatus && (
                                <p className="text-muted small mt-1" style={{ fontSize: '11px' }}>
                                    Статус: {loadingStatus}
                                </p>
                            )}
                        </div>
                        <div className="d-flex gap-2">
                            <ToggleButtonGroup
                                type="radio"
                                name="aggregation"
                                value={aggregationType}
                                onChange={(val) => val && setAggregationType(val as AggregationType)}
                                size="sm"
                                style={{ 
                                    background: '#f1f5f9', 
                                    padding: '3px', 
                                    borderRadius: '8px',
                                    border: 'none'
                                }}
                            >
                                <ToggleButton 
                                    id="agg-day" 
                                    value="day" 
                                    variant="light"
                                    className="border-0 px-3"
                                    style={{ 
                                        borderRadius: '6px',
                                        fontSize: '13px',
                                        fontWeight: aggregationType === 'day' ? 600 : 400,
                                        backgroundColor: aggregationType === 'day' ? '#fff' : 'transparent',
                                        boxShadow: aggregationType === 'day' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                                    }}
                                >
                                    По дням
                                </ToggleButton>
                                <ToggleButton 
                                    id="agg-month" 
                                    value="month" 
                                    variant="light"
                                    className="border-0 px-3"
                                    style={{ 
                                        borderRadius: '6px',
                                        fontSize: '13px',
                                        fontWeight: aggregationType === 'month' ? 600 : 400,
                                        backgroundColor: aggregationType === 'month' ? '#fff' : 'transparent',
                                        boxShadow: aggregationType === 'month' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                                    }}
                                >
                                    По месяцам
                                </ToggleButton>
                            </ToggleButtonGroup>
                            <button 
                                className="btn btn-outline-secondary btn-sm"
                                onClick={handleManualRefresh}
                                style={{ borderRadius: '8px' }}
                                title="Обновить данные"
                            >
                                🔄
                            </button>
                        </div>
                    </div>
                </Card.Header>
                
                <Card.Body className="px-4 pb-4">
                    <Col className="col-12" style={{ minWidth: '500px', width: '100%', height: '320px' }}>
                        {isProcessing ? (
                            <ProgressBar />
                        ) : chartData.length === 0 ? (
                            <div className="text-center py-5">
                                <p className="text-muted small">Нет доступных данных за выбранный период</p>
                                <div className="text-muted small" style={{ fontSize: '11px' }}>
                                    <p>Производств: {productions.length}</p>
                                    <p>Списаний: {consumptions.length}</p>
                                    <p>Спецификаций: {specifications.length}</p>
                                    <p>Гипсокартонов: {(gypsumBoards && gypsumBoards.length > 0) ? gypsumBoards.length : allGypsumBoards.length}</p>
                                    <button 
                                        className="btn btn-primary btn-sm mt-2"
                                        onClick={handleManualRefresh}
                                    >
                                        Обновить данные
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={chartData}
                                    margin={{ top: 15, right: 10, left: -10, bottom: 5 }}
                                >
                                    <CartesianGrid stroke={COLORS.grid} vertical={false} />
                                    
                                    <XAxis 
                                        dataKey="date" 
                                        tick={{ fill: COLORS.text, fontSize: 12 }}
                                        tickLine={false}
                                        axisLine={false}
                                        dy={10}
                                        interval={aggregationType === 'month' ? 0 : 'preserveStartEnd'}
                                    />
                                    <YAxis 
                                        tick={{ fill: COLORS.text, fontSize: 12 }}
                                        tickLine={false}
                                        axisLine={false}
                                        dx={-5}
                                        domain={['auto', 'auto']}
                                    />
                                    
                                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e2e8f0', strokeWidth: 1 }} />
                                    
                                    <Legend 
                                        formatter={legendFormatter} 
                                        iconType="circle" 
                                        iconSize={8}
                                        wrapperStyle={{ paddingTop: '20px', fontSize: '13px', color: '#475569' }} 
                                    />
                                    
                                    <Line 
                                        type="monotone" 
                                        dataKey="consumptionPerSquare" 
                                        stroke={COLORS.fact} 
                                        strokeWidth={2.5}
                                        dot={false}
                                        activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }} 
                                    />
                                    <Line 
                                        type="monotone" 
                                        dataKey="rate" 
                                        stroke={COLORS.rate} 
                                        strokeWidth={2.5}
                                        dot={false}
                                        activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }} 
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </Col>
                </Card.Body>
                
                <Card.Footer className="bg-light border-0 py-2 px-4" style={{ backgroundColor: '#f8fafc' }}>
                    <div className="d-flex flex-wrap gap-2 align-items-center">
                        <span className="text-muted" style={{ fontSize: '11px', fontWeight: 500 }}>Объекты анализа:</span>
                        <p className="mb-0 text-secondary text-truncate" style={{ fontSize: '11px', maxWidth: '90%' }}>
                            {getBoardNames()}
                        </p>
                    </div>
                </Card.Footer>
            </Card>
        </Container>
    );
}

export default ConsumptionChart;