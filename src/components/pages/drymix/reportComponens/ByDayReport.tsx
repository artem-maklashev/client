import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import DayRangeSelector from "../../dashBoardComponent/dateRangeSelector";
import PlanFact from "./mixPlanFact";
import MixCategoryProduction from "../../../../model/mix/prodution/MixCategoryProduction";
import MixPlan from "../../../../model/mix/plan";
import ApiService from "../../../../service/ApiService";
import MixApiService from "../../../../service/MixApiService";
import PlanFactCard from "./planFactCard";

interface ByDayReportProps { }

const ByDayReport: React.FC<ByDayReportProps> = () => {

    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [mixProduction, setMixProduction] = useState<MixCategoryProduction[]>([]);
    const [mixPlan, setMixPlan] = useState<MixPlan[]>([]);

    const handleRangeChange = (startDate: Date | null, endDate: Date | null) => {
        setStartDate(startDate);
        setEndDate(endDate);
    }

    useEffect(() => {
        const loadData = async () => {
            if (startDate && endDate) {
                try {
                    const production = await MixApiService.getProductionByDateBeetvean(startDate, endDate);
                    setMixProduction(production);
                } catch (error: any) {
                    console.error('error in MixApiService.getProductionByDateBeetvean', error.message, error.stack, 'error')
                }
                try {
                    const plan = await MixApiService.getPlanByDateBeetvean(startDate, endDate);
                    setMixPlan(plan);
                } catch (error: any) {
                    console.error('error in MixApiservice.getPlanByDateBeervean', error.message);
                }
            } else {
                console.log('startDate or endDate is null');
                const now = new Date();
                setStartDate(new Date(now.getFullYear(), now.getMonth(), 1));
                setEndDate(now);
            }
        }
        loadData();
    }, [startDate, endDate]);

    return (
        <Container fluid className="mt-5 mb-5 bg-secondary">
            <Row></Row>
            <Row className="mt-3">
                <Col className="col-lg-3 col-md-6 col-sm-6 mb-2">
                <Row>
                    <DayRangeSelector onDatesChange={handleRangeChange} />
                </Row>
                <Row>
                    <PlanFactCard planData={mixPlan} factData={mixProduction} />                </Row>
                </Col>
                <Col lg={9} sm={12} className="mb-5">
                    <Row>
                        <PlanFact mixProduction={mixProduction} mixPlan={mixPlan} />
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}
export default ByDayReport;