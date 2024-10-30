import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import PeriodSelector from "../planElements/periodselector";
import MixCategoryProduction from "../../../model/mix/prodution/MixCategoryProduction";
import MixApiService from "../../../service/MixApiService";

interface MixPlanProps { }

const MixPlan: React.FC<MixPlanProps> = ({ }) => {
    const now = new Date()
    const [period, setPeriod] = useState<Date>(new Date(now.getFullYear(), now.getMonth(), 1));
    const [planData, setPlanData] = useState<MixCategoryProduction | null>(null);


    const handlePeriodChange = (newPeriod: Date) => {
        setPeriod(newPeriod);
    }

    useEffect(() => {
        if (period) {
            const plan = MixApiService.getPlan(period);
        }
    }, [period]);
    
    return (
        <Container>
            <Row>
                <Col>
                    <PeriodSelector period={period} onPeriodChange={handlePeriodChange} />
                </Col>
            </Row>
        </Container>
    );
}