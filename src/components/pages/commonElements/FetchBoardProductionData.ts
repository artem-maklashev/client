import { useEffect, useState, useCallback } from 'react';
import BoardProduction from '../../../model/production/BoardProduction';
import {api} from "../../../service/Api";


export const useFetchProductionData = (
    selectedStartDate: string,
    selectedEndDate: string
) => {
    const [productionData, setProductionData] = useState<BoardProduction[]>([]);
    const [errorText, setErrorText] = useState<string | null>(null);

    const fetchProductionData = useCallback(async () => {
        try {
            const params = new URLSearchParams({
                startDate: selectedStartDate,
                endDate: selectedEndDate,
            });

            const response = await api.get(`${process.env.REACT_APP_API_URL}/allboard/production?${params.toString()}`);

            if (!response.data) {
                throw new Error(`Ошибка при запросе: ${response.status} ${response.statusText}`);
            }

            const data: BoardProduction[] = await response.data;
            setErrorText(null);
            setProductionData(data);
            console.log("Получены данные по выпуску продукции " + data.length);
        } catch (error: any) {
            console.error(`Произошла ошибка: ${error.message}`);
            setErrorText(error.message);
            setProductionData([]);
        }
    }, [selectedStartDate, selectedEndDate]);

    useEffect(() => {
        const fetchData = async () => {
            await fetchProductionData();
        };
        fetchData();
    }, [selectedStartDate, selectedEndDate, fetchProductionData]);

    return { productionData, errorText };
};
