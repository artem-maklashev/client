import { addLocale } from "primereact/api";
import { Calendar } from "primereact/calendar";
import React, { useEffect, useState } from "react";
import { Card, Col, Container } from "react-bootstrap";

addLocale('ru', {
    firstDayOfWeek: 1,
    dayNames: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
    dayNamesShort: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
    dayNamesMin: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
    monthNames: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
    monthNamesShort: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
    today: "Сегодня",
    clear: "Очистить",
    dateFormat: "dd.mm.yy",
    weekHeader: "Нед"
    //...
});


interface PeriodSelectorProps {
    period: Date;
    onPeriodChange: (period: Date) => void;
}

const PeriodSelector: React.FC<PeriodSelectorProps> = ({ period, onPeriodChange }) => {
    const [selectedPeriod, setSelectedPeriod] = useState<Date | null>(period);
    useEffect(() => {
        if (selectedPeriod)
            onPeriodChange(selectedPeriod);
    }, [onPeriodChange, selectedPeriod]);
    return (
        <Col className=' d-flex col-3 justify-content-center'>
            <Card className="d-flex justify-content-center">
                <Card.Header className='text-center'><h5>Выберите период</h5></Card.Header>

            <Calendar value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.value || new Date())} view="month" dateFormat="MM yy"
                locale="ru"
                inline
            />
            </Card>
       </Col>
    );
};

export default PeriodSelector;