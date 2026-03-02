import React, { useEffect, useState } from "react";
import {  Col, Container, Row } from "react-bootstrap";
import PeriodSelector from "./planElements/periodselector";
import PlanTable from "./planElements/planTable";
import Plan from "../../model/gypsumBoard/Plan";
import ApiService from "../../service/ApiService";
import PlanDataTable from "./planElements/planDataTable";
import PlanModal from "./planElements/planModal";
import BoardProduction from "../../model/production/BoardProduction";

interface PlanPageProps {

}

const PlanPage: React.FC<PlanPageProps> = () => {
    const now = new Date()
    const [period, setPeriod] = useState<Date>(new Date(now.getFullYear(), now.getMonth(), 1));
    const [planList, setPlanList] = useState<Plan[]>([]);
    const [modalShow, setModalShow] = useState<boolean>(false);
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [productions, setProductions] = useState<BoardProduction[]>([]);

    function onPeriodChange(period: Date): void {
        setPeriod(period);
    }

    useEffect(() => {
        setPlanList([]);
        ApiService.fetchPlanByMonth(period).then(setPlanList);
        ApiService.fetchProductionsByMonth(period).then(setProductions);
    }, [period]);

    const handleClose = () => {
        setSelectedPlan(null);
        setModalShow(false);
    }

    const handleEditPlan = (plan: Plan | null) => {
        setSelectedPlan(plan);
        setModalShow(true);
    }

    const savePlan = async (plan: Plan) => {

        try {
            console.log('In saveplan section', JSON.stringify(plan));
            console.log(plan);

            // Сбрасываем состояние и закрываем модальное окно
            setSelectedPlan(null);
            setModalShow(false);

            // Ожидаем завершения сохранения плана
            const result = await ApiService.savePlanData(plan);
            console.log("Результат сохранения плана", result);

            // Очищаем список и заново загружаем данные
            setPlanList([]);
            const newPlanList = await ApiService.fetchPlanByMonth(period);
            setPlanList(newPlanList);

        } catch (error) {
            console.error("Ошибка при сохранении плана:", error);
        }
    };

    const planDelete = async (plan: Plan) => {
        try {
            const result = await ApiService.deletePlanData(plan);
            console.log("Удален план Id:", result);
            setPlanList([]);
            const newPlanList = await ApiService.fetchPlanByMonth(period);
            setPlanList(newPlanList);
        } catch {
            console.error("Ошибка при удалении плановых цифр");
        }
    }

    return (
        <Container fluid className="mt-5 ">
            <Row >
                {/* Левая колонка - два элемента друг под другом */}
                <Col lg={4} sm={12} className="mt-4">


                    <PeriodSelector onPeriodChange={onPeriodChange} period={period} />




                    {/* <div className="d-flex justify-content-start">
                        <Button variant="primary" onClick={() => setModalShow(true)} size="sm">
                            Добавить
                        </Button>
                    </div> */}

                    <PlanTable planList={planList} planEditing={handleEditPlan} planDelete={planDelete} onAddPlan={() => setModalShow(true)} />

                </Col>

                {/* Кнопка "Добавить" под таблицей */}






                {/* Правая колонка - третий элемент справа */}
                <Col lg={8} sm={12} className="mt-4">
                    <PlanDataTable planList={planList} productions={productions} />
                </Col>
            </Row>

            <PlanModal show={modalShow} onClose={handleClose} month={period} plan={selectedPlan} onSave={savePlan} />
        </Container>
    );
}
export default PlanPage;