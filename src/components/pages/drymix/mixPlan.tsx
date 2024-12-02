import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import PeriodSelector from "../planElements/periodselector";
import MixCategoryProduction from "../../../model/mix/prodution/MixCategoryProduction";
import MixApiService from "../../../service/MixApiService";
import MixPlanTable from "./planComponents/mixPlanTable";
import MixPlan from "../../../model/mix/plan";
import MixPlanModal from "./planComponents/mixPlanModal";
import { table } from "console";
import MixPlanTableData from "./planComponents/mixPlanTableData";

interface MixPlanProps { }

const MixPlanPage: React.FC<MixPlanProps> = () => {
    const now = new Date();
    const [period, setPeriod] = useState<Date>(new Date(now.getFullYear(), now.getMonth(), 1));
    const [planData, setPlanData] = useState<MixPlan[]>([]);
    const [modalShow, setModalShow] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<MixPlan | null>(null);
    const [loading, setLoading] = useState(false);  // индикатор загрузки
    const [saving, setSaving] = useState(false); // New state for saving status


    const handlePeriodChange = (newPeriod: Date) => {
        setPeriod(newPeriod);
        console.log('Период изменен на ' + newPeriod.toLocaleDateString());
    };

    useEffect(() => {
        const loadPlanData = async () => {
            setLoading(true);
            try {
                const plan = await MixApiService.getPlan(period);
                setPlanData(plan);
            } catch (error) {
                console.error('Ошибка при загрузке данных плана:', error);
            } finally {
                setLoading(false);
            }
        };

        loadPlanData();
    }, [period]);

    const handleEditPlan = (plan: MixPlan | null) => {
        console.log('Редактирование плана:', plan);
        setSelectedPlan(plan);
        setModalShow(true);
    };




    const handleDeletePlan = async (plan: MixPlan) => {
        console.log('Удаление плана:', plan);

        try {
            const result = await MixApiService.deleteMixPlan(plan);
            setPlanData((prevData) => prevData.filter(p => p.id !== plan.id));
            console.log(`План с id=${result} успешно удален!`);
        } catch (error) {
            console.error('Ошибка при удалении плана:', error);
            alert('Ошибка при удалении плана. Повторите попытку.');
        }
    };

    const handleSave = async (plan: MixPlan) => {
        console.log('Сохранение плана:', plan);
        setModalShow(false);
        setSaving(true);

        try {
            const savedPlan: MixPlan = await MixApiService.upsertMixPlan(plan);
            console.log('Received saved plan:', savedPlan); // Лог полученного плана

            // Используйте функциональный вызов для обновления состояния
            setPlanData(prevData => {
                // Проверяем, существует ли план с таким же ID
                const existingPlanIndex = prevData.findIndex(p => p.id === savedPlan.id);
                if (existingPlanIndex !== -1) {
                    // Если план существует, обновляем его
                    const updatedPlans = [...prevData];
                    updatedPlans[existingPlanIndex] = savedPlan; // Заменяем существующий план
                    return updatedPlans;
                } else {
                    // Если план не существует, добавляем новый
                    return [...prevData, savedPlan];
                }
            });

            console.log('План успешно сохранен:', savedPlan);
        } catch (error) {
            console.error('Ошибка при сохранении плана:', error);
            alert('Ошибка при сохранении плана. Повторите попытку.');
        } finally {
            setSaving(false);
        }
    };


    const handleCloseModal = () => {
        setModalShow(false);
        setSelectedPlan(null);
    };

    useEffect(() => {
        console.log('Updated planData:', JSON.stringify(planData));
    }, [planData]);


    return (
        <Container className="mt-5">
            <Row></Row>
            <Row className="mt-3">
                <PeriodSelector period={period} onPeriodChange={handlePeriodChange} />
                <Col className="col-9">
                    {loading ? (
                        <p>Загрузка данных...</p>
                    ) : (
                        planData.length > 0 && <MixPlanTable planData={planData} planEditing={handleEditPlan} planDelete={handleDeletePlan} />
                    )}
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col xs={1}>
                    <Button variant="primary" onClick={() => setModalShow(true)} size="sm">
                        Добавить
                    </Button>
                </Col>
            </Row>
            <Row>
                {loading ? (
                    <p>Загрузка данных...</p>
                ) : (
                    <MixPlanTableData planList={planData} />
                )}
                {saving && ( // Saving indicator during save operation
                    <div className="text-center mt-3">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Сохранение...</span>
                        </Spinner>
                    </div>
                )}

            </Row>
            <MixPlanModal
                plan={selectedPlan}
                month={period}
                show={modalShow}
                onClose={handleCloseModal}
                onSave={handleSave}
            />
        </Container>
    );
};

export default MixPlanPage;
