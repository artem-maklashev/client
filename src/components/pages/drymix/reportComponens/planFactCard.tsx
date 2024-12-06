import React from "react";
import MixPlan from "../../../../model/mix/plan";
import MixCategoryProduction from "../../../../model/mix/prodution/MixCategoryProduction";
import { Card } from "primereact/card";
import { Col } from "react-bootstrap";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import MixPlanFactTable from "./mixPlanFactTable";
import { Divider } from "primereact/divider";

interface PlanFactCardProps {
    planData: MixPlan[];
    factData: MixCategoryProduction[];
}

const PlanFactCard: React.FC<PlanFactCardProps> = ({ planData, factData }) => {
    // Подсчет общего плана и фактических данных
    const plan = planData.reduce((acc, plan) => acc + plan.value, 0);
    const fact = factData.reduce((acc, fact) => acc + fact.quantity, 0);

    // Подготовка данных для таблицы
    const data = [
        { type: "План", value: plan },
        { type: "Факт", value: fact },
        { type: "Отклонение", value: fact - plan },
        { type: "Процент отклонения", value: `${((fact - plan) / plan * 100).toFixed(2)}%` },
    ];

    return (
        <Col className="mt-2">
            <Card
                className="text-center shadow-sm border-0 p-card"
                header={
                    <div
                        className="bg-primary text-white text-uppercase" // Bootstrap классы
                        style={{
                            fontSize: "1rem", // Размер шрифта заголовка
                            padding: "5px", // Отступы внутри заголовка
                            borderRadius: "5px 5px 0 0", // Скругление верхних углов
                        }}
                    >
                        План-факт
                    </div>
                }
            >
                    <DataTable
                        value={data}
                        className="p-datatable-sm"
                        stripedRows
                        columnResizeMode="fit"
                    >
                        <Column field="type" header=" " />
                        <Column field="value" header="Значение" body={(rowData) => {
                    return (
                        <span style={{ color: rowData.value < 0 ? 'red' : 'inherit' }}>
                            {rowData.value}
                        </span>
                    );
                }} />
                    </DataTable>
                    <Divider className="mt-3 mb-2" />
                <MixPlanFactTable planData={planData} productionsData={factData} />
            </Card>
        </Col>
    );
};

export default PlanFactCard;
