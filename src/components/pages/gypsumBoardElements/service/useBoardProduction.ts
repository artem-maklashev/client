// useBoardProduction.ts
import { useQuery } from '@tanstack/react-query';
import ApiService from '../../../../service/ApiService';
import { useMemo } from 'react';

export const useBoardProduction = (startDate: Date, endDate: Date) => {
    // 1. Запрашиваем план
    const { data: plan = [], isLoading: isLoadingPlan } = useQuery({
        // Уникальный ключ. Изменятся даты -> произойдет новый запрос
        queryKey: ['board-plan', startDate, endDate],
        queryFn: () => ApiService.fetchPlan(startDate, endDate),
        staleTime: 5 * 60 * 1000, // Данные считаются свежими 5 минут (не будут перезапрашиваться лишний раз)
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

    // 3. Вычисления (выполняются автоматически, когда приходят data)
    const planSum = plan.reduce((sum, item) => sum + item.planValue, 0);
    const factSum = fact
        .filter(f => f.category.id > 1 && f.category.id <= 4)
        .reduce((sum, item) => sum + item.value, 0);

    const todayPlan = plan.filter(item => getPlanDate(new Date(item.planDate)) === getPlanDate(new Date()));
    const toTodayPlan = plan
        .filter((p) => new Date(p.planDate) < new Date(getCurrentDate()))
        .reduce((acc, p) => acc + p.planValue, 0);

    const deviation = factSum - toTodayPlan;

    const sortedBoardProduction = fact.filter((board) => board.category.id < 5);
    const { total, value } = sortedBoardProduction.reduce(
        (acc, board) => {
            if (board.category.id === 1) {
                acc.total += board.value;
            } else {
                acc.value += board.value;
            }
            return acc;
        },
        { total: 0, value: 0 }
    );

    const lastThreeDays: Date[] = Array.from(
        new Set(
            fact.map((bp) => {
                // Создаем дату и обнуляем время до 00:00:00, 
                // чтобы даты одного дня с разным временем схлопнулись в одну
                return new Date(bp.productionList.productionDate).setHours(0, 0, 0, 0);
            })
        )
    )
        .sort((a, b) => b - a) // Сортируем по убыванию (от самых новых к старым)
        .slice(0, 3)           // Оставляем только первые 3 элемента
        .map((timestamp) => new Date(timestamp)); // Превращаем числа обратно в объекты Date

    const defectPercentResult = total === 0 ? 0 : ((total - value) / total) * 100;

    const productionDict: Record<string, number[]> = useMemo(() => {
        return fact.reduce((acc, bp) => {
            // 1. Получаем дату и превращаем её в удобную строку-ключ.
            // Если вам нужно группировать строго по дням (без учета времени):
            const dateKey = new Date(bp.productionList.productionDate).toLocaleDateString("ru-RU");
            // Результат будет в виде "01.09.2026"

            // 2. Получаем ID (обратите внимание на регистр, обычно id пишется с маленькой буквы)
            const listId = bp.productionList.id;

            // 3. Если такого ключа(даты) еще нет в словаре, создаем пустой массив
            if (!acc[dateKey]) {
                acc[dateKey] = [];
            }

            // 4. Добавляем ID в массив, только если его там еще нет (чтобы избежать дубликатов)
            if (!acc[dateKey].includes(listId)) {
                acc[dateKey].push(listId);
            }

            return acc;
        }, {} as Record<string, number[]>);
    }, [fact]); // useMemo будет пересчитывать только если fact изменится


    return {
        isLoading: isLoadingPlan || isLoadingFact, // Общий статус загрузки
        planSum,
        factSum,
        deviation,
        defectPercentResult,
        todayPlan,
        lastThreeDays,
        productionDict,
    };
};