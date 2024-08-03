
import React, { useState } from "react"
import DayRangeSelector from "./dashBoardComponent/dateRangeSelector";
import { Col, Container, Row } from "react-bootstrap";

interface DashBoardProps {

}

const DashBoard: React.FC<DashBoardProps> = () => {
    const [selectedRange, setSelectedRange] = useState<{ startDate: Date | null, endDate: Date | null }>({
        startDate: null,
        endDate: null,
      });

    function handleDatesChange(startDate: Date | null, endDate: Date | null): void {
        setSelectedRange({ startDate, endDate });
    }

    return (
        <Container className="mt-5 ">
            <Row >
                
                    <DayRangeSelector onDatesChange={handleDatesChange}/>
                <Col className="col-9">
                </Col>
            </Row>
        </Container>
    )
}
export default DashBoard;