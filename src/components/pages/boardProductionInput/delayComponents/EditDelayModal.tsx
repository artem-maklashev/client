import React, { useEffect, useState } from "react";
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

interface EditDelayModalProps {
    show: boolean;
    delay: Delays | null;
    shift: Shift | null;
    product: GypsumBoard | null;
    onHide: () => void;
    onSave: (updatedDelay: Delays) => void;
}

const EditCategoryModal: React.FC<EditDelayModalProps> = ({
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

    const fetcher = new FetchDelaysData();

    const fetchDivisions = async () => {
        const divisions = await fetcher.getDivisions();
        setDivisionList(divisions);
        if (divisions.length > 0 && !division) {
            setDivision(divisions[0]);
        }
    };

    const fetchProductionAreas = async (divisionId: number) => {
        const productionAreas = await fetcher.getProductionArea(divisionId);
        setProductionAreaList(productionAreas);
        if (productionAreas.length > 0 && !productionArea) {
            setProductionArea(productionAreas[0]);
        }
    };

    const fetchUnits = async (productionAreaId: number) => {
        const units = await fetcher.getUnit(productionAreaId);
        setUnitList(units);
        if (units.length > 0 && !unit) {
            setUnit(units[0]);
        }
    };

    const fetchUnitParts = async (unitId: number) => {
        const unitParts = await fetcher.getUnitPart(unitId);
        setUnitPartList(unitParts);
        if (unitParts.length > 0 && !unitPart) {
            setUnitPart(unitParts[0]);
        }
    };

    const fetchDelayTypes = async () => {
        const delayTypes = await fetcher.getDelayTypes();
        setDelayTypeList(delayTypes);
        if (delayTypes.length > 0 && !selectedDelayType) {
            setSelectedDelayType(delayTypes[0]);
        }
    };

    const handleSave = () => {
        if (delay) {
            delay.startTime = startTime;
            delay.endTime = endTime;
            delay.unitPart.unit.productionArea = productionArea!;
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

    useEffect(() => {
        if (show) {
            fetchDivisions();
            fetchDelayTypes();
        }
    }, [show]);

    useEffect(() => {
        if (division) {
            fetchProductionAreas(division.id);
        } else {
            setProductionAreaList([]);
        }
    }, [division]);

    useEffect(() => {
        if (productionArea) {
            fetchUnits(productionArea.id);
        } else {
            setUnitList([]);
        }
    }, [productionArea]);

    useEffect(() => {
        if (unit) {
            fetchUnitParts(unit.id);
        } else {
            setUnitPartList([]);
        }
    }, [unit]);

    useEffect(() => {
        if (show && delay) {
            setStartTime(delay.startTime);
            setEndTime(delay.endTime);
            setDivision(delay.unitPart.unit.productionArea.division);
            setProductionArea(delay.unitPart.unit.productionArea);
            setUnit(delay.unitPart.unit);
            setUnitPart(delay.unitPart);
            setSelectedDelayType(delay.delayType);
        } else if (show && !delay) {
            setStartTime(new Date());
            setEndTime(new Date());
            setDivision(null);
            setProductionArea(null);
            setUnit(null);
            setUnitPart(null);
            setSelectedDelayType(delayTypeList[0] || null);
        }
    }, [show, delay, delayTypeList]);

    useEffect(() => {
        if (productionAreaList.length > 0 && !productionArea) {
            setProductionArea(productionAreaList[0]);
        }
    }, [productionAreaList]);

    useEffect(() => {
        if (unitList.length > 0 && !unit) {
            setUnit(unitList[0]);
        }
    }, [unitList]);

    useEffect(() => {
        if (unitPartList.length > 0 && !unitPart) {
            setUnitPart(unitPartList[0]);
        }
    }, [unitPartList]);

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
                                onChange={(newValue) => {
                                    setStartTime(newValue ? dayjs(newValue).toDate() : new Date());
                                }}
                                minutesStep={1}
                                ampm={false}
                            />
                            <DateTimePicker
                                label="Дата"
                                value={dayjs(startTime).isValid() ? dayjs(startTime) : dayjs(new Date())}
                                onChange={(newValue) => {
                                    setStartTime(newValue ? dayjs(newValue).toDate() : new Date());
                                }}
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
                                onChange={(newValue) => {
                                    setEndTime(newValue ? dayjs(newValue).toDate() : new Date());
                                }}
                                minutesStep={1}
                                ampm={false}
                            />
                            <DateTimePicker
                                label="Дата"
                                value={dayjs(endTime).isValid() ? dayjs(endTime) : dayjs(new Date())}
                                onChange={(newValue) => {
                                    setEndTime(newValue ? dayjs(newValue).toDate() : new Date());
                                }}
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
                            const foundDelayType = delayTypeList.find((delayType) => delayType.id === selectedDelayTypeId);
                            setSelectedDelayType(foundDelayType || null);
                        }}
                    >
                        {delayTypeList.map((delayType) => (
                            <option key={delayType.id} value={delayType.id}>
                                {delayType.name}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>
                <Form.Group>
                    <Form.Label><strong>Подразделение</strong></Form.Label>
                    <Form.Select
                        value={division?.id || 0}
                        onChange={(e) => {
                            const selectedDivisionId = parseInt(e.target.value);
                            const foundDivision = divisionList.find((division) => division.id === selectedDivisionId);
                            setDivision(foundDivision || null);
                        }}
                    >
                        {divisionList.map((division) => (
                            <option key={division.id} value={division.id}>
                                {division.name}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>
                <Form.Group>
                    <Form.Label><strong>Участок</strong></Form.Label>
                    <Form.Select
                        value={productionArea?.id || ''}
                        onChange={(e) => {
                            const selectedProductionAreaId = parseInt(e.target.value);
                            const foundProductionArea = productionAreaList.find((area) => area.id === selectedProductionAreaId);
                            setProductionArea(foundProductionArea || null);
                        }}
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
                        onChange={(e) => {
                            const selectedUnitId = parseInt(e.target.value);
                            const foundUnit = unitList.find((unit) => unit.id === selectedUnitId);
                            setUnit(foundUnit || null);
                        }}
                    >
                        {unitList.map((unit) => (
                            <option key={unit.id} value={unit.id}>
                                {unit.name}
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
                            const foundUnitPart = unitPartList.find((unitPart) => unitPart.id === selectedUnitPartId);
                            setUnitPart(foundUnitPart || null);
                        }}
                    >
                        {unitPartList.map((unitPart) => (
                            <option key={unitPart.id} value={unitPart.id}>
                                {unitPart.name}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Отмена
                </Button>
                <Button variant="primary" onClick={handleSave} disabled={getUserRole()=== 'USER' || 'ADMIN' ? false : true }>
                    Сохранить
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditCategoryModal;
