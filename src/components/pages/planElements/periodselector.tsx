import { Calendar } from "primereact/calendar";
import React, { useEffect, useState } from "react";
import { Col } from "react-bootstrap";


interface PeriodSelectorProps {
    onPeriodChange : (period: Date) => void;
 }

const PeriodSelector: React.FC<PeriodSelectorProps> = ({onPeriodChange}) => {
    const [selectedPeriod, setSelectedPeriod] = useState<Date | null>(null);
    useEffect(() => {
        if (selectedPeriod)
        onPeriodChange(selectedPeriod);
    }, [onPeriodChange, selectedPeriod]);    
    return (
        <Col className="mt-5">
            <Calendar value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.value || new Date())} view="month" dateFormat="MM yy" 
                />
        </Col>
    );
};

export default PeriodSelector;