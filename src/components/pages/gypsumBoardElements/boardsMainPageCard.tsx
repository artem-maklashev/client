import React, { useEffect, useMemo, useState } from "react";
import { Col, Row, Spinner } from "react-bootstrap";
import MyCard from "../../../service/library/MyCard";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Plan from "../../../model/gypsumBoard/Plan";
import BoardProduction from "../../../model/production/BoardProduction";
import ApiService from "../../../service/ApiService";
import { width } from "@mui/system";

interface BoardCardProps { }

const BoardMainPageCard: React.FC<BoardCardProps> = () => {
    const [plan, setPlan] = useState<Plan[]>([]);
    const [fact, setFact] = useState<BoardProduction[]>([]);
    const [loadingPlan, setLoadingPlan] = useState(true);
    const [loadingFact, setLoadingFact] = useState(true);

    const now = new Date();
    const firstDay = useMemo(() => new Date(now.getFullYear(), now.getMonth(), 1), []);
    const lastDay = useMemo(() => new Date(now.getFullYear(), now.getMonth() + 1, 0), []);

    // Fetch Plan Data
    useEffect(() => {
        const fetchPlan = async () => {
            setLoadingPlan(true);
            try {
                const response = await ApiService.fetchPlan(firstDay, lastDay);
                setPlan(response);
            } catch (error) {
                console.error("Error fetching plan data:", error);
            } finally {
                setLoadingPlan(false);
            }
        };

        fetchPlan();
    }, [firstDay, lastDay]);

    // Fetch Fact Data
    useEffect(() => {
        const fetchFact = async () => {
            setLoadingFact(true);
            try {
                const response = await ApiService.fetchBoardProduction(firstDay, lastDay);
                setFact(response);
            } catch (error) {
                console.error("Error fetching fact data:", error);
            } finally {
                setLoadingFact(false);
            }
        };

        fetchFact();
    }, [firstDay, lastDay]);

    const getPlanDate = (date: Date) => {
        return date.toLocaleDateString("ru-RU", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    };

    function getCurrentDate(): string {
        const now = new Date();
        const year = now.getUTCFullYear();
        const month = (now.getUTCMonth() + 1).toString().padStart(2, "0");
        const day = now.getUTCDate().toString().padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    const planSum = plan.reduce((sum, item) => sum + item.planValue, 0);
    const factSum = fact.filter(f => f.category.id > 1 && f.category.id <= 4).reduce((sum, item) => sum + item.value, 0);
    const todayPlan = plan.filter(item => getPlanDate(new Date(item.planDate)) === getPlanDate(now));
    const toTodayPlan = plan
        .filter((plan) => new Date(plan.planDate) < new Date(getCurrentDate()))
        .reduce((acc, plan) => acc + plan.planValue, 0);
    const deviation = factSum - toTodayPlan;


    const sortedBoardProduction = fact.filter(
        (board) => board.category.id < 5
    );

    const { total, value } = sortedBoardProduction.reduce(
        (acc, board) => {
            const isCategory1 = board.category.id === 1;
            if (isCategory1) {
                acc.total += board.value;
            } else {
                acc.value += board.value;
            }
            return acc;
        },
        { total: 0, value: 0 }
    );

    const defectPercentResult =
        total === 0 ? 0 : ((total - value) / total) * 100;

    const items = (
        <Col className="mt-5 col-12">
            {/* Основные показатели */}
            <Row className="g-4 mb-4">
                <Col md={6} lg={6}>
                    <MyCard
                        label={"План на текущий месяц"}
                        value={loadingPlan ? <Spinner animation="border" size="sm" /> : `${planSum.toLocaleString('ru-RU', { maximumFractionDigits: 0 })} м²`}                        
                    />
                </Col>
                <Col md={6} lg={6}>
                    <MyCard
                        label="Изготовлено"
                        value={loadingFact ? <Spinner animation="border" size="sm" /> : `${factSum.toLocaleString('ru-RU', { maximumFractionDigits: 0 })} м²`}
                    />
                </Col>
            </Row>
            <Row className="g-4 mb-4">

                <Col md={6} lg={6}>
                    <MyCard
                        label="Отклонение"
                        value={
                            loadingPlan || loadingFact
                                ? <Spinner animation="border" size="sm" />
                                : `${deviation < 0 ? 'отставание' : 'опережение на'} ${Math.abs(deviation).toLocaleString('ru-RU', { maximumFractionDigits: 0 })} м²`
                        }
                        valueColor={deviation < 0 ? "#ff3333" : "#2E8B57"}
                    />
                </Col>
                <Col md={6} lg={6}>
                    <MyCard
                        label="Процент брака"
                        value={defectPercentResult ? defectPercentResult.toFixed(2) + " %" : <Spinner />}
                        valueColor={(defectPercentResult) > 3 ? '#FF7F7F' : '#2E8B57'}
                    />
                </Col>
            </Row>

            {/* Подробная информация */}
            <Row className="g-4">
                <Col lg={12}>
                    <MyCard
                        label="Запланированное производство"
                        value={
                            loadingPlan ? <Spinner animation="border" size="sm" /> :
                                <div className="table-responsive">
                                    <DataTable
                                        value={todayPlan}
                                        tableStyle={{ fontSize: '12px', minWidth: '100%' }}
                                        stripedRows
                                        emptyMessage="Нет данных на сегодня"
                                    >
                                        <Column
                                            header='Наименование ГСП'
                                            body={(rowData: Plan) => `${rowData.gypsumBoard.tradeMark.name} ${rowData.gypsumBoard.boardType.name}-${rowData.gypsumBoard.edge.name} ${rowData.gypsumBoard.thickness.value}-${rowData.gypsumBoard.width.value}-${rowData.gypsumBoard.length.value}`}
                                        />
                                        <Column
                                            header='Кол-во'
                                            body={(rowData: Plan) => rowData.planValue}
                                        />
                                    </DataTable>
                                </div>
                        }
                    />
                </Col>
            </Row>
        </Col>
    );

    return (
        <MyCard
            label="Производство ГСП"
            labelFontSize="14px"
            labelAlign="center"
            labelPosition={{ top: "-5px", left: "50px" }}
            value={items}
        />
    );
};

export default BoardMainPageCard;
