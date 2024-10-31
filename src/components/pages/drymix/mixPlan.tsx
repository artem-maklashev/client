import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import PeriodSelector from "../planElements/periodselector";
import MixCategoryProduction from "../../../model/mix/prodution/MixCategoryProduction";
import MixApiService from "../../../service/MixApiService";
import MixPlanTable from "./planComponents/mixPlanTable";
import MixPlan from "../../../model/mix/plan";
import MixPlanModal from "./planComponents/mixPlanModal";

interface MixPlanProps { }

const MixPlanPage: React.FC<MixPlanProps> = ({ }) => {
    const now = new Date();
    const [period, setPeriod] = useState<Date>(new Date(now.getFullYear(), now.getMonth(), 1));
    const [planData, setPlanData] = useState<MixPlan[]>([]);
    const [modalShow, setModalShow] = useState(false);  

    

    const handlePeriodChange = (newPeriod: Date) => {
        setPeriod(newPeriod);
        alert('Период изменен на ' + newPeriod.toLocaleDateString());
    }

    useEffect(() => {
        const planRequest = async () => {
            const plan = await MixApiService.getPlan(period);
            if (plan.length > 0)
            setPlanData(plan);
        }
        planRequest();

        if (period) {
           planRequest();
        }
    }, [period]);

    const handleEditPlan = (plan: MixPlan | null) => {
        console.log(plan);
    }

    const handleDeletePlan = (plan: MixPlan) => {
        console.log(plan);
    }

    const handleSave = (plan: MixPlan) => {
        console.log(plan);
    }

    const handleCloseModal = () => {
        setModalShow(false);
    }
    
    return (
        <Row>
        <Container className="mt-5">
            <Row>
               
                    <PeriodSelector period={period} onPeriodChange={handlePeriodChange} />
                
                <Col className="col-9">
                <MixPlanTable planData={planData} planEditing={handleEditPlan} planDelete={handleDeletePlan} />
                </Col>

            </Row>
            <Row className='justify-content-center'>
                        <Col xs={1}>
                            <Button variant="primary" onClick={() => setModalShow(true)} size="sm">Добавить</Button>
                        </Col>
                    </Row>
        </Container>
        <MixPlanModal plan={null} month={period} show={modalShow} onClose={handleCloseModal} onSave={handleSave} />
        </Row>
    );
}
export default MixPlanPage;