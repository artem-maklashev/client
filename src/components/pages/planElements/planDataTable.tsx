import React from "react";
import Plan from "../../../model/gypsumBoard/Plan";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import GypsumBoard from "../../../model/gypsumBoard/GypsumBoard";
import 'primereact/resources/themes/nano/theme.css';
import BoardProduction from "../../../model/production/BoardProduction";

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
    const generateHeaders = (planData: Plan[]) => {
        const headersData: string[] = [];
        planData.forEach((plan) => {
            const dateString = new Date(plan.planDate).toLocaleDateString();
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
    const calculateRowTotal = (values: { [date: string]: number | null }): number => {
        return Object.values(values).reduce((total: number, value: number | null) => {
            return total + (value ?? 0); // Если значение null, то прибавляем 0
        }, 0);
    };

    // Расчёт итога для каждого столбца (для каждой даты)
    const calculateColumnTotals = (groupedPlans: GypsumBoardPlan[], headers: string[]): { [date: string]: number } => {
        const columnTotals: { [date: string]: number } = {};

        headers.forEach((date) => {
            let totalForDate = 0;
            groupedPlans.forEach((plan) => {
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
                    type: 'План',
                    values: plan.values,
                },
                {
                    gypsumBoard: plan.gypsumBoard,
                    type: 'Факт',
                    values: production ? production.values : {}, // Если нет данных по факту, оставляем пустой объект
                }
            );
        });

        return formattedData;
    };



    const headers = generateHeaders(planList);
    const groupedPlans = groupByGypsumBoard(planList);
    const columnTotals = calculateColumnTotals(groupedPlans, headers);
    const groupedProd = groupedProductions(productions);
    const formattedData = formatGroupedData(groupedPlans, groupedProd);


    return (
        <div className="card mt-2">
            <DataTable
                value={formattedData}
                scrollable
                scrollHeight="600px"
                showGridlines
                stripedRows={false} // Отключаем чередование строк, чтобы настроить вручную
                tableStyle={{ fontSize: 14 }}
                className="custom-datatable"
                dataKey="gupsumboard.id"
            >
                {/* Колонка с информацией о гипсокартоне */}
                <Column
                    header="Гипсокартон"
                    body={(rowData) => {
                        // Условие для отображения разных стилей для План и Факт
                        if (rowData.type === 'План') {
                            return (
                                <div style={{ color: 'blue', fontWeight: 'bold' }}>
                                    {`${rowData.gypsumBoard.tradeMark.name} ${rowData.gypsumBoard.boardType.name}-${rowData.gypsumBoard.edge.name}
                    ${rowData.gypsumBoard.thickness.value}-${rowData.gypsumBoard.width.value}-${rowData.gypsumBoard.length.value}`}
                                </div>
                            );
                        } else {
                            return (
                                <div style={{ color: 'green', fontStyle: 'italic', textAlign: 'right' }}>
                                    Факт
                                </div>
                            );
                        }
                    }}
                    style={{ minWidth: '330px' }}
                    headerStyle={{ textAlign: 'left' }}
                />


                {/* Динамические колонки по датам */}
                {headers.map((date) => (
                    <Column
                        key={date}
                        header={date}
                        body={(rowData) => (
                            <div style={{ textAlign: 'center' }}>
                                {rowData.type === 'План' && (
                                    <div style={{ color: 'blue', fontWeight: 'bold' }}>
                                        {rowData.values[date] ?? ''}
                                    </div>
                                )}
                                {rowData.type === 'Факт' && (
                                    <div style={{ color: 'green', fontSize: '10px' }}>
                                        {rowData.values[date] ?? ''}
                                    </div>
                                )}
                            </div>
                        )}
                        footer={columnTotals[date] ?? 0} // Итоги по столбцу
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

        </div>
    );
};

export default PlanDataTable;