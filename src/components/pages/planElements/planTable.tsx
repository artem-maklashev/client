import React from "react";
import Plan from "../../../model/gypsumBoard/Plan";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import 'primereact/resources/themes/saga-blue/theme.css';  // Темы
import 'primereact/resources/primereact.min.css';          // Основные стили
import 'primeicons/primeicons.css';                         // Иконки
import { Col, Container } from "react-bootstrap";
import { getUserRole } from "../../../service/Api";



interface PlanTableProps {
    planList: Plan[];
    planEditing: (plan: Plan | null) => void;
    planDelete:(plan: Plan) => void;
}

const PlanTable: React.FC<PlanTableProps> = ({ planList, planEditing, planDelete }) => {
    const handleEdit = (rowData: Plan) => {
        console.log('Редактировать:', rowData);
        planEditing(rowData);
    };

    const handleDelete = (rowData: Plan) => {
        console.log('Удалить:', rowData);
        planDelete(rowData);
    };

    return (
        <Container fluid className="mb-2 ">
            <Col className="col-12">
                <DataTable value={planList} scrollable scrollHeight="400px" size="small" tableStyle={{ width: 800, fontSize: 13 }}>
                    <Column field="planDate" header="Дата" />
                    <Column
                        header="Гипсокартон"
                        body={(rowData) => `${rowData.gypsumBoard.tradeMark.name} ${rowData.gypsumBoard.boardType.name}-${rowData.gypsumBoard.edge.name}
                    ${rowData.gypsumBoard.thickness.value}-${rowData.gypsumBoard.width.value}-${rowData.gypsumBoard.length.value}`}
                    />
                    <Column field="planValue" header="Количество" />

                    {/* Колонка с кнопками для редактирования и удаления */}
                    <Column
                        header="Действия"
                        body={(rowData) => (
                            <div>
                                {/* Кнопка редактирования */}
                                <Button
                                    icon="pi pi-pencil"
                                    className="p-button-rounded p-button-info p-button-sm"
                                    onClick={() => handleEdit(rowData)}
                                    style={{ marginRight: '8px',// Отступ между кнопкамиa
                                        width: '35px', // Ширина кнопки
                                        height: '35px', // Высота кнопки
                                        fontSize: '1.2rem', // Размер текста/иконки
                                        borderRadius: '25px'  
                                        }} 
                                    disabled={
                                        getUserRole() === 'ADMIN' ? false : true}
                                />
                                {/* Кнопка удаления */}
                                <Button
                                    icon="pi pi-trash"
                                    className="p-button-rounded p-button-danger p-button-sm"
                                    onClick={() => handleDelete(rowData)}
                                    style={{ marginRight: '8px',// Отступ между кнопкамиa
                                        width: '35px', // Ширина кнопки
                                        height: '35px', // Высота кнопки
                                        fontSize: '1.2rem', // Размер текста/иконки
                                        borderRadius: '25px'  
                                        }} 
                                    disabled={
                                        getUserRole() === 'ADMIN' ? false : true}
                                />
                            </div>
                        )}
                    />
                </DataTable>
            </Col>
        </Container>
    );
};
export default PlanTable;