import React, { FC, useEffect, useMemo, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import FetchDelaysData from "../../boardProductionInput/delayComponents/FetchDelaysData";
import MixProductionArea from "../../../../model/mix/delays/MixproductionArea";
import MixApiService from "../../../../service/MixApiService";

interface AreaSelectorProps {
    area: MixProductionArea | null;
    onChange: (type: MixProductionArea) => void;
}

const AreaSelector: FC<AreaSelectorProps> = ({ area, onChange }) => {
    const [productionArea, setProductionArea] = useState<MixProductionArea | null>(area);
    const [areaListOptions, setAreaOptions] = useState<MixProductionArea[]>([]);

    // Синхронизация переданного prop `type` с локальным состоянием
    useEffect(() => {
        setProductionArea(area);
    }, [area]);

    // Получение данных о площадках
    useEffect(() => {
        const fetchData = async () => {
            const result = await MixApiService.getMixProductionArea();
            if (result) {
                setAreaOptions(result);
            }
        };
        // if (!area)
            fetchData();
    }, []);

    // Вызов `onChange` при изменении `delayType`
    useEffect(() => {
        if (productionArea) {
            onChange(productionArea);
        }
    }, [productionArea, onChange]);

    return (
        <div className="p-field" style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="productionArea" className="p-d-block" style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                Производственная площадка:
            </label>
            <Dropdown
                id="productionArea"
                value={productionArea}
                onChange={(e) => setProductionArea(e.value)}
                options={areaListOptions}
                itemTemplate={(option) => <span>{option.name}</span>}
                placeholder="Выберите производственную площадку"
                valueTemplate={(option) => <span>{option ? option.name : 'Выберите площадку'}</span>}
                style={{ width: '100%' }}
            />
        </div>
    );
};

export default AreaSelector;
