import React, { useState } from "react";
import { Col, Container } from "react-bootstrap";
import DayRangeSelector from "../../dashBoardComponent/dateRangeSelector";

interface ByDayReportProps { }

const ByDayReport: React.FC<ByDayReportProps> = () => {

    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const handleRangeChange = (startDate: Date | null, endDate: Date | null) => {
        setStartDate(startDate);
        setEndDate(endDate);
    }
    return (
        <Container fluid className="mt-5 mb-5 bg-secondary">
            <Col className="col-lg-3 col-md-6 col-sm-6 mb-2">
                <DayRangeSelector onDatesChange={handleRangeChange} />
            </Col>
            <Col lg={9} sm={12} className="mb-5">
                
            </Col>

        </Container>
    );
}
export default ByDayReport;