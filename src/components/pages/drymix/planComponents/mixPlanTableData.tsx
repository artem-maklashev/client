import React, { FC } from 'react';
import MixPlan from '../../../../model/mix/plan';
import DryMix from '../../../../model/mix/DryMix';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import MixCategoryProduction from '../../../../model/mix/prodution/MixCategoryProduction';
import { ProgressSpinner } from 'primereact/progressspinner';

interface MixPlanTableDataProps {
    planList: MixPlan[];
    productions: MixCategoryProduction[];
}

interface MixPlanStructure {
    mix: DryMix;
    values: { [date: string]: number | null };
}

interface ProductionData {
    mix: DryMix;
    values: { [date: string]: number | null };
}

interface FormattedData {
    mix: DryMix; // Информация о смеси
    planValue: { [date: string]: number | null }; // Плановые значения по датам
    factValue: { [date: string]: number | null }; // Фактические значения по датам
}


const MixPlanTableData: FC<MixPlanTableDataProps> = ({ planList, productions }) => {
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



    const groupedProductions = (prod: MixCategoryProduction[]) => {
        const groupedData: { [gypsumBoardId: string]: ProductionData } = {}; // Используем Record для более строгого типа

        prod.forEach((p) => {
            const date = new Date(p.production.productionDate).toLocaleDateString();
            const mixId = p.production.mix.id;

            // Убедимся, что объект для текущего гипсокартона инициализирован
            if (!groupedData[mixId]) {
                groupedData[mixId] = {
                    mix: p.production.mix,
                    values: {}, // Инициализируем пустой объект для значений
                };
            }

            const pValue = Number(p.quantity.toFixed(0));
            // Добавляем значение по дате для текущего гипсокартона
            if (groupedData[mixId].values[date] === null) {
                groupedData[mixId].values[date] = pValue;
            } else {
                groupedData[mixId].values[date] = (groupedData[mixId].values[date] ?? 0) + pValue;
            }
        });

        return Object.values(groupedData);
    };

    const formatGroupedData = (groupedPlans: MixPlanStructure[], groupedProductions: ProductionData[])=> {
        const formattedData: FormattedData[] = [];

        groupedPlans.forEach((plan) => {
            const production = groupedProductions.find(
                (prod) => prod.mix.id === plan.mix.id
            );

            formattedData.push(
                {
                    mix: plan.mix,
                    planValue: plan.values ?? {},
                    factValue: production ? production.values : {},
                }
            );
        });

        return formattedData;
    };

    const headers = generateHeaders(planList);
    const groupedPlans = groupByMix(planList);
    const columnTotals = calculateColumnsTotal(groupedPlans, headers);
    const groupedProd = groupedProductions(productions);
    const formattedData = formatGroupedData(groupedPlans, groupedProd);

    if (!formattedData.length) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                <ProgressSpinner />
            </div>
        );
    }

    return (
        <div className="card mt-2 mb-3"> {/* Added card container */}
            <DataTable
                value={formattedData}
                scrollable
                scrollHeight="600px"
                showGridlines
                stripedRows
                tableStyle={{ fontSize: '14px' }} // Increased font size
                className="custom-datatable" // Added PrimeReact style class for smaller table
                dataKey="mix.id" // Added dataKey for better performance
            >
                <Column
                    header="Наименование смеси"
                    body={(rowData) =>
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
                        body={(rowData) => 
                        <div style={{ textAlign: 'center', padding: '1' }}>
                            <div style={{ color: 'blue', fontWeight: 'bold' }}>
                                {rowData.planValue[date] ? rowData.planValue[date].toLocaleString('ru-RU', { maximumFractionDigits: 0 }) : ''}
                            </div>

                            <div style={{
                                color: !rowData.planValue[date] ? 'green' : rowData.planValue[date] < rowData.factValue[date] ? 'green' : 'red', fontSize: '10px'
                            }}>
                                {rowData.factValue[date] ? rowData.factValue[date].toLocaleString('ru-RU', { maximumFractionDigits: 0 }) : ''}
                            </div>
                        </div>}
                        footer={
                            <div className="text-center font-bold">
                                {columnTotals[date] ?? 0}
                            </div>
                        }
                        style={{ textAlign: 'right' }} // Align numbers to the right
                    />
                ))}

                <Column
                    header="Итого"
                    body={(rowData) => calculateRowTotal(rowData.planValue)}
                    footer={Object.values(columnTotals).reduce((total, value) => total + value, 0)}
                    className="font-bold"
                    style={{ textAlign: 'right', }} // Align totals to the right
                />
            </DataTable>
        </div>
    );
};

export default MixPlanTableData;
