import { useEffect, useState } from "react";
import { SelectChangeEvent } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import ApiService from "../../../service/ApiService";
import GypsumBoard from "../../../model/gypsumBoard/GypsumBoard";
import { useMaterials } from "./useMaterial";
import { useSpecification } from "./useSpecification";

export const useConsumption = () => {
    const [selectedGypsumBoard, setSelectedGypsumBoard] = useState<GypsumBoard | null>(null);

    // Устанавливаем заголовок страницы (это по-прежнему сайд-эффект UI, оставляем тут)
    useEffect(() => {
        document.title = "Декоратор | Спецификация";
    }, []);

    // 1. Вся магия загрузки данных теперь здесь
    const { 
        data: allGypsumBoards = [], // Значение по умолчанию, пока данные грузятся
        isLoading: isLoadingBoards,
        isError 
    } = useQuery({
        queryKey: ['gypsumBoards'], // Уникальный ключ кеша для этого запроса
        queryFn: () => ApiService.fetchGypsumBoards(),
    });

    // 2. Авто-выбор первого элемента после успешной загрузки
    useEffect(() => {
        if (allGypsumBoards.length > 0 && !selectedGypsumBoard) {
            setSelectedGypsumBoard(allGypsumBoards[0]);
        }
    }, [allGypsumBoards, selectedGypsumBoard]);

    const { materials, isLoadingMaterials } = useMaterials();
    const { specification, isLoadingSpecification } = useSpecification(selectedGypsumBoard);

    // Обработчик выбора (остался без изменений)
    const handleGypsumChange = (event: SelectChangeEvent<string | number>) => {
        const rawValue = event.target.value;
        if (rawValue !== "") {
            const itemId = typeof rawValue === 'string' ? parseInt(rawValue, 10) : rawValue;
            const selectedBoard = allGypsumBoards.find(b => b.id === itemId) || null;
            setSelectedGypsumBoard(selectedBoard); 
        } else {
            setSelectedGypsumBoard(null);
        }
    };

    return {
        allGypsumBoards,
        selectedGypsumBoard,
        handleGypsumChange,
        isLoadingBoards, // Можно передать в UI, чтобы задизейблить селект, пока он пустой
        materials,
        isLoadingMaterials,
        specification,
        isLoadingSpecification
    };
};