import React from "react";
import Plan from "../../../model/gypsumBoard/Plan";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import GypsumBoard from "../../../model/gypsumBoard/GypsumBoard";
// import 'primereact/resources/themes/nano/theme.css';
import BoardProduction from "../../../model/production/BoardProduction";
import { ProgressSpinner } from "primereact/progressspinner";
import { Button } from "primereact/button";
import { exportToHTML } from "./exportToHTML";

interface PlanTableProps {
    planList: Plan[];
    productions: BoardProduction[];
}

// Структура данных для группировки по гипсокартону
interface GypsumBoardPlan {
    gypsumBoard: GypsumBoard;
    values: { [date: string]: number | null };
}

interface ProductionData {
    gypsumBoard: GypsumBoard;
    values: { [date: string]: number | null };
}

const PlanDataTable: React.FC<PlanTableProps> = ({ planList, productions }) => {

    // Генерация заголовков по уникальным датам
    const generateHeaders = (planData: Plan[], productions: BoardProduction[]) => {
        const headersData: string[] = [];
        planData.forEach((plan) => {
            const dateString = new Date(plan.planDate).toLocaleDateString();
            if (!headersData.includes(dateString)) {
                headersData.push(dateString);
            }
        });
        productions.forEach((production) => {
            const dateString = new Date(production.productionList.productionDate).toLocaleDateString();
            if (!headersData.includes(dateString)) {
                headersData.push(dateString);
            }
        });
        return headersData.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    };

    // Группировка данных по гипсокартону
    const groupByGypsumBoard = (planData: Plan[]) => {
        const groupedData: { [gypsumBoardId: string]: GypsumBoardPlan } = {};

        planData.forEach((plan) => {
            const date = new Date(plan.planDate).toLocaleDateString();
            const gypsumBoardId = plan.gypsumBoard.id;

            if (!groupedData[gypsumBoardId]) {
                groupedData[gypsumBoardId] = {
                    gypsumBoard: plan.gypsumBoard,
                    values: {},
                };
            }

            // Добавляем значение по дате для этого гипсокартона
            groupedData[gypsumBoardId].values[date] = plan.planValue;
        });

        return Object.values(groupedData);
    };


    // Расчёт итога для каждой строки
    const calculateRowTotal = (planValues: { [date: string]: number | null }): number => {
        return Object.values(planValues).reduce((total: number, planValue: number | null) => {
            return total + (planValue ?? 0); // Суммируем только плановые значения, пропуская null
        }, 0);
    };
    type DateValueGroup = {
        values: { [date: string]: number | null };
    };


    // Расчёт итога для каждого столбца (для каждой даты)
    const calculateColumnTotals = (groupedData: DateValueGroup[], headers: string[]): { [date: string]: number } => {
        const columnTotals: { [date: string]: number } = {};

        headers.forEach((date) => {
            let totalForDate = 0;
            groupedData.forEach((plan) => {
                totalForDate += plan.values[date] ?? 0; // Если значение null, то прибавляем 0
            });
            columnTotals[date] = totalForDate;
        });

        return columnTotals;
    };

    const groupedProductions = (prod: BoardProduction[]) => {
        const groupedData: { [gypsumBoardId: string]: ProductionData } = {}; // Используем Record для более строгого типа

        prod.forEach((p) => {
            const date = new Date(p.productionList.productionDate).toLocaleDateString();
            const gypsumBoardId = p.product.id;

            // Убедимся, что объект для текущего гипсокартона инициализирован
            if (!groupedData[gypsumBoardId]) {
                groupedData[gypsumBoardId] = {
                    gypsumBoard: p.product,
                    values: {}, // Инициализируем пустой объект для значений
                };
            }

            const pValue = Number(p.value.toFixed(0));
            // Добавляем значение по дате для текущего гипсокартона
            if (groupedData[gypsumBoardId].values[date] === null) {
                groupedData[gypsumBoardId].values[date] = pValue;
            } else {
                groupedData[gypsumBoardId].values[date] = (groupedData[gypsumBoardId].values[date] ?? 0) + pValue;
            }
        });

        return Object.values(groupedData);
    };


    const formatGroupedData = (groupedPlans: any[], groupedProductions: any[]) => {
        const formattedData: any[] = [];

        groupedPlans.forEach((plan) => {
            const production = groupedProductions.find(
                (prod) => prod.gypsumBoard.id === plan.gypsumBoard.id
            );

            formattedData.push(
                {
                    gypsumBoard: plan.gypsumBoard,
                    planValue: plan.values,
                    factValue: production ? production.values : {},
                }
            );
        });

        return formattedData;
    };

    // Сумма фактических значений по строке
    const calculateFactTotal = (factValues: { [date: string]: number | null }): number => {
        return Object.values(factValues).reduce((total: number, factValue: number | null) => {
            return total + (factValue ?? 0);
        }, 0);
    };

    // Сумма отклонений по строке
    const calculateDeviationTotal = (
        planValues: { [date: string]: number | null },
        factValues: { [date: string]: number | null }
    ): number => {
        const dates = Object.keys({ ...planValues, ...factValues });
        return dates.reduce((total, date) => {
            const plan = planValues[date] ?? 0;
            const fact = factValues[date] ?? 0;
            return total + (fact - plan);
        }, 0);
    };



    const headers = generateHeaders(planList, productions);
    const groupedPlans = groupByGypsumBoard(planList);
    const columnTotals = calculateColumnTotals(groupedPlans, headers);
    const groupedProd = groupedProductions(productions);
    const formattedData = formatGroupedData(groupedPlans, groupedProd);
    const factTotals = calculateColumnTotals(groupedProd, headers);
    const deviationTotals = (): { [date: string]: number } => {
        const totals: { [date: string]: number } = {};
        headers.forEach((date: string) => {
            totals[date] = (factTotals[date] ?? 0) - (columnTotals[date] ?? 0);
        });
        return totals;
    };
    if (!formattedData.length) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                <ProgressSpinner />
            </div>
        );
    }

    return (

        <div className="card mt-2 mb-5" style={{ border: '1px', boxShadow: 'none' }}>

            {/* 🔹 Кнопка экспорта */}
            <div className="mb-3 flex justify-end">
                <Button
                    label="Сохранить в HTML"
                    icon="pi pi-download"
                    onClick={() => exportToHTML(headers, formattedData, columnTotals, factTotals, deviationTotals(), calculateRowTotal)}
                    className="p-button-sm p-button-outlined"
                />
            </div>

            <DataTable
                value={formattedData}
                scrollable
                scrollHeight="790px"
                showGridlines
                stripedRows={false} // Отключаем чередование строк, чтобы настроить вручную
                tableStyle={{ fontSize: 12 }}
                // className="custom-datatable"
                className="p-datatable-striped p-datatable-hover"
                dataKey="gupsumboard.id"
            >
                {/* Колонка с информацией о гипсокартоне */}
                <Column
                    header="Гипсокартон"
                    body={(rowData) => {
                        return (
                            <div style={{ color: '#374151', fontWeight: 'bold' }}>
                                {`${rowData.gypsumBoard.tradeMark.name} ${rowData.gypsumBoard.boardType.name}-${rowData.gypsumBoard.edge.name}
                    ${rowData.gypsumBoard.thickness.value}-${rowData.gypsumBoard.width.value}-${rowData.gypsumBoard.length.value}`}
                            </div>
                        )
                    }}
                    frozen
                    style={{ minWidth: '330px', }}
                    headerStyle={{ textAlign: 'left' }}
                />


                {/* Динамические колонки по датам */}
                {headers.map((date) => (
                    <Column
                        key={date}
                        header={date}
                        body={(rowData) => {
                            const plan = rowData.planValue[date];
                            const fact = rowData.factValue[date];
                            const deviation = fact !== undefined ? fact - (plan || 0) : null;

                            const deviationColor = !plan
                                ? 'green'
                                : plan < fact
                                    ? 'green'
                                    : 'red';

                            const factColor = !plan
                                ? '#28a745' // success
                                : plan < fact
                                    ? '#28a745'
                                    : '#dc3545'; // danger

                            return (
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '4px',
                                    padding: '4px',
                                    fontFamily: 'Segoe UI, sans-serif',
                                    fontSize: '12px'
                                }}>
                                    {plan !== undefined && (
                                        <div style={{
                                            color: '#007bff',
                                            fontWeight: 600
                                        }}>
                                            {plan.toLocaleString('ru-RU', { maximumFractionDigits: 0 })}
                                        </div>
                                    )}

                                    {fact !== undefined && (
                                        <div style={{
                                            color: factColor,
                                            fontWeight: 600
                                        }}>
                                           {fact.toLocaleString('ru-RU', { maximumFractionDigits: 0 })}
                                        </div>
                                    )}

                                    {deviation !== null && (
                                        <div style={{
                                            color: deviationColor,
                                            fontSize: '11px'
                                        }}>
                                            Δ: {deviation.toLocaleString('ru-RU', { maximumFractionDigits: 0 })}
                                        </div>
                                    )}
                                </div>
                            );
                        }}

                        footer={
                            <div className="text-center font-bold">

                                {columnTotals[date] ?? 0}
                            </div>

                        } // Итоги по столбцу
                    />
                ))}

                {/* Колонка с итогом по строке */}
                <Column
                    header="Итого план"
                    body={(rowData) => calculateRowTotal(rowData.planValue)} // Выводим сумму по строке
                    footer={Object.values(columnTotals).reduce((total, value) => total + value, 0)} // Итоговая сумма по всем столбцам
                    className="font-bold"

                    bodyStyle={{ fontWeight: 'bold' }} />
                {/* Колонка с итогом факт */}
                <Column
                    header="Итого факт"
                    body={(rowData) => calculateFactTotal(rowData.factValue)}
                    className="font-bold"
                    bodyStyle={{ fontWeight: 'bold' }}
                    footer={Object.values(factTotals).reduce((total, value) => total + value, 0)} // Итоговая сумма по всем столбцам
                />

                {/* Колонка с итогом отклонения */}
                <Column
                    header="Отклонение"
                    body={(rowData) => calculateDeviationTotal(rowData.planValue, rowData.factValue)}
                    className="font-bold"
                    bodyStyle={{ fontWeight: 'bold' }}
                    footer={Object.values(factTotals).reduce((total, value) => total + value, 0) - Object.values(columnTotals).reduce((total, value) => total + value, 0)} // Итоговая сумма по всем столбцам
                />
            </DataTable>

        </div>
    );
};

export default PlanDataTable;