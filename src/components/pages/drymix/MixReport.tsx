import React, {  } from "react";
import {  Container } from "react-bootstrap";
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