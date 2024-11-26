import React, { useMemo } from "react";
import MixDelay from "../../../../model/mix/delays/MixDelay";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import DateTimeSelector from "./dateTimeSelection";
import DelayType from "../../../../model/delays/DelayType";
import DelayTypeSelector from "./delayTypeSelector";
import AreaSelector from "./productionAreaSelector";
import MixProductionArea from "../../../../model/mix/delays/MixproductionArea";
import { Col, Row } from "react-bootstrap";
import UnitSelector from "./unitSelector";
import MixUnit from "../../../../model/mix/delays/MixUnit";

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
    const [productionArea, setProductionArea] = React.useState<MixProductionArea | null>(delay?.mixUnitPart.unit.productionArea || null);
    const [unit, setUnit] = React.useState<MixUnit | null>(delay?.mixUnitPart.unit || null);

    React.useEffect(() => {
        setUpdatedDelay(delay);
        setStartDate(delay?.delayStart || null);
        setEndDate(delay?.delayEnd || null);
        setDelayType(delay?.delayType || null);
        setUnit(delay?.mixUnitPart.unit || null);
    }, [delay]);

    const handleColse = () => {
        setUpdatedDelay(null);
        setStartDate(null);
        setEndDate(null);
        setDelayType(null);
        setProductionArea(null);
        setUnit(null);
        onHide();
    };

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

    const handleAreaChange = (area: MixProductionArea) => {
        setProductionArea(area);
    };

    const handleUnitChange = (unit: MixUnit) => {
        setUnit(unit);
    };

    const footerContent = (
        <div>
            <Button label="Ok" icon="pi pi-check" onClick={saveDelay} autoFocus size="small" />
        </div>
    );

    return (
        <Dialog
            visible={show}
            onHide={handleColse}
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

            <Row>
                {/* {/* Выпадающий список типа простоя*/}
                <Col>
                    <DelayTypeSelector type={delayType} onChange={handleDelayTypeChange} />
                </Col>
                <Col>
                    <AreaSelector area={productionArea} onChange={handleAreaChange} />
                </Col>
            </Row>
            <Row>
                <Col>
                    <UnitSelector mixUnit={unit} area={productionArea} onChange={handleUnitChange} />
                </Col>
            </Row>
        </Dialog>
    );
};

export default DelayModal;
