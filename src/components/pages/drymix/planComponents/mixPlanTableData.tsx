import React from "react";
import { FC } from "react";
import MixPlan from "../../../../model/mix/plan";
import DryMix from "../../../../model/mix/DryMix";
import { Container } from "react-bootstrap";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

interface MixPlanTableDataProps {
    planList: MixPlan[];
}

interface MixPlanStructure {
    mix: DryMix;
    values: {[date: string]: number | null};
}

const MixPlanTableData: FC<MixPlanTableDataProps> = ({ planList}) => {
    
    const generateHeaders = (planData: MixPlan[]) => {
        const headersData: string[] = [];
        planData.forEach((plan) => {
            const dateString = new Date(plan.planDate).toLocaleDateString();
            if (!headersData.includes(dateString)) {
                headersData.push(dateString);
            }
        });
        return headersData.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    } 

    const groupByMix = (planData: MixPlan[]) => {

        const groupedData: {[mixId: string]: MixPlanStructure} = {};

        planData.forEach((plan) => {
            const date = new Date(plan.planDate).toLocaleDateString();
            const mixId = plan.dryMix.id;

            if (!groupedData[mixId]) {
                groupedData[mixId] = {
                    mix: plan.dryMix, values: {}
                };
            };
            groupedData[mixId].values[date] = plan.value;
        });
        return Object.values(groupedData);
    }

    const calculateRowTotal = (values: { [date: string]: number | null }) => {
        return Object.values(values).reduce((total: number, value: number | null) => {
            return total + (value ?? 0);
        }, 0);
    };

    const calculateColumnsTotal = (groupedPlans: MixPlanStructure[], headers: string[]): { [date: string]: number } => {
        const columnsTotals: { [date: string]: number } = {};
        headers.forEach((date) => {
            let totalForDate = 0;
            groupedPlans.forEach((plan) => {
                totalForDate += plan.values[date] ?? 0;
            });
            columnsTotals[date] = totalForDate;
       
        });
        return columnsTotals;
    }

    const headers = generateHeaders(planList);
    const groupedPlans = groupByMix(planList);
    const columnTotals = calculateColumnsTotal(groupedPlans, headers);
    
    
    return (
        <Container className="mb-3 mt-3">
            <DataTable value={groupedPlans} scrollable scrollHeight="600px" showGridlines stripedRows>
                {/* Колонка с информацией о гипсокартоне */}
                <Column
                    header="Наименование смеси"
                    body={(rowData: MixPlanStructure) => `${rowData.mix.tradeMark.name} ${rowData.mix.dryMixType.name} ${rowData.mix.binder.name} ${rowData.mix.name}`
                    }                    
                    style={{ minWidth: '330px' }} frozen className="font-bold"

                />

                {/* Динамические колонки по датам */}
                {headers.map((date) => (
                    <Column
                        key={date}
                        header={date}
                        body={(rowData) => rowData.values[date] || null} // Показываем значение по дате или null                        
                        footer={columnTotals[date] ?? 0}
                    />
                ))}
                {/* Колонка с итогом по строке */}
                <Column
                    header="Итого"
                    body={(rowData) => calculateRowTotal(rowData.values)} // Выводим сумму по строке
                    footer={Object.values(columnTotals).reduce((total, value) => total + value, 0)} // Итоговая сумма по всем столбцам
                    className="font-bold"
                />
            </DataTable>
        </Container>
    );    
};
export default MixPlanTableData;