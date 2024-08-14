
import React, { useEffect, useState } from "react"
import DayRangeSelector from "./dashBoardComponent/dateRangeSelector";
import { Col, Container, Row } from "react-bootstrap";
import ApiService from "../../service/ApiService";
import Plan from "../../model/gypsumBoard/Plan";
import PlanFactChart from "./dashBoardComponent/planFactChart";
import BoardProduction from "../../model/production/BoardProduction";
import Speedometr from "./dashBoardComponent/speedometr";
import BatteryChart from "./dashBoardComponent/batteryChart";

interface DashBoardProps {

}
const now = new Date();
const DashBoard: React.FC<DashBoardProps> = () => {
    const [selectedRange, setSelectedRange] = useState<{ startDate: Date | null, endDate: Date | null }>({
        startDate: new Date(now.getFullYear(), now.getMonth(), 1),
        endDate: now
    });
    const [planData, setPlanData] = useState<Plan[]>([]);
    const [productionData, setProductionData] = useState<BoardProduction[]>([]);
    const [allProductionData, setAllProductionData] = useState<BoardProduction[]>([]);

    function handleDatesChange(startDate: Date | null, endDate: Date | null): void {
        setSelectedRange({ startDate, endDate });
    }

    function filterBoardProductions(boardProductions: BoardProduction[]): BoardProduction[] {
        const filtered = boardProductions.filter((bp) => bp.category.id === 2 || bp.category.id === 3);
        return filtered;
    }

    useEffect(() => {
        const fetchData = async () => {
            if (selectedRange.startDate !== null && selectedRange.endDate !== null) {
                // console.log(selectedRange.startDate);
                const fetchedPlan = await ApiService.fetchPlan(selectedRange.startDate, selectedRange.endDate);
                console.log("Получен план в размере " + fetchedPlan.length + " записей");
                setPlanData(fetchedPlan);
                const fetchedProduction = await ApiService.fetchBoardProduction(selectedRange.startDate, selectedRange.endDate);
                console.log("Получены данные по производству в размере " + fetchedProduction.length);
                setAllProductionData(fetchedProduction);
                const production = filterBoardProductions(fetchedProduction);
                setProductionData(production);                
            }
        }
        fetchData();
    }, [selectedRange])


    return (
        <Container className="mt-5 ">
            <Row >
                <Col className="col-lg-3 col-sm-6">
                    <Row>
                        <DayRangeSelector onDatesChange={handleDatesChange} />
                    </Row>
                    <Row>
                        <Speedometr productionData={allProductionData}/>
                    </Row>
                    <Row>
                        <BatteryChart planData={planData} factData={productionData}/>
                    </Row>
                </Col>
                <Col className="col-9">
                    <PlanFactChart planData={planData} productionData={productionData} />
                </Col>
            </Row>
        </Container>
    )
}
export default DashBoard;