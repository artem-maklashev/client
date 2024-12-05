import React, { useEffect, useState } from "react";
import { Col, Container, Form, Modal, Row } from "react-bootstrap";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import { Stack } from "@mui/material";
import "react-datepicker/dist/react-datepicker.css";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDateTimePicker } from "@mui/x-date-pickers";
import utc from 'dayjs/plugin/utc';
import ApiService from "../../../service/ApiService";
dayjs.extend(utc);

interface DateTimeSelectorProps {
    date: Date | null;
    label: string;
    handleChange: (newValue: Date | null) => void;
};

const DateTimeSelector: React.FC<DateTimeSelectorProps> = ({ date, label, handleChange }) => {

    // const [title, setTitle] = useState<string>("");   
    const [newDate, setNewtDate] = useState<Date | null>(date);

    useEffect(() => {
        setNewtDate(date);
    }, [date]);

    useEffect(() => {
        handleChange(newDate);
    }, [handleChange, newDate]);

    const handleDateChange = (newValue: any) => {
        return ApiService.getFormatedLocalDateFromDayjs(newValue);
    };

    return (
        <Col className="col-lg-3 col-sm-4 bordered">
            <Form.Group>

                <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    adapterLocale={dayjs.locale("ru")}
                >
                    <Stack spacing={3}>
                        <MobileDateTimePicker
                            label={label}
                            value={newDate ? dayjs(newDate) : null}
                            onChange={(newValue) => setNewtDate(handleDateChange(newValue))}
                            ampm={false}
                            orientation="landscape"
                            
                        />
                    </Stack>
                </LocalizationProvider>
            </Form.Group>
        </Col>

    )

}
export default DateTimeSelector;