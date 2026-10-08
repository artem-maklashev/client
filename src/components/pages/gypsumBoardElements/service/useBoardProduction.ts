import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import ApiService from '../../../../service/ApiService';
import Shift from '../../../../model/Shift';
import { useGypsumBoardData } from './useGypsumBoardData';

/* ==========================
 * Date utils
 * ========================== */
const startOfDay = (date: Date): Date => {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
};

const getYesterday = (): Date => {
    const date = startOfDay(new Date());
    date.setDate(date.getDate() - 1);
    return date;
};

const getNextDateAfterEnd = (endDate: Date): Date => {
    const today = startOfDay(new Date());
    const normalizedEndDate = startOfDay(endDate);
    const result = new Date(
        Math.min(normalizedEndDate.getTime(), today.getTime())
    );
    result.setDate(result.getDate() + 1);
    return result;
};

const STALE_TIME = 5 * 60 * 1000;

/* ==========================
 * Hook
 * ========================== */
export const useBoardProduction = (startDate: Date, endDate: Date) => {
    const today = startOfDay(new Date());
    const nextDateAfterEnd = useMemo(() => getNextDateAfterEnd(today), [today]);
    
    // Используем timestamp для стабильной мемоизации (примитив не ломает зависимости)
    const todayTime = startOfDay(new Date()).getTime();

    /* ==========================
     * Queries
     * ========================== */
    const { data: plan = [], isLoading: isLoadingPlan } = useQuery({
        queryKey: ['board-plan', startDate, endDate],
        queryFn: () => ApiService.fetchPlan(startDate, endDate),
        staleTime: STALE_TIME,
    });

    const { data: todayPlan = [], isLoading: isLoadingTodayPlan } = useQuery({
        queryKey: ['board-plan-today', today, nextDateAfterEnd],
        queryFn: () => ApiService.fetchPlan(today, nextDateAfterEnd),
        staleTime: STALE_TIME,
    });

    const { data: fact = [], isLoading: isLoadingFact } = useQuery({
        queryKey: ['board-fact', startDate, endDate],
        queryFn: () => ApiService.fetchBoardProduction(startDate, endDate),
        staleTime: STALE_TIME,
    });

    /* ==========================
     * Plan / Fact summary
     * ========================== */
    // Оптимизация: считаем обе суммы плана за один проход (O(n) вместо O(n) + O(n))
    const { planSum, toTodayPlan } = useMemo(() => {
        return plan.reduce(
            (acc, item) => {
                acc.planSum += item.planValue;
                if (new Date(item.planDate).getTime() < todayTime) {
                    acc.toTodayPlan += item.planValue;
                }
                return acc;
            },
            { planSum: 0, toTodayPlan: 0 }
        );
    }, [plan, todayTime]);

    const factSum = useMemo(() => {
        return fact
            .filter(item => item.category.id > 1 && item.category.id <= 4)
            .reduce((sum, item) => sum + item.value, 0);
    }, [fact]);

    const deviation = factSum - toTodayPlan;

    /* ==========================
     * Last production days
     * ========================== */
    const lastThreeDays = useMemo(() => {
        const uniqueTimes = new Set(
            fact.map(bp => startOfDay(new Date(bp.productionList.productionDate)).getTime())
        );
        return [...uniqueTimes]
            .sort((a, b) => b - a)
            .slice(0, 3)
            .map(time => new Date(time));
    }, [fact]);

    /* ==========================
     * Defect calculations
     * ========================== */
    const { defectPercentResult, sortedDefectPercentByShift } = useMemo(() => {
        let totalProduced = 0;
        let goodProduced = 0;
        
        const shiftMap = new Map<number, { shift: Shift; total: number; good: number }>();

        fact.forEach(bp => {
            const { category, value, productionList: { shift } } = bp;
            if (category.id > 4) return;

            const isTotal = category.id === 1;

            // Глобальный подсчет
            if (isTotal) totalProduced += value;
            else goodProduced += value;

            // Подсчет по сменам
            const current = shiftMap.get(shift.id) ?? { shift, total: 0, good: 0 };
            if (isTotal) current.total += value;
            else current.good += value;
            
            shiftMap.set(shift.id, current);
        });

        const calcPercent = (total: number, good: number) => 
            total > 0 ? (Math.max(0, total - good) / total) * 100 : 0;

        return {
            defectPercentResult: calcPercent(totalProduced, goodProduced),
            sortedDefectPercentByShift: new Map<Shift, number>(
                [...shiftMap.values()]
                    .sort((a, b) => a.shift.id - b.shift.id)
                    .map(({ shift, total, good }) => [shift, calcPercent(total, good)])
            ),
        };
    }, [fact]);

    /* ==========================
     * Latest completed day
     * ========================== */
    const latestProdDate = useMemo(() => {
        const pastDates = fact
            .map(bp => startOfDay(new Date(bp.productionList.productionDate)).getTime())
            .filter(time => time < todayTime);

        return pastDates.length > 0 ? new Date(Math.max(...pastDates)) : null;
    }, [fact, todayTime]);

    const targetDate = latestProdDate ?? getYesterday();
    
    // Предполагается, что useGypsumBoardData умеет корректно обрабатывать изменения targetDate
    const yesterdayProduction = useGypsumBoardData(targetDate, targetDate);

    /* ==========================
     * Production dictionary
     * ========================== */
    const productionDict = useMemo(() => {
        const dict: Record<string, number[]> = {};
        
        fact.forEach(bp => {
            const dateKey = new Date(bp.productionList.productionDate).toLocaleDateString('ru-RU');
            const listId = bp.productionList.id;

            if (!dict[dateKey]) dict[dateKey] = [];
            if (!dict[dateKey].includes(listId)) dict[dateKey].push(listId);
        });
        
        return dict;
    }, [fact]);

    return {
        isLoading: isLoadingPlan || isLoadingTodayPlan || isLoadingFact,
        planSum,
        factSum,
        deviation,
        defectPercentResult,
        sortedDefectPercentByShift,
        todayPlan,
        lastThreeDays,
        productionDict,
        yesterdayProduction,
    };
};