import { useCallback, useEffect, useState } from "react";
import GypsumBoard from "../../../model/gypsumBoard/GypsumBoard";
import { api } from "../../../service/Api";

export const GypsumBoardList = () => {
    const [ gypsumBoardList, setGypsumBoardList] = useState<GypsumBoard[]>([]);
    const [errorText, setErrorText] = useState<string | null>(null);

    const fetchGypsmBoardList = useCallback(async () => {
        try {
            const response = await api.get(`${process.env.REACT_APP_API_URL}/gypsumBoard`);
            const data: GypsumBoard[] = response.data;
            setGypsumBoardList(data);
        } catch (error) {
            console.error('fetch productionList failed', error);
            setErrorText('Данные по ProductionList не могут быть загружены. Попробуйте позже.');
        }
    }, []);
    useEffect(() => {
        const fetchData = async () => {
            await fetchGypsmBoardList();
        };
        fetchData();
    }, [fetchGypsmBoardList]);
    return { gypsumBoardList, errorText };
};