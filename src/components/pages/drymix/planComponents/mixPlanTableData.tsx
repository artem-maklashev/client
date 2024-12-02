import React, { FC } from 'react';
import MixPlan from '../../../../model/mix/plan';
import DryMix from '../../../../model/mix/DryMix';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

interface MixPlanTableDataProps {
    planList: MixPlan[];
}

interface MixPlanStructure {
    mix: DryMix;
    values: { [date: string]: number | null };
}

const MixPlanTableData: FC<MixPlanTableDataProps> = ({ planList }) => {
    const generateHeaders = (planData: MixPlan[]) => {
        const headersData: string[] = [];
        planData.forEach((plan) => {
            const dateString = new Date(plan.planDate).toLocaleDateString();
            if (!headersData.includes(dateString)) {
                headersData.push(dateString);
            }
        });
        return headersData.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    };

    const groupByMix = (planData: MixPlan[]) => {
        const groupedData: { [mixId: string]: MixPlanStructure } = {};
        planData.forEach((plan) => {
            const date = new Date(plan.planDate).toLocaleDateString();
            const mixId = plan.dryMix.id;

            if (!groupedData[mixId]) {
                groupedData[mixId] = { mix: plan.dryMix, values: {} };
            }
            groupedData[mixId].values[date] = plan.value;
        });
        return Object.values(groupedData);
    };

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
    };

    const headers = generateHeaders(planList);
    const groupedPlans = groupByMix(planList);
    const columnTotals = calculateColumnsTotal(groupedPlans, headers);

    return (
        <div className="card mt-2"> {/* Added card container */}
            <DataTable
                value={groupedPlans}
                scrollable
                scrollHeight="600px"
                showGridlines
                stripedRows
                tableStyle={{ fontSize: '14px' }} // Increased font size
                className="p-datatable-sm" // Added PrimeReact style class for smaller table
                dataKey="mix.id" // Added dataKey for better performance
            >
                <Column
                    header="Наименование смеси"
                    body={(rowData: MixPlanStructure) =>
                        `${rowData.mix.tradeMark.name} ${rowData.mix.dryMixType.name} ${rowData.mix.binder.name} ${rowData.mix.name}`
                    }
                    style={{ minWidth: '330px' }}
                    frozen
                    className="font-bold"
                />

                {headers.map((date) => (
                    <Column
                        key={date}
                        header={date}
                        body={(rowData) => rowData.values[date] || null}
                        footer={columnTotals[date] ?? 0}
                        style={{ textAlign: 'right' }} // Align numbers to the right
                    />
                ))}

                <Column
                    header="Итого"
                    body={(rowData) => calculateRowTotal(rowData.values)}
                    footer={Object.values(columnTotals).reduce((total, value) => total + value, 0)}
                    className="font-bold"
                    style={{ textAlign: 'right', }} // Align totals to the right
                />
            </DataTable>
        </div>
    );
};

export default MixPlanTableData;
