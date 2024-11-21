import React, { useMemo } from "react";
import MixDelay from "../../../../model/mix/delays/MixDelay";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

import DateTimeSelector from "./dateTimeSelection";
import { Dropdown } from "primereact/dropdown";
import DelayType from "../../../../model/delays/DelayType";
import FetchDelaysData from "../../boardProductionInput/delayComponents/FetchDelaysData";
import DelayTypeSelector from "./delayTypeSelector";

interface DelayModalProps {
    show: boolean;
    delay: MixDelay | null;
    // shift: Shift | null;
    // product: DryMix | null;
    onHide: () => void;
    onSave: (updatedDelay: MixDelay) => void;
}

const DelayModal: React.FC<DelayModalProps> = ({ show, delay, onHide, onSave }) => {

    const [updatedDelay, setUpdatedDelay] = React.useState<MixDelay | null>(delay);
    const [startDate, setStartDate] = React.useState<Date | null>(delay?.delayStart || new Date());
    const [endDate, setEndDate] = React.useState<Date | null>(delay?.delayEnd || new Date());
    const [delayType, setDelayType] = React.useState<DelayType | null>(delay?.delayType || null);

    React.useEffect(() => {
        setUpdatedDelay(delay);
        setStartDate(delay?.delayStart || null);
        setEndDate(delay?.delayEnd || null);
    }, [delay]);
    
    const saveDelay = () => {

        if (updatedDelay) {
            onSave(updatedDelay);
        }
        onHide();
    };

    const handleEndDateChange = (date: Date) => {
        setEndDate(date);
        if (updatedDelay) {
            setUpdatedDelay({
                ...updatedDelay,
                delayEnd: date,
            });
        }
    };

    const handleStartDateChange = (date: Date) => {
        setStartDate(date);
        if (updatedDelay) {
            setUpdatedDelay({
                ...updatedDelay,
                delayStart: date,
            });
        }
    };

    const handleDelayTypeChange = (type: DelayType) => {
        setDelayType(type);
        if (updatedDelay) {
            setUpdatedDelay({
                ...updatedDelay,
                delayType: type,
            });
        }
    };

    const footerContent = (
        <div>
            <Button label="Ok" icon="pi pi-check" onClick={saveDelay} autoFocus />
        </div>
    );

    return (
        <Dialog
            visible={show}
            onHide={onHide}
            header="Данные о простое"
            footer={footerContent}
            style={{ width: '650px', borderRadius: '8px' }} // округлённые края и заданы размеры
            className="p-fluid" // для растягивания компонентов на 100% внутри контейнера
        >
            {/* Выбор даты с календарем */}
            <div style={{ display: 'flex', gap: '1rem' }}>
                <DateTimeSelector date={startDate} label={"Начало простоя:"} onChange={handleStartDateChange} />
                <DateTimeSelector date={endDate} label={"Окончание простоя:"} onChange={handleEndDateChange} />
            </div>

            {/* {/* Выпадающий список типа простоя*/}
            <DelayTypeSelector type={delayType} onChange={handleDelayTypeChange} />
        </Dialog>
    );
};

export default DelayModal;
