import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import ProductCategoryMapEntry from "../../../model/production/ProductCategoryMapEntry";
import GypsumBoardCategory from "../../../model/gypsumBoard/GypsumBoardCategory";
import BoardProduction from "../../../model/production/BoardProduction";
import Delays from "../../../model/delays/Delays";
import { DateTimePicker, LocalizationProvider, MobileTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Stack } from "@mui/material";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import customParseFormat from 'dayjs/plugin/customParseFormat';

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

    const handleSave = () => {
        if (delay) {
            delay.startTime = startTime;
            delay.endTime = endTime;
            onSave(delay); // Вызываем функцию onSave с обновленной категорией
            onHide();
        }
    };

    useEffect(() => {
        if (show && delay) {
            setStartTime(delay.startTime);
            setEndTime(delay.endTime);
        }
    }, [show, delay]);

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Редактирование Простоя</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group>
                    <Form.Label>Дата и время начала простоя:</Form.Label>
                    <LocalizationProvider
                        dateAdapter={AdapterDayjs}
                        adapterLocale={dayjs.locale("ru")}
                    >
                        <Stack spacing={3}>
                            <MobileTimePicker
                                label="Время:"
                                value={dayjs(startTime)}
                                onChange={(newValue) =>
                                    newValue
                                        ? setStartTime(newValue?.toDate())
                                        : setStartTime(new Date())
                                }
                                // renderInput={(params) => <TextField {...params} />}
                                minutesStep={1}
                                ampm={false}
                            />
                            <DateTimePicker
                                label="Дата"
                                value={dayjs(startTime).isValid() ? dayjs(startTime).tz('UTC') : dayjs(new Date())}
                                onChange={(newValue) => {
                                    if (newValue) {
                                        const date = dayjs(newValue, format).utc().toDate();
                                        setStartTime(date ? date : new Date());
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
                    <Form.Control
                        type="date-local"
                        value={endTime.toString()}
                        onChange={(e) => setEndTime(new Date(startTime))}
                    />
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
