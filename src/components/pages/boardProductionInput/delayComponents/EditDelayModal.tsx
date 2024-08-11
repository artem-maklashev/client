import React, { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { DateTimePicker, LocalizationProvider, MobileTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Stack } from "@mui/material";
import dayjs from 'dayjs';
import FetchDelaysData from "./FetchDelaysData";
import Division from "../../../../model/delays/Division";
import ProductionArea from "../../../../model/delays/ProductionArea";
import Delays from "../../../../model/delays/Delays";
import Unit from "../../../../model/delays/Unit";
import UnitPart from "../../../../model/delays/UnitPart";
import Shift from "../../../../model/Shift";
import DelayType from "../../../../model/delays/DelayType";
import GypsumBoard from "../../../../model/gypsumBoard/GypsumBoard";
import { getUserRole } from "../../../../service/Api";
import ApiService from "../../../../service/ApiService";

interface EditDelayModalProps {
    show: boolean;
    delay: Delays | null;
    shift: Shift | null;
    product: GypsumBoard | null;
    onHide: () => void;
    onSave: (updatedDelay: Delays) => void;
}

const EditDelayModal: React.FC<EditDelayModalProps> = ({
    show,
    delay,
    shift,
    product,
    onHide,
    onSave
}) => {
    const [startTime, setStartTime] = useState<Date>(new Date());
    const [endTime, setEndTime] = useState<Date>(new Date());
    const [division, setDivision] = useState<Division | null>(null);
    const [productionArea, setProductionArea] = useState<ProductionArea | null>(null);
    const [unit, setUnit] = useState<Unit | null>(null);
    const [unitPart, setUnitPart] = useState<UnitPart | null>(null);
    const [selectedDelayType, setSelectedDelayType] = useState<DelayType | null>(null);

    const [divisionList, setDivisionList] = useState<Division[]>([]);
    const [productionAreaList, setProductionAreaList] = useState<ProductionArea[]>([]);
    const [unitList, setUnitList] = useState<Unit[]>([]);
    const [unitPartList, setUnitPartList] = useState<UnitPart[]>([]);
    const [delayTypeList, setDelayTypeList] = useState<DelayType[]>([]);

    const fetcher = useMemo(() => new FetchDelaysData(), []);

    const fetchData = useCallback(async () => {
        try {
            const [divisions, delayTypes] = await Promise.all([
                fetcher.getDivisions(),
                fetcher.getDelayTypes()
            ]);
            setDivisionList(divisions);
            setDelayTypeList(delayTypes);
        } catch (error) {
            console.error("Ошибка загрузки данных", error);
        }
    }, [fetcher]);

    const fetchProductionAreas = useCallback(async (divisionId: number) => {
        try {
            const productionAreas = await fetcher.getProductionArea(divisionId);
            setProductionAreaList(productionAreas);
        } catch (error) {
            console.error("Ошибка загрузки участков", error);
        }
    }, [fetcher]);

    const fetchUnits = useCallback(async (productionAreaId: number) => {
        try {
            const units = await fetcher.getUnit(productionAreaId);
            setUnitList(units);
        } catch (error) {
            console.error("Ошибка загрузки оборудования", error);
        }
    }, [fetcher]);

    const fetchUnitParts = useCallback(async (unitId: number) => {
        try {
            const unitParts = await fetcher.getUnitPart(unitId);
            setUnitPartList(unitParts);
        } catch (error) {
            console.error("Ошибка загрузки деталей", error);
        }
    }, [fetcher]);

    useEffect(() => {
        if (show) {
            fetchData();
        }
    }, [fetchData, show]);

    useEffect(() => {
        if (delay) {
            const { productionArea } = delay.unitPart.unit;
            setStartTime(delay.startTime);
            setEndTime(delay.endTime);
            setDivision(productionArea.division);
            setProductionArea(productionArea);
            setUnit(delay.unitPart.unit);
            setUnitPart(delay.unitPart);
            setSelectedDelayType(delay.delayType);

            fetchProductionAreas(productionArea.division.id);
            fetchUnits(productionArea.id);
            fetchUnitParts(delay.unitPart.unit.id);
        }
    }, [delay, fetchProductionAreas, fetchUnits, fetchUnitParts]);

    const handleSave = () => {
        if (delay) {
            delay.startTime = startTime;
            delay.endTime = endTime;
            delay.unitPart = unitPart!;
            delay.delayType = selectedDelayType!;
            onSave(delay);
        } else {
            if (unitPart && shift && product) {
                const newDelay = new Delays(
                    -1,
                    new Date(),
                    startTime,
                    endTime,
                    unitPart,
                    shift,
                    product,
                    selectedDelayType!
                );
                onSave(newDelay);
            }
        }
        onHide();
    };

    function handleDateChange(newValue: dayjs.Dayjs | null): Date {
        return ApiService.getFormatedLocalDateFromDayjs(newValue);
    }

    useEffect(() => {
        if (productionArea) {
            fetchUnits(productionArea.id);
        }
    }, [productionArea, fetchUnits]);

    useEffect(() => {
        if (unit) {
            fetchUnitParts(unit.id);            
        }
    }, [unit, fetchUnitParts]);
    
    useEffect(() => {
    //     if (unitPartList.length > 0 && unit) {
    //         setUnitPart(unitPartList[0]); // Обновляем unitPart при изменении списка
    //     }
    // }, [unitPartList, unit]);
        if (!unitPart) {
            setUnitPart(unitPartList[0])
        }
    },[unitPart, unitPartList]);

    const handleProductionAreaChange = async (event: ChangeEvent<HTMLSelectElement>) => {

        const selectedProductionAreaId = parseInt(event.target.value);
        const foundProductionArea = productionAreaList.find((area) => area.id === selectedProductionAreaId);
        setProductionArea(foundProductionArea || null);
        if (foundProductionArea) {
            await fetchUnits(foundProductionArea.id);
            if (unitList.length > 0) {
                setUnit(unitList[0]); // Устанавливаем первый unit
            }
        }
    }


return (
    <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
            <Modal.Title>Редактирование Простоя</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group>
                <Form.Label><strong>Дата и время начала простоя:</strong></Form.Label>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
                    <Stack spacing={3}>
                        <MobileTimePicker
                            label="Время:"
                            value={dayjs(startTime)}
                            onChange={(newValue) => setStartTime(handleDateChange(newValue))}
                            minutesStep={1}
                            ampm={false}
                        />
                        <DateTimePicker
                            label="Дата"
                            value={dayjs(startTime).isValid() ? dayjs(startTime) : dayjs(new Date())}
                            onChange={(newValue) => setStartTime(handleDateChange(newValue))}
                            ampm={false}
                        />
                    </Stack>
                </LocalizationProvider>
            </Form.Group>
            <Form.Group controlId="endTime">
                <Form.Label><strong>Время окончания:</strong></Form.Label>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
                    <Stack spacing={3}>
                        <MobileTimePicker
                            label="Время:"
                            value={dayjs(endTime)}
                            onChange={(newValue) => setEndTime(handleDateChange(newValue))}
                            minutesStep={1}
                            ampm={false}
                        />
                        <DateTimePicker
                            label="Дата"
                            value={dayjs(endTime).isValid() ? dayjs(endTime) : dayjs(new Date())}
                            onChange={(newValue) => setEndTime(handleDateChange(newValue))}
                            ampm={false}
                        />
                    </Stack>
                </LocalizationProvider>
            </Form.Group>
            <Form.Group>
                <Form.Label><strong>Тип простоя</strong></Form.Label>
                <Form.Select
                    value={selectedDelayType?.id || 0}
                    onChange={(e) => {
                        const selectedDelayTypeId = parseInt(e.target.value);
                        const foundDelayType = delayTypeList.find((type) => type.id === selectedDelayTypeId);
                        setSelectedDelayType(foundDelayType || null);
                    }}
                >
                    {delayTypeList.map((type) => (
                        <option key={type.id} value={type.id}>
                            {type.name}
                        </option>
                    ))}
                </Form.Select>
            </Form.Group>
            <Form.Group>
                <Form.Label><strong>Подразделение</strong></Form.Label>
                <Form.Select
                    value={division?.id || 0}
                    onChange={async (e) => {
                        const selectedDivisionId = parseInt(e.target.value);
                        const foundDivision = divisionList.find((div) => div.id === selectedDivisionId);
                        setDivision(foundDivision || null);
                        if (foundDivision) {
                            await fetchProductionAreas(foundDivision.id);
                            setProductionArea(null);
                            setUnit(null);
                            setUnitPart(null);
                        }
                    }}
                >
                    {divisionList.map((div) => (
                        <option key={div.id} value={div.id}>
                            {div.name}
                        </option>
                    ))}
                </Form.Select>
            </Form.Group>
            <Form.Group>
                <Form.Label><strong>Участок</strong></Form.Label>
                <Form.Select
                    value={productionArea?.id || ''}
                    onChange={handleProductionAreaChange}

                >
                    {productionAreaList.map((area) => (
                        <option key={area.id} value={area.id}>
                            {area.name}
                        </option>
                    ))}
                </Form.Select>
            </Form.Group>
            <Form.Group>
                <Form.Label><strong>Оборудование или причина</strong></Form.Label>
                <Form.Select
                    value={unit?.id || ''}
                    onChange={async (e) => {
                        const selectedUnitId = parseInt(e.target.value);
                        const foundUnit = unitList.find((u) => u.id === selectedUnitId);
                        setUnit(foundUnit || null);
                        if (foundUnit) {
                            await fetchUnitParts(foundUnit.id);
                            setUnitPart(null);
                        }
                    }}
                >
                    {unitList.map((u) => (
                        <option key={u.id} value={u.id}>
                            {u.name}
                        </option>
                    ))}
                </Form.Select>
            </Form.Group>
            <Form.Group>
                <Form.Label><strong>Деталь</strong></Form.Label>
                <Form.Select
                    value={unitPart?.id || ''}
                    onChange={(e) => {
                        const selectedUnitPartId = parseInt(e.target.value);
                        const foundUnitPart = unitPartList.find((part) => part.id === selectedUnitPartId);
                        setUnitPart(foundUnitPart || null);
                    }}
                >
                    {unitPartList.map((part) => (
                        <option key={part.id} value={part.id}>
                            {part.name}
                        </option>
                    ))}
                </Form.Select>
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={onHide}>Отмена</Button>
            <Button
                variant="primary"
                onClick={handleSave}
                disabled={getUserRole() === 'USER' || getUserRole() === 'ADMIN' ? false : true}
            >
                Сохранить
            </Button>
        </Modal.Footer>
    </Modal>
);
};

export default EditDelayModal;
