import { useQuery } from "@tanstack/react-query";
import { ProductAverageConsumption } from "../../../../model/specification/conumptions/ProductAverageConsumption";
import ApiService from "../../../../service/ApiService";

export const useBoardConsumption = (productionListIds: number[], difference: number) => {
    const { data: productConsumptions = [] as ProductAverageConsumption[], isLoading: isLoadingConsumption } 
    = useQuery<ProductAverageConsumption[]>({
        queryKey: ['consumptions', productionListIds, difference],
        queryFn: () => ApiService.getConsumptionsDifferenceByProduction(productionListIds, difference),
        staleTime: 5 * 60 * 1000, // Данные считаются свежими 5 минут (не будут перезапрашиваться лишний раз)
    });
    return {
        productConsumptions,
        isLoadingConsumption,
    }
}