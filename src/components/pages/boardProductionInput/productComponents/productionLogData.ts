import { useCallback, useEffect, useState } from "react";

import { api } from "../../../../service/Api";
import BoardProduction from "../../../../model/production/BoardProduction";
import ReportData from "../../../../model/ReportData";
import GypsumBoard from "../../../../model/gypsumBoard/GypsumBoard";
import GypsumBoardCategory from "../../../../model/gypsumBoard/GypsumBoardCategory";
import Delays from "../../../../model/delays/Delays";

// interface ProductionLogDataProps {
//     prodictionList: ProductionList[],
//     errorText: string | null
// }

// const ProductionLogData: React.FC<ProductionLogDataProps> = ({prodictionList, errorText}) => 
//     const [productionList, setProductionList] = useState<ProductionList[]>([]);
//     const [errorText, setErrorText] = useState<string | null>(null);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const response = await api.get(`${process.env.REACT_APP_URL}/productionList_100`);
//                 const data: ProductionList[] = response.data;
//                 setProductionList(data);
//             } catch (error) {
//                 console.error('fetch productionList failed', error);
//                 setErrorText('Данные по ProductionList не могут быть загружены. Попробуйте позже.');
//             }
//         };

//         fetchData();
//     }, []); // Пустой массив зависимостей, чтобы useEffect выполнялся только один раз после монтирования компонента

//     // Возвращаем значения, полученные с помощью хуков
//     return { productionList, errorText };
// }

// export default ProductionLogData;

export function useProductionLogData()  {
    const [productionList, setProductionList] = useState<ReportData<GypsumBoard, GypsumBoardCategory, BoardProduction, Delays>[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProductionData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.get(`${process.env.REACT_APP_API_URL}/boardProductions_10`);
            const data: ReportData<GypsumBoard, GypsumBoardCategory, BoardProduction, Delays>[] = response.data;
            setProductionList(data);
        } catch (e) {
            console.error('fetch productionList failed', e);
            setError('Данные по ProductionList не могут быть загружены. Проверьте доступность сервера и попробуйте позже.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        let isMounted = true;
        // Отменяем сброс состояния, если компонент уже размонтирован
        const run = async () => {
            await fetchProductionData();
            if (!isMounted) {
                setIsLoading(false);
                setError(null);
            }
        };
        run();
        return () => {
            isMounted = false;
        };
    }, [fetchProductionData]);

    return { productionList, fetchProductionData, isLoading, error };
};
