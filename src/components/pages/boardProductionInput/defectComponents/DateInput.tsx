import React, { useState, ChangeEvent } from "react";
import { Form } from "react-bootstrap";

interface DateInputProps {
    onDatesChange: (startDate: string, endDate: string) => void;
}

const DateInput: React.FC<DateInputProps> = ({ onDatesChange }) => {
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");

    const handleStartDateChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setStartDate(value);
        onDatesChange(value, endDate);
    };

    const handleEndDateChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setEndDate(value);
        onDatesChange(startDate, value);
    };

    return (
        <Form>
            <Form.Group className="mb-3">
                <Form.Label>Начало производства</Form.Label>
                <Form.Control
                    type="datetime-local"
                    value={startDate}
                    onChange={handleStartDateChange}
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Конец производства</Form.Label>
                <Form.Control
                    type="datetime-local"
                    value={endDate}
                    onChange={handleEndDateChange}
                />
            </Form.Group>
        </Form>
    );
};

export default DateInput;
