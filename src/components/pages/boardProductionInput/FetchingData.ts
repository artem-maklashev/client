import {useCallback, useEffect, useState} from "react";
import GypsumBoardCategory from "../../../model/gypsumBoard/GypsumBoardCategory";

export const FetchData = (selectedStartDate: string, selectedEndDate: string) => {
        const [boardCategories, setBoardsCategory] = useState<GypsumBoardCategory[]>([]);
        // const [productionData, setProductionData] = useState<BoardProduction[]>([]);
        const [errorText, setErrorText] = useState<string | null>(null);

        const fetchBoardCategories = useCallback(async () => {
            try {
                const params = new URLSearchParams();
                const response = await fetch(`${process.env.REACT_APP_API_URL}/boardProductionData?${params.toString()}`);
                if (!response.ok) {
                    throw new Error(`Ошибка при запросе: ${response.status} ${response.statusText}`);
                }
                const boardCategoriesData: GypsumBoardCategory[] = await response.json();
                setErrorText(null);
                setBoardsCategory(boardCategoriesData);
            } catch
                (error: any) {
                console.error(`Произошла ошибка: ${error.message}`);
                setErrorText(error.message);
                setBoardsCategory([]);
            }
        }, []);


// const fetchProductionData = useCallback(async () => {
//     try {
//         const params = new URLSearchParams({
//             startDate: selectedStartDate,
//             endDate: selectedEndDate,
//         });
//
//         const response = await fetch(`${process.env.REACT_APP_API_URL}/allboard/production?${params.toString()}`);
//
//         if (!response.ok) {
//             throw new Error(`Ошибка при запросе: ${response.status} ${response.statusText}`);
//         }
//
//         const data: BoardProduction[] = await response.json();
//         setErrorText(null);
//         setProductionData(data);
//         console.log("Получены данные по выпуску продукции " + data.length);
//     } catch (error: any) {
//         console.error(`Произошла ошибка: ${error.message}`);
//         setErrorText(error.message);
//         setProductionData([]);
//     }
// }, [selectedStartDate, selectedEndDate]);

        useEffect(() => {
            const fetchData = async () => {
                await fetchBoardCategories();
            };
            fetchData();
        }, [fetchBoardCategories]);

        return {fetchBoardCategories, errorText};
    }
;