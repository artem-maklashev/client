import React, { useEffect, useState} from "react";
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


interface MonthRangeSelectorProps {}

const MonthRangeSelector: React.FC<MonthRangeSelectorProps> = ({}) => {

    const [dates, setDates] = useState<Date[] | null>(null);

    useEffect(() => {
        if (dates) {
            console.log(dates[0], '-', dates[1]);
        }
    });

    return (
        <Col className=' d-flex' align-items-center>
        <Card className="flex justify-content-center">
                <Card.Title className="text-center">Выберите период </Card.Title>
                <Card.Body d-flex align-items-center >
                    {/* <Col > */}
                    <Calendar 
                value={dates}
                onChange={(e) => {
                    const selectedDates = e.value as (Date | null)[] | null;
                    // Убираем null из массива, если есть
                    if (selectedDates) {
                        setDates(selectedDates.filter((d): d is Date => d !== null));
                    } else {
                        setDates(null);
                    }
                }}
                selectionMode="range"
                view="month"
                dateFormat="mm/yy"
                // yearNavigator
                // monthNavigator
                        
                            hideOnRangeSelection
                            inline
                        yearRange="2022:2030"
locale="ru"/>
                            {/* </Col> */}
            </Card.Body>
        </Card>
        </Col>
    );
}
export default MonthRangeSelector;