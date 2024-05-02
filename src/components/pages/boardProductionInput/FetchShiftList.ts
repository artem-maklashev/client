import { useCallback, useEffect, useState } from "react";
import Shift from "../../../model/Shift";
import { api } from "../../../service/Api";

export const ShiftList = () => {
    const [ shiftList, setShiftList] = useState<Shift[]>([]);
    const [errorText, setErrorText] = useState<string | null>(null);

    const fetchShiftList = useCallback(async () => {
        try {
            const response = await api.get(`${process.env.REACT_APP_API_URL}/shift`);
            const data: Shift[] = response.data;
            setShiftList(data);
        } catch (error) {
            console.error('fetch productionList failed', error);
            setErrorText('Данные по ProductionList не могут быть загружены. Попробуйте позже.');
        }
    }, []);
    useEffect(() => {
        const fetchData = async () => {
            await fetchShiftList();
        };
        fetchData();
    }, [fetchShiftList]);
    return { shiftList, errorText };
};