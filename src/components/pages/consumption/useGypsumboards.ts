import { useQuery } from "@tanstack/react-query";
import ApiService from "../../../service/ApiService";

export const useGypsumboards = () => {
    const { data: gypsumBoards
         = [], isLoading: isLoadingBoards } = useQuery({
        // Уникальный ключ. Изменятся даты -> произойдет новый запрос
        queryKey: ['gypsumboard'],
        queryFn: () => ApiService.fetchGypsumBoards(),
        staleTime: 5 * 60 * 1000, // Данные считаются свежими 5 минут (не будут перезапрашиваться лишний раз)
    });
    return {
        gypsumBoards,
        isLoadingBoards
    };
}