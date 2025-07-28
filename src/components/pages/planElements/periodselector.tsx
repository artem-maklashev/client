import { addLocale } from "primereact/api";
import { Calendar } from "primereact/calendar";
import React, { useEffect, useState } from "react";
import { Card, Col } from "react-bootstrap";
import '../../../App.css'

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
});

interface PeriodSelectorProps {
    period: Date;
    onPeriodChange: (period: Date) => void;
}

const PeriodSelector: React.FC<PeriodSelectorProps> = ({ period, onPeriodChange }) => {
    const [selectedPeriod, setSelectedPeriod] = useState<Date | null>(period);

    useEffect(() => {
        if (selectedPeriod) {
            onPeriodChange(selectedPeriod);
        }
    }, [onPeriodChange, selectedPeriod]);

    return (
        <Col xs={12} className="mb-2">
            <Card className="shadow-sm border-0 rounded-3">
                {/* <Card.Header className="bg-white border-0 py-1 text-center">
                    <h5 className="mb-0 text-dark fw-normal">Выберите период</h5>
                </Card.Header> */}
                <Card.Body className="p-3 d-flex justify-content-center">
                    <Calendar 
                        value={selectedPeriod} 
                        onChange={(e) => setSelectedPeriod(e.value || new Date())} 
                        view="month" 
                        dateFormat="MM yy"
                        locale="ru"
                        inline
                        style={{ 
                            width: '100%',
                            maxWidth: '240px',
                            margin: '0 auto',
                            fontSize: '10px'
                        }}
                        className="custom-calendar border-0"
                    />
                </Card.Body>
            </Card>
        </Col>
    );
};

export default PeriodSelector;