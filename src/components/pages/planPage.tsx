import React, { useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
import PeriodSelector from "./planElements/periodselector";
import PlanTable from "./planElements/planTable";
import Plan from "../../model/gypsumBoard/Plan";
import ApiService from "../../service/ApiService";

interface PlanPageProps {

}

const PlanPage: React.FC<PlanPageProps> = () => {
    const [period, setPeriod ]= useState<Date>(new Date());
    const [planList,setPlanList] = useState<Plan[]>([]);

    function onPeriodChange(period: Date): void {
       setPeriod(period);      
    }

    useEffect(() => {
        setPlanList([]);
        ApiService.fetchPlanByMonth(period).then(setPlanList);
    }, [period]);



    return (
        <Container className="mt-5">
            <Row>
                <PeriodSelector onPeriodChange={onPeriodChange} />
            </Row>
            <Row>
                <PlanTable planList={planList} />
            </Row>
        </Container>
    );
}
export default PlanPage;