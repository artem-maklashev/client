import React from "react";
import MixPlan from "../../../../model/mix/plan";
import MixCategoryProduction from "../../../../model/mix/prodution/MixCategoryProduction";
import { Card } from "primereact/card";
import { Col } from "react-bootstrap";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";


interface PlanFactCardProps {
    planData: MixPlan[];
    factData: MixCategoryProduction[]
}

const PlanFactCard: React.FC<PlanFactCardProps> = ({ planData, factData }) => {
    const plan = planData.reduce((acc, plan) => acc + plan.value, 0);
    const fact = factData.reduce((acc, fact) => acc + fact.quantity, 0);

    const data = [
        { type: 'План', value: plan },
        { type: 'Факт', value: fact },
        { type: 'Отклонение', value: fact - plan },
        { type: 'Процент отклонения', value: ((fact - plan) / plan * 100).toFixed(2) + '%' }
    ];

    return (
        <Col className="mt-2">
            <Card className='text-center'>
                <DataTable value={data} className="p-datatable-sm" header="План-факт производства" stripedRows columnResizeMode='fit' >
                    <Column field="type" header=" " />
                    <Column field="value" header="кг" />
                </DataTable>
            </Card>
        </Col>
    );
};

export default PlanFactCard;