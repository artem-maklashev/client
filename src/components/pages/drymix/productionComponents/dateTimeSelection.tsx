import { Calendar } from "primereact/calendar";
import React, { FC, useEffect, useState } from "react";
import ApiService from "../../../../service/ApiService";
import dayjs from "dayjs";

interface DateTimeSelectorProps {
    date: Date | null;
    label: string;
    onChange: (date: Date) => void;
}

const DateTimeSelector: FC<DateTimeSelectorProps> = ({ date, label, onChange }) => {
    const [dateTime, setDateTime] = useState<Date | undefined>(
        date ? new Date(date) : undefined
    );

    useEffect(() => {
        if (date) {
            console.log("Получена дата в DateTimeSelector", date);
            // Преобразуем дату в локальное время
            setDateTime(new Date(date));
        }
    }, [date]);

    const handleChange = (newDate: Date | null) => {
        if (newDate) {
            // Преобразуем дату обратно в стандартный объект Date
            setDateTime(newDate);
            onChange(new Date(newDate));
        }
    };

    return (
        <div className="p-field" style={{ marginBottom: "1.5rem" }}>
            <label
                htmlFor="date"
                className="p-d-block"
                style={{ fontWeight: "bold", marginBottom: "0.5rem" }}
            >
                {label}
            </label>
            <Calendar
                id="dateTime"
                value={dateTime}
                onChange={(e) => handleChange(e.value || null)}
                showIcon
                locale="ru"
                style={{ width: "100%" }}
                showTime
                hourFormat="24"
                hideOnDateTimeSelect
            />
        </div>
    );
};

export default DateTimeSelector;
