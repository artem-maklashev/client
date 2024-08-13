
import React, { useEffect, useState } from "react"
import DayRangeSelector from "./dashBoardComponent/dateRangeSelector";
import { Col, Container, Row } from "react-bootstrap";
import ApiService from "../../service/ApiService";
import Plan from "../../model/gypsumBoard/Plan";

interface DashBoardProps {

}

const DashBoard: React.FC<DashBoardProps> = () => {
    const [selectedRange, setSelectedRange] = useState<{ startDate: Date | null, endDate: Date | null }>({
        startDate: null,
        endDate: null,
    });
    const [planData, setPlanData] = useState<Plan[]>([]);

    function handleDatesChange(startDate: Date | null, endDate: Date | null): void {
        setSelectedRange({ startDate, endDate });
    }

    useEffect(() => {
        const fetchPlan = async () => {
            if (selectedRange.startDate !== null && selectedRange.endDate !== null) {
                console.log(selectedRange.startDate);
                const fetchedPlan = await ApiService.fetchPlan(selectedRange.startDate, selectedRange.endDate);
                console.log("Получен план в размере " + fetchedPlan.length + " записей");
                setPlanData(fetchedPlan);
            }
        }
        fetchPlan();
    }, [selectedRange])

    return (
        <Container className="mt-5 ">
            <Row >
                <DayRangeSelector onDatesChange={handleDatesChange} />
                <Col className="col-9">
                </Col>
            </Row>
        </Container>
    )
}
export default DashBoard;