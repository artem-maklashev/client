import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import addDays from 'date-fns/addDays';
import "react-datepicker/dist/react-datepicker.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { ru } from 'date-fns/locale';
import { Col, Form, Card } from 'react-bootstrap';

interface DayRangeSelectorProps {
    onDatesChange: (startDate: Date | null, endDate: Date | null) => void;
}

const DayRangeSelector: React.FC<DayRangeSelectorProps> = ({ onDatesChange }) => {
    const now = new Date();
    const [startDate, setStartDate] = useState<Date | null>(new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1)));
    const [endDate, setEndDate] = useState<Date | null>(now);

    const handleChange = (dates: [Date | null, Date | null]) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
        onDatesChange(start, end);
    };

    useEffect(() => {
        console.info("\nStart date: " + startDate + "\nEnd date :" + endDate);
    }, [startDate, endDate]);


    return (
        <Col className="col-12 d-flex justify-content-center">
    <Card className="border-0" style={{ maxWidth: '500px' }}>
        <Card.Header className="bg-primary text-white text-center py-2">
            <h6 className="m-0 text-uppercase">Выберите период</h6>
        </Card.Header>
        <Card.Body className="d-flex flex-column align-items-center">
            <Form className="w-100">
                <Form.Group className="text-center">
                    <DatePicker
                        locale={ru}
                        selected={startDate}
                        onChange={handleChange}
                        startDate={startDate}
                        endDate={endDate}
                        selectsRange
                        dateFormat="d.MM.yyyy"
                        minDate={addDays(new Date(), -60)}
                        maxDate={addDays(new Date(), 30)}
                        monthsShown={2} // Показывать два месяца одновременно
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        className="form-control text-center"
                        popperPlacement="bottom"
                        
                    />
                </Form.Group>
            </Form>
        </Card.Body>
    </Card>
</Col>

    );
};

export default DayRangeSelector;
