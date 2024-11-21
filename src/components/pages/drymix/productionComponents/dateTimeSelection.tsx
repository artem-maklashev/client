import { Calendar } from "primereact/calendar";
import React from "react";
import { FC, useEffect, useState } from "react";

interface DateTimeSelectorProps {
    date: Date | null;
    label: string;
    onChange: (date: Date) => void;
}

const DateTimeSelector: FC<DateTimeSelectorProps> = ({ date, label, onChange }) => {
    const [dateTime, setDateTime] = useState(date);

    useEffect(() => {
        setDateTime(date);
    }, [date]);

    const handleChange = (date: Date) => {
        setDateTime(date);
        onChange(date);
    }



    return (
        <div className="p-field" style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="date" className="p-d-block" style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                {label}
            </label>
            <Calendar
                id="date"
                value={date}
                onChange={(e) => handleChange(e.value ? e.value : new Date())}
                showIcon
                locale="ru"
                // minDate={minDate || new Date()}
                // maxDate={maxDate || new Date()}
                style={{ width: '100%' }}
                showTime
                hourFormat="24"
                hideOnDateTimeSelect
            />
        </div>
    );
};

export default DateTimeSelector;
