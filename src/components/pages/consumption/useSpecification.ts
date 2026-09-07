import { useQuery } from "@tanstack/react-query";
import ApiService from "../../../service/ApiService";
import GypsumBoard from "../../../model/gypsumBoard/GypsumBoard";

export const useSpecification = (gypsumBoard: GypsumBoard) => {
    const { data: specification = [], isLoading: isLoadingBoards } = useQuery({
        queryKey: ['specification'],
        queryFn: () => ApiService.fetchSpecification(gypsumBoard),
        //staleTime: 5 * 60 * 1000, // Данные считаются свежими 5 минут (не будут перезапрашиваться лишний раз)
    });

    return {
        specification,
        isLoadingBoards
    };
}