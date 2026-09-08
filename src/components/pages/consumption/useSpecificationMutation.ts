import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ConsumptionApiService } from "./ConsumptionApiService";

export const useSpecificationMutations = () => {
    const queryClient = useQueryClient();

    // 1. Мутация обновления
    const updateMutation = useMutation({
        mutationFn: ({ materialId, quantity, productId}: { materialId: number; quantity: number, productId: number }) => 
            ConsumptionApiService.updateSpecification(materialId, quantity, productId),
        onSuccess: () => {
            // Сбрасываем кеш спецификаций, чтобы React Query перезагрузил свежие данные
            queryClient.invalidateQueries({ queryKey: ['specification'] });
        },
    });

    // 2. Мутация удаления
    const removeMutation = useMutation({
        mutationFn: ({materialId, productId} : {materialId: number, productId: number}) => 
            ConsumptionApiService.removeSpecification(materialId, productId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['specification'] });
        },
    });

    // 3. Мутация добавления
    const addMutation = useMutation({
        mutationFn: ({ materialId, quantity, productId }: { materialId: number; quantity: number, productId: number }) => 
            ConsumptionApiService.addSpecification(materialId, quantity, productId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['specification'] });
        },
    });

    return {
        updateSpecification: updateMutation.mutate,
        removeSpecification: removeMutation.mutate,
        addSpecification: addMutation.mutate,
        isUpdating: updateMutation.isPending,
        isRemoving: removeMutation.isPending,
        isAdding: addMutation.isPending,
    };
};