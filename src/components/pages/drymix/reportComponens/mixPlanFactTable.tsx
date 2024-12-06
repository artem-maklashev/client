import { useEffect, useState } from "react";
import MixPlan from "../../../../model/mix/plan";
import MixCategoryProduction from "../../../../model/mix/prodution/MixCategoryProduction";
import React from "react";
import DryMix from "../../../../model/mix/DryMix";
import { Col } from "react-bootstrap";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

interface MixPlanFactTableProps {
    planData: MixPlan[];
    productionsData: MixCategoryProduction[];

}

interface combinedData {
    title: string;
    planValue: number;
    factValue: number;
}

const MixPlanFactTable: React.FC<MixPlanFactTableProps> = ({ planData, productionsData }) => {
    const [plans, setPlans] = useState<MixPlan[]>(planData);
    const [productions, setProductions] = useState<MixCategoryProduction[]>(productionsData);
    const [data, setData] = useState<combinedData[]>([]);

    useEffect(() => {
        const getData = () => {
            const data: combinedData[] = [];
            plans.forEach(plan => {
                const name = getName(plan.dryMix);
                const existingData = data.find(item => item.title === name);
                if (existingData) {
                    existingData.planValue += plan.value;
                } else {
                    data.push({
                        title: name,
                        planValue: plan.value,
                        factValue: 0
                    });
                }
            });
            productions.forEach(production => {
                const name = getName(production.production.mix);
                const existingData = data.find(item => item.title === name);
                if (existingData) {
                    existingData.factValue += production.quantity;
                } else {
                    data.push({
                        title: name,
                        planValue: 0,
                        factValue: production.quantity
                    });
                }
            });
            return data;
        }
        setPlans(planData)
        setProductions(productionsData)
        setData(getData());
    }, [planData, plans, productions, productionsData]);

    function getName(mix: DryMix) {
        return `${mix.tradeMark.name} ${mix.dryMixType.name} ${mix.binder.name} ${mix.name}`
    }

    const calculateTotal = <K extends keyof combinedData>(property: K): number => {
        return data.reduce((total, item) => total + Number(item[property]), 0);
    };


    return (
        <DataTable
            value={data}
            className="p-datatable-sm"
            stripedRows
            columnResizeMode="fit"
            scrollable
            scrollHeight="500px"
        >
            <Column field="title" header="Наименование" />
            <Column
                field="planValue"
                header="План"
                // footer={data.reduce((sum, row) => sum + row.planValue, 0)}
            />
            <Column
                field="factValue"
                header="Факт"
                // footer={data.reduce((sum, row) => sum + row.factValue, 0)}
            />
            <Column
                header="+/-"
                body={(rowData) => {
                    const difference = rowData.factValue - rowData.planValue;
                    return (
                        <span style={{ color: difference < 0 ? 'red' : 'inherit' }}>
                            {difference}
                        </span>
                    );
                }}
                // footer={data.reduce((sum, row) => sum + (row.factValue - row.planValue), 0)}
            />

        </DataTable>

    );
};

export default MixPlanFactTable;