import React, { FC, useEffect, useState } from "react";
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
import UnitPartSelector from "./unitPartSelector";
import MixUnitPart from "../../../../model/mix/delays/MixUnitPart";
import MixDelay from "../../../../model/mix/delays/MixDelay";

interface DelayModalProps {
    show: boolean;
    delay: MixDelay | null;
    onHide: () => void;
    onSave: (updatedDelay: MixDelay) => void;
}

const DelayModal: FC<DelayModalProps> = ({ show, delay, onHide, onSave }) => {
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [delayType, setDelayType] = useState<DelayType | null>(null);
    const [productionArea, setProductionArea] = useState<MixProductionArea | null>(null);
    const [unit, setUnit] = useState<MixUnit | null>(null);
    const [unitPart, setUnitPart] = useState<MixUnitPart | null>(null);

    // Инициализация состояния из `delay`
    useEffect(() => {
        if (delay) {
            setStartDate(delay.delayStart || null);
            setEndDate(delay.delayEnd || null);
            setDelayType(delay.delayType || null);
            setProductionArea(delay.mixUnitPart.unit.productionArea || null);
            setUnit(delay.mixUnitPart.unit || null);
            setUnitPart(delay.mixUnitPart || null);
        } else {
            clearState();
        }
    }, [delay]);

    // Очистка состояния
    const clearState = () => {
        setStartDate(null);
        setEndDate(null);
        setDelayType(null);
        setProductionArea(null);
        setUnit(null);
        setUnitPart(null);
    };

    // Закрытие модального окна
    const handleClose = () => {
        clearState();
        onHide();
    };

    // Сохранение данных
    const saveDelay = () => {
        if (startDate && endDate && delayType && unitPart) {
            const updatedDelay: MixDelay = {
                ...delay!,
                id: delay?.id || 0,
                delayStart: startDate,
                delayEnd: endDate,
                delayType,
                mixUnitPart: unitPart,
            };
            onSave(updatedDelay);
            clearState();
            onHide();
        }
    };

    // Проверка для отключения кнопки
    const isSaveDisabled = !startDate || !endDate || !unitPart || !delayType;

    const footerContent = (
        <div>
            <Button label="Ok" icon="pi pi-check" onClick={saveDelay} autoFocus size="small" disabled={isSaveDisabled} />
        </div>
    );

    return (
        <Dialog
            visible={show}
            onHide={handleClose}
            header="Данные о простое"
            footer={footerContent}
            style={{ width: "650px", borderRadius: "8px" }}
            className="p-fluid"
        >
            {/* Выбор даты */}
            <div style={{ display: "flex", gap: "1rem" }}>
                <DateTimeSelector date={startDate} label="Начало простоя:" onChange={setStartDate} />
                <DateTimeSelector date={endDate} label="Окончание простоя:" onChange={setEndDate} />
            </div>

            {/* Выбор дополнительных данных */}
            <Row>
                <Col>
                    <DelayTypeSelector type={delayType} onChange={setDelayType} />
                </Col>
                <Col>
                    <AreaSelector area={productionArea} onChange={setProductionArea} />
                </Col>
            </Row>
            <Row>
                <Col>
                    <UnitSelector mixUnit={unit} area={productionArea}  onChange={setUnit} />
                </Col>
                <Col>
                    <UnitPartSelector mixUnit={unit} mixUnitPart={unitPart} onChange={setUnitPart} delayType={delayType} />
                </Col>
            </Row>
        </Dialog>
    );
};

export default DelayModal;
