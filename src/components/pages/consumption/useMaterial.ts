import { useQuery } from "@tanstack/react-query";
import ApiService from "../../../service/ApiService";

export const useMaterials =() => {
const { data: materials = [], isLoading: isLoadingMaterials
 } = useQuery({
        queryKey: ['materials'],
        queryFn: () => ApiService.fetchMaterials(),
        //staleTime: 5 * 60 * 1000, // Данные считаются свежими 5 минут (не будут перезапрашиваться лишний раз)
});

    return {
        materials,
        isLoadingMaterials
    };
}