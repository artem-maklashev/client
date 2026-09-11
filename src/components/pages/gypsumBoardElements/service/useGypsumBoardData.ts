import { useQuery } from "@tanstack/react-query";
import ApiService from "../../../../service/ApiService";
import GypsumBoardInputData from "../../../../model/inputData/GypsumBoardInputData";

export const useGypsumBoardData = (startDate: Date, endDate: Date) => {
    const { data: gypsumBoardData = [], isLoading: isLoadingGypsumBoardData } = useQuery({
        queryKey: ['gypsumBoardData', startDate, endDate],
        queryFn: () => ApiService.fetchGypsumBoardData(startDate, endDate),
        staleTime: 5 * 60 * 1000,
    });
    return { gypsumBoardData, isLoadingGypsumBoardData };
}