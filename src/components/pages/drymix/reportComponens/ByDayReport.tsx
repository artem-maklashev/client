import React, { useEffect, useState } from "react";
import { Col, Container, Modal, Row } from "react-bootstrap";
import DayRangeSelector from "../../dashBoardComponent/dateRangeSelector";
import PlanFact from "./mixPlanFact";
import MixCategoryProduction from "../../../../model/mix/prodution/MixCategoryProduction";
import MixPlan from "../../../../model/mix/plan";
import MixApiService from "../../../../service/MixApiService";
import PlanFactCard from "./planFactCard";
import MixPieChart from "./pieChart";

interface ByDayReportProps { }

const ByDayReport: React.FC<ByDayReportProps> = () => {

    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [mixProduction, setMixProduction] = useState<MixCategoryProduction[]>([]);
    const [mixPlan, setMixPlan] = useState<MixPlan[]>([]);
    const [modalVisible, setModalVisible] = useState(false);

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

    const binderData: () => { name: string, value: number }[] = () => {
        const result: { name: string, value: number }[] = [];
        if (mixProduction.length > 0) {
            mixProduction.forEach(prod => {
                const existingData = result.find(item => item.name === prod.production.mix.binder.name);
                if (existingData) {
                    existingData.value += prod.quantity;
                } else {
                    result.push({ name: prod.production.mix.binder.name, value: prod.quantity });
                }
            });
            return result;
        } else {
            return [];
        }
    }

    const typeData: () => { name: string, value: number }[] = () => {
        const result: { name: string, value: number }[] = [];
        if (mixProduction.length > 0) {
            mixProduction.forEach(prod => {
                const existingData = result.find(item => item.name === prod.production.mix.dryMixType.name);
                if (existingData) {
                    existingData.value += prod.quantity;
                } else {
                    result.push({ name: prod.production.mix.dryMixType.name, value: prod.quantity });
                }
            });
            return result;
        } else {
            return [];
        }
    }

    const tradeMarkData: () => { name: string, value: number }[] = () => {
        const result: { name: string, value: number }[] = [];
        if (mixProduction.length > 0) {
            mixProduction.forEach(prod => {
                const existingData = result.find(item => item.name === prod.production.mix.tradeMark.name);
                if (existingData) {
                    existingData.value += prod.quantity;
                } else {
                    result.push({ name: prod.production.mix.tradeMark.name, value: prod.quantity });
                }
            });
            return result;
        } else {
            return [];
        }
    }

    const handlePieClick = (name: string) => {
        if (name.length > 0) {
            setModalVisible(true);
            alert(`Выбрано: ${name}`);
        }
    
        return (
            <Modal show={modalVisible} onHide={() => setModalVisible(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Детализация</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Запрошена информация по: {name}
                </Modal.Body>
            </Modal>
        )
    }


    return (
        <Container fluid className="mt-5 mb-5 bg-secondary">
            <Row></Row>
            <Row className="mt-3">
                <Col className="col-lg-3 col-md-6 col-sm-6 mb-2">
                    <Row>
                        <DayRangeSelector onDatesChange={handleRangeChange} />
                    </Row>
                    <Row>
                        <PlanFactCard planData={mixPlan} factData={mixProduction} />
                    </Row>
                </Col>
                <Col lg={9} sm={12} className="mb-5">
                    <Row>
                        <Col>
                            <PlanFact mixProduction={mixProduction} mixPlan={mixPlan} />
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={4} sm={12}>
                            <MixPieChart data={binderData()} title="Вяжущее" onClick={handlePieClick}  />
                        </Col>
                        <Col lg={4} sm={12}>
                            <MixPieChart data={typeData()} title='Тип смеси' onClick={handlePieClick} />
                        </Col>
                        <Col lg={4} sm={12}>
                            <MixPieChart data={tradeMarkData()} title='Торговая марка' onClick={handlePieClick} />
                        </Col>

                    </Row>
                </Col>
            </Row>
        </Container>
    );
}
export default ByDayReport;