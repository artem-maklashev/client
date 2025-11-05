import { Col, Container, Row } from "react-bootstrap";
import PeriodSelector from "../planElements/periodselector";
import { useState } from "react";
import { DrywallTable } from "./components/DrywallTable";

interface PlaningPageProps {
}
const PlaningPage: React.FC<PlaningPageProps> = () => {
    const now = new Date()
    const [period, setPeriod] = useState<Date>(new Date(now.getFullYear(), now.getMonth(), 1));

    function onPeriodChange(period: Date): void {
        setPeriod(period);
    }

    return (
        <Container fluid className="mt-5">
            <Row className="mt-5">
                <Col lg={6} sm={12} className="mt-4">
                    <PeriodSelector onPeriodChange={onPeriodChange} period={period} />
                    <DrywallTable />
                </Col>
                
            </Row>
        </Container>
    )
}
export default PlaningPage;