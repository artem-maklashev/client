import { addLocale } from "primereact/api";
import { Calendar } from "primereact/calendar";
import React, { useEffect, useState } from "react";
import { Card, Col } from "react-bootstrap";
import "./calendar.css"

// Локализация для русского языка
addLocale("ru", {
  firstDayOfWeek: 1,
  dayNames: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
  dayNamesShort: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
  dayNamesMin: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
  monthNames: [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ],
  monthNamesShort: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
  today: "Сегодня",
  clear: "Очистить",
  dateFormat: "dd.mm.yy",
  weekHeader: "Нед",
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
  }, [selectedPeriod, onPeriodChange]);

  return (
    <Col xs={12} className="mb-3">
      <Card className="shadow-sm border-0 rounded-4 overflow-hidden bg-white transition-shadow hover:shadow-md">
        <Card.Body className="p-3 d-flex justify-content-center align-items-center">
          <Calendar
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.value || new Date())}
            view="month"
            dateFormat="mm yy"
            locale="ru"
            inline
            panelClassName="custom-calendar-panel rounded-4 shadow-lg border-0"
            style={{ width: "100%", maxWidth: "260px", margin: "0 auto" }}
            className="w-100 border-0"
          />
        </Card.Body>
      </Card>
    </Col>
  );
};

export default PeriodSelector;