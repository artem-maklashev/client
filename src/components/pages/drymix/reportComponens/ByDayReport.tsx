import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import DayRangeSelector from "../../dashBoardComponent/dateRangeSelector";
import PlanFact from "./mixPlanFact";

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
            <Row className="mt-5">
                <Col className="col-lg-3 col-md-6 col-sm-6 mb-2">
                    <DayRangeSelector onDatesChange={handleRangeChange} />
                </Col>
                <Col lg={9} sm={12} className="mb-5">
                    <PlanFact mixProduction={[]} mixPlan={[]} />
                </Col>
            </Row>
        </Container>
    );
}
export default ByDayReport;