import React, { useState } from "react";
import { Col, Container } from "react-bootstrap";
import DayRangeSelector from "../dashBoardComponent/dateRangeSelector";
import ByDayReport from "./reportComponens/ByDayReport";

interface MixReportProps { }

const MixReport: React.FC<MixReportProps> = () => {
    

    return (
        <Container fluid className="mt-5 mb-5 bg-secondary">
            <ByDayReport />
        </Container>

    );
}
export default MixReport;