import React, { FC, useCallback, useEffect, useState } from "react";
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
import dayjs from "dayjs";
import ApiService from "../../../../service/ApiService";
import { set } from "date-fns";

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
    const [saveDisabled, setSaveDisabled] = useState<boolean>(true);

    // Инициализация состояния из `delay`
    useEffect(() => {
        if (delay) {
            console.log(delay);
            setStartDate(delay.delayStart || null);
            setEndDate(delay.delayEnd || null);
            setDelayType(delay.mixUnitPart.delayType || null);
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
                delayStart: ApiService.removeTimeZone(new Date(startDate)),
                delayEnd: ApiService.removeTimeZone(new Date(endDate)),
                mixUnitPart: unitPart,
            };
            onSave(updatedDelay);
            clearState();
            onHide();
        }
    };

    // Проверка для отключения кнопки
    useEffect(() => {
        if (startDate && endDate && delayType && unitPart) {
            setSaveDisabled(false);
        } else {
            setSaveDisabled(true);
        }
    }, [startDate, endDate, delayType, unitPart]);

    const footerContent = (
        <div>
            <Button label="Ok" icon="pi pi-check" onClick={saveDelay} autoFocus size="small" disabled={saveDisabled} />
        </div>
    );

    const handleProductionAreaChange = useCallback((productionArea: MixProductionArea | null) => {
        setProductionArea(productionArea);
        // setUnit(null);
    }, []);

    const handleUnitChange = useCallback((unit: MixUnit | null) => {
        setUnit(unit);
        // setUnitPart(null);
    }, []);

    return (
        <Dialog
            visible={show}
            onHide={() => { clearState(); handleClose(); }}
            header="Данные о простое"
            footer={footerContent}
            style={{ width: "650px", borderRadius: "8px" }}
            className="p-fluid"
        >
            {/* Выбор даты */}
            <div style={{ display: "flex", gap: "1rem" }}>
                <DateTimeSelector date={startDate ? new Date(startDate) : null} label="Начало простоя:" onChange={setStartDate} />
                <DateTimeSelector date={endDate ? new Date(endDate) : null} label="Окончание простоя:" onChange={setEndDate} />
            </div>

            {/* Выбор дополнительных данных */}
            <Row>
                <Col>
                    <DelayTypeSelector
                        type={delayType}
                        onChange={(dt) => {
                            setDelayType(dt);
                            console.log('После изменения типа простоя - деталь:', unitPart);
                        }}
                    />
                </Col>
                <Col>
                    <AreaSelector
                        area={productionArea}
                        onChange={handleProductionAreaChange}
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <UnitSelector
                        mixUnit={unit}
                        area={productionArea}
                        onChange={handleUnitChange}
                    />
                </Col>
                <Col>
                    <UnitPartSelector
                        mixUnit={unit}
                        mixUnitPart={unitPart}
                        onChange={setUnitPart}
                        delayType={delayType}
                    />
                </Col>
            </Row>

        </Dialog>
    );
};

export default DelayModal;
