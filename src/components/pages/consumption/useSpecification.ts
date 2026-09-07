import { useQuery } from "@tanstack/react-query";
import ApiService from "../../../service/ApiService";
import GypsumBoard from "../../../model/gypsumBoard/GypsumBoard";

export const useSpecification = (board: GypsumBoard | null) => {
    const {
        data: specification = null,
        isLoading: isLoadingSpecification,
        isError
    } = useQuery({
        // 1. Ключ зависит от ID доски. Если ID меняется, React Query сам делает новый запрос.
        queryKey: ['specification', board?.id], 
        
        // 2. Функция запроса передает нужный ID на бэкенд
        queryFn: () => ApiService.fetchSpecification(board), 
        
        // 3. Важно! Запрос не выполнится, пока board равен null
        enabled: !!board, 
    });

    return { specification, isLoadingSpecification, isError };
};