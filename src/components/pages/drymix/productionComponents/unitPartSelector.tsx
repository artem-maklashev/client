import React, { FC, useEffect,  useState } from "react";
import { Dropdown } from "primereact/dropdown";
import MixApiService from "../../../../service/MixApiService";
import MixUnit from "../../../../model/mix/delays/MixUnit";
import MixProductionArea from "../../../../model/mix/delays/MixproductionArea";
import MixUnitPart from "../../../../model/mix/delays/MixUnitPart";
import DelayType from "../../../../model/delays/DelayType";

interface UnitPartSelectorProps {
    delayType: DelayType | null;
    mixUnit: MixUnit | null;
    mixUnitPart: MixUnitPart | null;    
    onChange: (type: MixUnitPart) => void;
}

const UnitPartSelector: FC<UnitPartSelectorProps> = ({ mixUnit, onChange, mixUnitPart, delayType }) => {
    const [unitPart, setUnitPart] = useState<MixUnitPart | null>(mixUnitPart);
    const [unitPartOptions, setUnitPartOptions] = useState<MixUnitPart[]>([]);

    // Синхронизация переданного prop `unit` с локальным состоянием
    useEffect(() => {
        setUnitPart(mixUnitPart);
    }, [mixUnitPart]);

    // Получение данных о узлах
    useEffect(() => {
        const fetchData = async () => {
            if (mixUnit && delayType) {
                try {
                    const result = await MixApiService.getUnitParts(mixUnit.id, delayType.id); 
                    setUnitPartOptions(result || []);
                } catch (error) {
                    console.error("Ошибка загрузки узлов:", error);
                }
            } else {
                setUnitPartOptions([]); // Если область не указана, сбрасываем узлы
            }
        };

        fetchData();
    }, [mixUnit, delayType]);

    // Вызов `onChange` при изменении `delayType`
    useEffect(() => {
        if (unitPart) {
            onChange(unitPart);
        }
    }, [unitPart, onChange]);

    return (
        <div className="p-field" style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="productionArea" className="p-d-block" style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                Деталь:
            </label>
            <Dropdown
                id="productionArea"
                value={unitPart}
                onChange={(e) => setUnitPart(e.value)}
                options={unitPartOptions}
                itemTemplate={(option) => <span>{option?.name || "Неизвестный узел"}</span>} // Шаблон элемента
                placeholder="Выберите узел"
                valueTemplate={(option) => <span>{option ? option.name : 'Выберите узел'}</span>}
                style={{ width: '100%' }}
                disabled={delayType === null || mixUnit === null}
            />
        </div>
    );
};

export default UnitPartSelector;
