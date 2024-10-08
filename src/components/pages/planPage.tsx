import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import PeriodSelector from "./planElements/periodselector";
import PlanTable from "./planElements/planTable";
import Plan from "../../model/gypsumBoard/Plan";
import ApiService from "../../service/ApiService";
import PlanDataTable from "./planElements/planDataTable";
import PlanModal from "./planElements/planModal";

interface PlanPageProps {

}

const PlanPage: React.FC<PlanPageProps> = () => {
    const [period, setPeriod] = useState<Date>(new Date());
    const [planList, setPlanList] = useState<Plan[]>([]);
    const [modalShow, setModalShow] = useState<boolean>(false);
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

    function onPeriodChange(period: Date): void {
        setPeriod(period);
    }

    useEffect(() => {
        setPlanList([]);
        ApiService.fetchPlanByMonth(period).then(setPlanList);
    }, [period]);

    const handleClose = () => {
        setSelectedPlan(null);
        setModalShow(false);
    }

    const handleEditPlan = (plan: Plan | null) => {
        setSelectedPlan(plan);
        setModalShow(true);
    }

    const savePlan = (plan: Plan) => {
        console.log('In saveplan section');
        setSelectedPlan(null);
        setModalShow(false);
    }

    return (
        <Container className="mt-5 mb-5">
            <Row>
                <PeriodSelector onPeriodChange={onPeriodChange} />
            </Row>
            <Container className="mb-2">
                <Row>
                    <PlanTable planList={planList} planEditing={handleEditPlan}/>
                </Row>
                <Row className='justify-content-center'>
                    <Col xs={1}>
                        <Button variant="primary" onClick={() => setModalShow(true)} size="sm">Добавить</Button>
                    </Col>
                </Row>
            </Container>
            <Row >
                <PlanDataTable planList={planList} />
            </Row>
            <PlanModal show={modalShow} onClose={handleClose} month={period} plan={selectedPlan} onSave={savePlan}/>
        </Container>
    );
}
export default PlanPage;