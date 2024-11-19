import React from "react";
import Plan from "../../../model/gypsumBoard/Plan";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import GypsumBoard from "../../../model/gypsumBoard/GypsumBoard";
import 'primereact/resources/themes/nano/theme.css';
import { Container } from "react-bootstrap";

interface PlanTableProps {
    planList: Plan[];
}

// Структура данных для группировки по гипсокартону
interface GypsumBoardPlan {
    gypsumBoard: GypsumBoard;
    values: { [date: string]: number | null };
}

const PlanDataTable: React.FC<PlanTableProps> = ({ planList }) => {

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

    const headers = generateHeaders(planList);
    const groupedPlans = groupByGypsumBoard(planList);
    const columnTotals = calculateColumnTotals(groupedPlans, headers);
    return (
        <Container className="mb-3 mt-3">
            <DataTable value={groupedPlans} scrollable scrollHeight="600px" showGridlines stripedRows tableStyle={{fontSize: 13}}>
                {/* Колонка с информацией о гипсокартоне */}
                <Column
                    header="Gypsum Board"
                    body={(rowData) => `${rowData.gypsumBoard.tradeMark.name} ${rowData.gypsumBoard.boardType.name}-${rowData.gypsumBoard.edge.name}
                    ${rowData.gypsumBoard.thickness.value}-${rowData.gypsumBoard.width.value}-${rowData.gypsumBoard.length.value}`}
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

export default PlanDataTable;