import React, { FormEvent, SyntheticEvent, useEffect, useState } from "react";
import { Calendar } from 'primereact/calendar';
import { Card, Col } from "react-bootstrap";

import { locale, addLocale, updateLocaleOption, updateLocaleOptions, localeOption, localeOptions } from 'primereact/api';


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


interface MonthRangeSelectorProps {
    onDatesChange: (startDate: Date | null, endDate: Date | null) => void;
}

const MonthRangeSelector: React.FC<MonthRangeSelectorProps> = ({ onDatesChange }) => {

    const [dates, setDates] = useState<Date[] | null>(null);

    useEffect(() => {
        if (dates) {
            const [startDate, endDate] = dates;
            const endDateFact = new Date(new Date(endDate).getFullYear(), new Date(endDate).getMonth() + 1, 1);
            console.log(startDate, '-', endDateFact);


        }
    }, [dates]);

    return (
        <Col className=' d-flex col-12 justify-content-center border-0'>
            <Card className="d-flex justify-content-center" border="white">
                <Card.Header className='text-center'><h5>Выберите период</h5></Card.Header>
                <Card.Body d-flex flex-column align-items-center>
                    {/* <Col > */}

                    <Calendar
                        value={dates}
                        onChange={(e) => {
                            const selectedDates = e.value as (Date | null)[] | null;
                            if (selectedDates) {
                                // Обновляем состояние на основе новых выбранных дат
                                const filteredDates = selectedDates.filter((d): d is Date => d !== null);
                                setDates(filteredDates);

                                // Если есть две даты, передаем их родительскому компоненту
                                if (filteredDates.length === 2) {
                                    const startDate = filteredDates[0];
                                    const endDate = filteredDates[1];
                                    const endDateFact = new Date(new Date(endDate).getFullYear(), new Date(endDate).getMonth() + 1, 1);
                                    onDatesChange(startDate, endDateFact); // Notify parent component
                                }
                            } else {
                                setDates(null); // Очищаем даты, если ничего не выбрано
                            }
                        }}
                        selectionMode="range"
                        view="month"
                        dateFormat="MM/yy"
                        monthNavigator
                        inline
                        yearRange="2022:2030"
                        locale="ru"
                        style={{ width: '100%' }}
                    />

                    {/* </Col> */}
                </Card.Body>
            </Card>
        </Col>
    );
}
export default MonthRangeSelector;