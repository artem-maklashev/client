import React, { FC, useEffect, useMemo, useState } from "react";
import DelayType from "../../../../model/delays/DelayType";
import { Dropdown } from "primereact/dropdown";
import FetchDelaysData from "../../boardProductionInput/delayComponents/FetchDelaysData";

interface DelayTypeSelectorProps {
    type: DelayType | null;    
    onChange: (type: DelayType) => void;
}

const DelayTypeSelector: FC<DelayTypeSelectorProps> = ({ type, onChange }) => {
    const [delayType, setDelayType] = useState<DelayType | null>(type);
    const fetcher = useMemo(() => new FetchDelaysData(), []);
    const [delayTypeOptions, setDelayTypeOptions] = useState<DelayType[]>([]);

    // Синхронизация переданного prop `type` с локальным состоянием
    useEffect(() => {
        setDelayType(type);
    }, [type]);

    // Получение данных о типах простоя
    useEffect(() => {
        const fetchData = async () => {
            const result = await fetcher.getDelayTypes();
            if (result) {
                setDelayTypeOptions(result);
            }
        };
        fetchData();
    }, [fetcher]);

    // Вызов `onChange` при изменении `delayType`
    useEffect(() => {
        if (delayType) {
            onChange(delayType);
        }
    }, [delayType, onChange]);

    return (
        <div className="p-field" style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="delayType" className="p-d-block" style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                Тип простоя:
            </label>
            <Dropdown
                id="delayType"
                value={delayType}
                onChange={(e) => setDelayType(e.value)}
                options={delayTypeOptions}
                itemTemplate={(option) => <span>{option.name}</span>}
                placeholder="Выберите тип простоя"
                valueTemplate={(option) => <span>{option ? option.name : 'Выберите тип'}</span>}
                style={{ width: '40%' }}
            />
        </div>
    );
};

export default DelayTypeSelector;
