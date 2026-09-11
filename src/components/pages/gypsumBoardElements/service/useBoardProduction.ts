// useBoardProduction.ts
import { useQuery } from '@tanstack/react-query';
import ApiService from '../../../../service/ApiService';
import { useMemo } from 'react';
import Shift from '../../../../model/Shift';
import { useGypsumBoardData } from './useGypsumBoardData';

export const useBoardProduction = (startDate: Date, endDate: Date) => {
    // 1. Запрашиваем план
    const { data: plan = [], isLoading: isLoadingPlan } = useQuery({
        queryKey: ['board-plan', startDate, endDate],
        queryFn: () => ApiService.fetchPlan(startDate, endDate),
        staleTime: 5 * 60 * 1000,
    });

    // 2. Запрашиваем факт
    const { data: fact = [], isLoading: isLoadingFact } = useQuery({
        queryKey: ['board-fact', startDate, endDate],
        queryFn: () => ApiService.fetchBoardProduction(startDate, endDate),
        staleTime: 5 * 60 * 1000,
    });

    const getPlanDate = (date: Date) => {
        return date.toLocaleDateString("ru-RU", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    };

    function getCurrentDate(): string {
        const today = new Date();
        const year = today.getUTCFullYear();
        const month = (today.getUTCMonth() + 1).toString().padStart(2, "0");
        const day = today.getUTCDate().toString().padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    // 3. Вычисления плана и факта
    const planSum = plan.reduce((sum, item) => sum + item.planValue, 0);
    const factSum = fact
        .filter(f => f.category.id > 1 && f.category.id <= 4)
        .reduce((sum, item) => sum + item.value, 0);

    const todayPlan = plan.filter(item => getPlanDate(new Date(item.planDate)) === getPlanDate(new Date()));
    const toTodayPlan = plan
        .filter((p) => new Date(p.planDate) < new Date(getCurrentDate()))
        .reduce((acc, p) => acc + p.planValue, 0);

    const deviation = factSum - toTodayPlan;

    // 4. Последние три уникальных производственных дня
    const lastThreeDays: Date[] = Array.from(
        new Set(
            fact.map((bp) => new Date(bp.productionList.productionDate).setHours(0, 0, 0, 0))
        )
    )
        .sort((a, b) => b - a)
        .slice(0, 3)
        .map((timestamp) => new Date(timestamp));

    // 5. Расчет брака (общий и по сменам)
    const calculations = useMemo(() => {
        // Категория 1 — валовый объем (Total), 2..4 — товарная продукция (Good)
        const sortedBoardProduction = fact.filter((board) => board.category.id <= 4);

        const { totalProduced, goodProduced } = sortedBoardProduction.reduce(
            (acc, board) => {
                if (board.category.id === 1) {
                    acc.totalProduced += board.value;
                } else {
                    acc.goodProduced += board.value;
                }
                return acc;
            },
            { totalProduced: 0, goodProduced: 0 }
        );

        const defectProduced = Math.max(0, totalProduced - goodProduced);
        const defectPercentResult = totalProduced > 0 
            ? (defectProduced / totalProduced) * 100 
            : 0;

        // Группировка по смене (по shift.id во избежание дублей по ссылкам объектов)
        interface ShiftAccumulator {
            shift: Shift;
            totalProduced: number;
            goodProduced: number;
        }

        const shiftDataMap = fact
            .filter((bp) => bp.category.id <= 4)
            .reduce((acc, bp) => {
                const shift = bp.productionList.shift;
                const shiftId = shift.id;
                const value = bp.value;

                const current = acc.get(shiftId) ?? {
                    shift,
                    totalProduced: 0,
                    goodProduced: 0,
                };

                if (bp.category.id === 1) {
                    current.totalProduced += value;
                } else {
                    current.goodProduced += value;
                }

                acc.set(shiftId, current);
                return acc;
            }, new Map<number, ShiftAccumulator>());

        const sortedDefectPercentByShift = new Map<Shift, number>(
            [...shiftDataMap.values()]
                .sort((a, b) => a.shift.id - b.shift.id)
                .map(({ shift, totalProduced, goodProduced }) => {
                    const shiftDefect = Math.max(0, totalProduced - goodProduced);
                    const percent = totalProduced > 0 
                        ? (shiftDefect / totalProduced) * 100 
                        : 0;
                    return [shift, percent];
                })
        );

        return {
            defectPercentResult,
            sortedDefectPercentByShift,
        };
    }, [fact]);

    // 6. Выпуск за последние доступные сутки (возвращает объект данных гипсокартона)
    // Определяем дату последних доступных производственных суток до сегодняшнего дня
    const latestProdDate = useMemo(() => {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        // Поиск максимальной даты до сегодняшнего дня
        let latestTimestamp: number | null = null;
        fact.forEach((bp) => {
            const prodDate = new Date(bp.productionList.productionDate);
            prodDate.setHours(0, 0, 0, 0);
            const time = prodDate.getTime();

            if (time < startOfToday.getTime()) {
                if (latestTimestamp === null || time > latestTimestamp) {
                    latestTimestamp = time;
                }
            }
        });

        return latestTimestamp === null ? null : new Date(latestTimestamp);
    }, [fact]);

    // Запасной вариант — вчерашняя дата (стабильная, чтобы не менять queryKey)
    const fallbackYesterday = useMemo(() => {
        const d = new Date();
        d.setDate(d.getDate() - 1);
        d.setHours(0, 0, 0, 0);
        return d;
    }, []);

    // Хук вызывается безусловно (соблюдение правил хуков), поэтому результат никогда не null
    const targetDate = latestProdDate ?? fallbackYesterday;
    const yesterdayProduction = useGypsumBoardData(targetDate, targetDate);

    // 7. Словарь списков производства по датам
    const productionDict: Record<string, number[]> = useMemo(() => {
        return fact.reduce((acc, bp) => {
            const dateKey = new Date(bp.productionList.productionDate).toLocaleDateString("ru-RU");
            const listId = bp.productionList.id;

            if (!acc[dateKey]) {
                acc[dateKey] = [];
            }

            if (!acc[dateKey].includes(listId)) {
                acc[dateKey].push(listId);
            }

            return acc;
        }, {} as Record<string, number[]>);
    }, [fact]);



    return {
        isLoading: isLoadingPlan || isLoadingFact,
        planSum,
        factSum,
        deviation,
        defectPercentResult: calculations.defectPercentResult,
        sortedDefectPercentByShift: calculations.sortedDefectPercentByShift,
        todayPlan,
        lastThreeDays,
        productionDict,
        yesterdayProduction,
    };
};