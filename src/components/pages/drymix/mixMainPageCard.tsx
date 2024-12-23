import React, { useEffect, useMemo, useState } from "react";
import { Col, Spinner } from "react-bootstrap";
import MyCard from "../../../service/library/MyCard";
import MixPlan from "../../../model/mix/plan";
import MixCategoryProduction from "../../../model/mix/prodution/MixCategoryProduction";
import MixApiService from "../../../service/MixApiService";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

interface MixCardProps { }

const MixMainPageCard: React.FC<MixCardProps> = () => {
    const [plan, setPlan] = useState<MixPlan[]>([]);
    const [fact, setFact] = useState<MixCategoryProduction[]>([]);
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
                const response = await MixApiService.getPlanByDateBeetvean(firstDay, lastDay);
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
                const response: MixCategoryProduction[] = await MixApiService.getProductionByDateBeetvean(firstDay, lastDay);
                setFact(response.filter(item => item.category.id === 2));
            } catch (error) {
                console.error("Error fetching fact data:", error);
            } finally {
                setLoadingFact(false);
            }
        };

        fetchFact();
    }, [firstDay, lastDay]);

    const planSum = plan.reduce((sum, item) => sum + item.value, 0);
    const factSum = fact.reduce((sum, item) => sum + item.quantity, 0);
    const deviation = factSum - planSum;

    const getPlanDate = (date: Date) => {
        return date.toLocaleDateString("ru-RU", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    };

    const todayPlan = plan.filter(item => getPlanDate(new Date(item.planDate)) === getPlanDate(now));

    const items = (
        <Col className="mt-5 col-12">
            <MyCard
                label="План на текущий месяц"
                value={loadingPlan ? <Spinner animation="border" size="sm" /> : `${planSum.toFixed(0)} кг`}
            />
            <MyCard
                label="Изготовлено"
                value={loadingFact ? <Spinner animation="border" size="sm" /> : `${factSum.toFixed(0)} кг`}
            />
            <MyCard
                label="Отклонение"
                value={
                    loadingPlan || loadingFact
                        ? <Spinner animation="border" size="sm" />
                        : `${deviation < 0 ? 'отставание' : 'опережение на'} ${Math.abs(deviation).toFixed(0)} кг`
                }
                valueColor={deviation < 0 ? "#ff3333" : "#B3E5B3"}
            />
            <MyCard
                label="Запланированное производство"
                value={loadingPlan ? <Spinner animation="border" size="sm" /> :
                    <DataTable
                        value={todayPlan}
                        tableStyle={{ fontSize: '12px' }}
                        stripedRows
                        emptyMessage="Нет данных на сегодня"
                    >
                        <Column
                            header="Наименование смеси"
                            body={(rowData: MixPlan) =>
                                `${rowData.dryMix.tradeMark.name} ${rowData.dryMix.dryMixType.name} ${rowData.dryMix.binder.name} ${rowData.dryMix.name}`
                            } />
                        <Column field="value" header="Кол-во" />
                    </DataTable>
                }
            />
        </Col>
    );

    return (
        <MyCard
            label="Производство ССС"
            labelFontSize="14px"
            labelAlign="center"
            labelPosition={{ top: "-5px", left: "50px" }}
            value={items}
        />
    );
};

export default MixMainPageCard;
