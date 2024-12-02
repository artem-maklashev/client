import { Calendar } from "primereact/calendar";
import React, { FC, useEffect, useState } from "react";

interface DateTimeSelectorProps {
    date: Date | null;
    label: string;
    onChange: (date: Date) => void;
}

const DateTimeSelector: FC<DateTimeSelectorProps> = ({ date, label, onChange }) => {
    const [dateTime, setDateTime] = useState<Date | undefined>(date || undefined);

    useEffect(() => {
        console.log('Получена дата в DateTimeSelector', date);
        setDateTime(date || undefined);
    }, [date]);

    const handleChange = (newDate: Date | null) => {
        if (newDate) {
            setDateTime(newDate);
            onChange(newDate);
        }
    };

    return (
        <div className="p-field" style={{ marginBottom: "1.5rem" }}>
            <label htmlFor="date" className="p-d-block" style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
                {label}
            </label>
            <Calendar
                id="dateTime"
                value={dateTime || undefined}
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
