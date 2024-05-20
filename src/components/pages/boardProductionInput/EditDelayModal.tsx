import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { DateTimePicker, LocalizationProvider, MobileTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Stack } from "@mui/material";
import dayjs from 'dayjs';
import FetchDelaysData from "./FetchDelaysData";
import Division from "../../../model/delays/Division";
import ProductionArea from "../../../model/delays/ProductionArea";
import Delays from "../../../model/delays/Delays";
import Unit from "../../../model/delays/Unit";
import UnitPart from "../../../model/delays/UnitPart";

interface EditDelayModalProps {
    show: boolean;
    delay: Delays | null;
    onHide: () => void;
    onSave: (updatedDelay: Delays) => void;
}

const EditCategoryModal: React.FC<EditDelayModalProps> = ({
    show,
    delay,
    onHide,
    onSave
}) => {
    const [startTime, setStartTime] = useState<Date>(delay ? delay.startTime : new Date());
    const [endTime, setEndTime] = useState<Date>(delay ? delay.endTime : new Date());
    const [division, setDivision] = useState<Division | null>(delay ? delay.unitPart.unit.productionArea.division : null);
    const [productionArea, setProductionArea] = useState<ProductionArea | null>(delay ? delay.unitPart.unit.productionArea : null);
    const [unit, setUnit] = useState<Unit | null>(delay?.unitPart.unit || null);
    const [unitPart, setUnitPart] = useState<UnitPart | null>(delay?.unitPart || null);

    const [divisionList, setDivisionList] = useState<Division[]>([]);
    const [productionAreaList, setProductionAreaList] = useState<ProductionArea[]>([]);
    const [unitList, setUnitList] = useState<Unit[]>([]);
    const [unitPartList, setUnitPartList] = useState<UnitPart[]>([]);

    const fetcher = new FetchDelaysData();

    const handleSave = () => {
        if (delay) {
            delay.startTime = startTime;
            delay.endTime = endTime;
            delay.unitPart.unit.productionArea = productionArea!;
            onSave(delay);
            onHide();
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            if (show && delay) {
                setStartTime(delay.startTime);
                setEndTime(delay.endTime);
                setDivision(delay.unitPart.unit.productionArea.division);

                const divisions = await fetcher.getDivisions();
                setDivisionList(divisions);

                setProductionArea(delay.unitPart.unit.productionArea);
                if (division) {
                    const productionAreas = await fetcher.getProductionArea(division.id);
                    setProductionAreaList(productionAreas);
                }

                setUnit(delay.unitPart.unit);
                const units = await fetcher.getUnit(productionArea?.id || 0);
                setUnitList(units);

                setUnitPart(delay.unitPart);
                const unitParts = await fetcher.getUnitPart(unit?.id || 0);
                setUnitPartList(unitParts);
            }
        };

        fetchData();
    }, [show, delay, division]);

    useEffect(() => {
        const fetchProductionAreas = async () => {
            if (division) {
                const productionAreas = await fetcher.getProductionArea(division.id);
                setProductionAreaList(productionAreas);
            }
        };

        fetchProductionAreas();
    }, [division]);

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Редактирование Простоя</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group>
                    <Form.Label>Дата и время начала простоя:</Form.Label>
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
                    <Form.Label>Время окончания:</Form.Label>
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
                    <Form.Label>Подразделение</Form.Label>
                    <Form.Select
                        value={division?.id || ''}
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
                    <Form.Label>Участок</Form.Label>
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
                    <Form.Label>Оборудование или причина</Form.Label>
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
                    <Form.Label>Деталь</Form.Label>
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
                <Button variant="primary" onClick={handleSave}>
                    Сохранить
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditCategoryModal;
