import { useQuery } from "@tanstack/react-query"
import ApiService from "../../../../service/ApiService";

export const useDelays = (startDate: Date, endDate: Date) => {
    const {
        data: delays = [],
        isLoading: isLoadingDelays = false,
        error: errorDelays = null,
    } = useQuery({
        queryKey: ['delays', startDate, endDate], 
        queryFn: () => ApiService.fetchDelaysPanelData(startDate, endDate),
        enabled: !!startDate && !!endDate,
        staleTime: 1000 * 60 * 5,
    });
    return { delays, isLoadingDelays, errorDelays };
}