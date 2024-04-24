import React, { useCallback, useEffect, useState } from "react";

import { api } from "../../../service/Api";
import BoardProduction from "../../../model/production/BoardProduction";

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

export const ProductionLogData = () => {
    const [productionList, setProductionList] = useState<BoardProduction[]>([]);
    const [errorText, setErrorText] = useState<string | null>(null);

    const fetchProductionData = useCallback(async () => {
        try {
            const response = await api.get(`${process.env.REACT_APP_API_URL}/boardProductions_10`);
            const data: BoardProduction[] = response.data;
            setProductionList(data);
        } catch (error) {
            console.error('fetch productionList failed', error);
            setErrorText('Данные по ProductionList не могут быть загружены. Попробуйте позже.');
        }
    }, []);
    useEffect(() => {
        const fetchData = async () => {
            await fetchProductionData();
        };
        fetchData();
    }, [fetchProductionData]);
    return { productionList, errorText };
};
