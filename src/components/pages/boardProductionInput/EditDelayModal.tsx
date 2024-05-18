import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { DateTimePicker, LocalizationProvider, MobileTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Stack } from "@mui/material";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import FetchDelaysData from "./FetchDelaysData";
import Division from "../../../model/delays/Division";
import ProductionArea from "../../../model/delays/ProductionArea";
import Delays from "../../../model/delays/Delays";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

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
    const format = 'YYYY-MM-DD HH:mm';
    const [division, setDivision] = useState<Division | null>(delay ? delay.unitPart.unit.productionArea.division : null);
    const fetcher = new FetchDelaysData();
    const [divisionList, setDivisionList] = useState<Division[]>([]);
    const [productionArea, setProductionArea] = useState<ProductionArea | null>(delay ? delay.unitPart.unit.productionArea : null);
    const [productionAreaList, setProductionAreaList] = useState<ProductionArea[]>([]);

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
        if (show && delay) {
            setStartTime(delay.startTime);
            setEndTime(delay.endTime);
            setDivision(delay.unitPart.unit.productionArea.division);
            fetcher.getDivisions().then((divisions) => {
                setDivisionList(divisions);
            });
            setProductionArea(delay.unitPart.unit.productionArea);
        }
    }, [show, delay]);

    useEffect(() => {
        if (division) {
            fetcher.getProductionArea(division.id).then((productionAreas) => {
                setProductionAreaList(productionAreas);
            });
        }
    }, [division]);

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Редактирование Простоя</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group>
                    <Form.Label>Дата и время начала простоя:</Form.Label>
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={dayjs.locale("ru")}>
                        <Stack spacing={3}>
                            <MobileTimePicker
                                label="Время:"
                                value={dayjs(startTime).tz('UTC')}
                                onChange={(newValue) => {
                                    if (newValue) {
                                        setStartTime(dayjs(newValue, format).utc().toDate());
                                    } else {
                                        setStartTime(new Date());
                                    }
                                }}
                                minutesStep={1}
                                ampm={false}
                            />
                            <DateTimePicker
                                label="Дата"
                                value={dayjs(startTime).isValid() ? dayjs(startTime).tz('UTC') : dayjs(new Date())}
                                onChange={(newValue) => {
                                    if (newValue) {
                                        const date = dayjs(newValue, format).utc().toDate();
                                        setStartTime(date || new Date());
                                    } else {
                                        setStartTime(new Date());
                                    }
                                }}
                                ampm={false}
                            />
                        </Stack>
                    </LocalizationProvider>
                </Form.Group>
                <Form.Group controlId="endTime">
                    <Form.Label>Время окончания:</Form.Label>
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={dayjs.locale("ru")}>
                        <Stack spacing={3}>
                            <MobileTimePicker
                                label="Время:"
                                value={dayjs(endTime).tz('UTC')}
                                onChange={(newValue) => {
                                    if (newValue) {
                                        setEndTime(dayjs(newValue, format).utc().toDate());
                                    } else {
                                        setEndTime(new Date());
                                    }
                                }}
                                minutesStep={1}
                                ampm={false}
                            />
                            <DateTimePicker
                                label="Дата"
                                value={dayjs(endTime).isValid() ? dayjs(endTime).tz('UTC') : dayjs(new Date())}
                                onChange={(newValue) => {
                                    if (newValue) {
                                        const date = dayjs(newValue, format).utc().toDate();
                                        setEndTime(date || new Date());
                                    } else {
                                        setEndTime(new Date());
                                    }
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
                    <Form.Select></Form.Select>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Деталь</Form.Label>
                    <Form.Select></Form.Select>
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
