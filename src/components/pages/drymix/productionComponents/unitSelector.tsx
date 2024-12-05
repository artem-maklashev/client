import React, { FC, useEffect, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import MixApiService from "../../../../service/MixApiService";
import MixUnit from "../../../../model/mix/delays/MixUnit";
import MixProductionArea from "../../../../model/mix/delays/MixproductionArea";

interface UnitSelectorProps {
    mixUnit: MixUnit | null;
    area: MixProductionArea | null;

    onChange: (type: MixUnit ) => void;
}

const UnitSelector: FC<UnitSelectorProps> = ({ mixUnit, onChange, area }) => {
    const [unit, setUnit] = useState<MixUnit | null>(mixUnit);
    const [unitOptions, setUnitOptions] = useState<MixUnit[]>([]);

    // Синхронизация переданного prop `unit` с локальным состоянием
    useEffect(() => {
        setUnit(mixUnit);
    }, [mixUnit]);

    // Получение данных о узлах
    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            if (area) {
                try {
                    const result = await MixApiService.getUnits(area.id);
                    if (isMounted) {
                        setUnitOptions(result || []);
                    }
                } catch (error) {
                    console.error("Ошибка загрузки узлов:", error);
                }
            } else {
                setUnitOptions([]);
            }
        };
        fetchData();
        return () => {
            isMounted = false;
        };
    }, [area]);


    // Вызов `onChange` при изменении 
    useEffect(() => {
        if (unit !== mixUnit && unit) {
            onChange(unit);
        } 
    }, [unit, mixUnit, onChange]);
    

    return (
        <div className="p-field" style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="productionArea" className="p-d-block" style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                Узел:
            </label>
            <Dropdown
                id="productionArea"
                value={unit || null}
                onChange={(e) => setUnit(e.value)}
                options={unitOptions || []}
                itemTemplate={(option) => <span>{option?.name || "Неизвестный узел"}</span>}
                placeholder="Выберите узел"
                valueTemplate={(option) => <span>{option ? option.name : 'Выберите узел'}</span>}
                style={{ width: '100%' }}
                disabled={!area}
            />

        </div>
    );
};

export default UnitSelector;
