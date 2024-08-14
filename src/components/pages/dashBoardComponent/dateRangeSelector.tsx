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
    const [startDate, setStartDate] = useState<Date | null>(new Date(now.getFullYear(), now.getMonth(), 1));
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
        <Col className="col-12" >
            <Card className="mt-5 ">
                <Card.Header className='text-center'>Выберите период</Card.Header>
                <Card.Body d-flex flex-column align-items-center>
                    <Form className="justify-content-center">
                        <Form.Group className="text-center">
                            <Col >
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
                                    monthsShown={2} // Показывать три месяца одновременно
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                />
                            </Col>
                        </Form.Group>
                    </Form>

                </Card.Body>
            </Card>
        </Col >
    );
};

export default DayRangeSelector;
