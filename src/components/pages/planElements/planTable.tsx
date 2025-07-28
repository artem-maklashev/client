import React from "react";
import Plan from "../../../model/gypsumBoard/Plan";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import 'primereact/resources/themes/saga-blue/theme.css';  // Темы
import 'primereact/resources/primereact.min.css';          // Основные стили
import 'primeicons/primeicons.css';                         // Иконки
import { Col, Container, Row } from "react-bootstrap";
import { getUserRole } from "../../../service/Api";
import { ProgressSpinner } from "primereact/progressspinner";



interface PlanTableProps {
    planList: Plan[];
    planEditing: (plan: Plan | null) => void;
    planDelete: (plan: Plan) => void;
    onAddPlan?: () => void;
}

const PlanTable: React.FC<PlanTableProps> = ({ planList, planEditing, planDelete, onAddPlan }) => {

    const userRole = ['ADMIN', 'GB_ADMIN'];

    const handleEdit = (rowData: Plan) => {
        console.log('Редактировать:', rowData);
        planEditing(rowData);
    };

    const handleDelete = (rowData: Plan) => {
        console.log('Удалить:', rowData);
        planDelete(rowData);
    };

    const handleAdd = () => {
        console.log('Добавить новый план');
        if (onAddPlan) {
            onAddPlan(); // Вызываем функцию из родительского компонента
        }
    };

    // Добавляем вычисляемое поле для фильтрации
    const processedPlanList = planList.map(item => ({
        ...item,
        gypsumBoardSearchText: `${item.gypsumBoard.tradeMark.name} ${item.gypsumBoard.boardType.name} ${item.gypsumBoard.edge.name} ${item.gypsumBoard.thickness.value}×${item.gypsumBoard.width.value}×${item.gypsumBoard.length.value}`
    })).sort((a, b) => new Date(b.planDate).getTime() - new Date(a.planDate).getTime());

    if (processedPlanList.length === 0) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                <ProgressSpinner />
            </div>
        );
    }


    return (
        <Container fluid className="mb-3">
            <Row>
                <Col className="col-12">
                    <div className="card shadow-sm rounded-3 border-1">
                        <div className="card-header bg-white border-0 py-1">
                            <div className="d-flex justify-content-between align-items-center ">
                                <h5 className="mb-0 text-dark">План производства</h5>
                                <Button
                                    label="Добавить"
                                    icon="pi pi-plus"
                                    className="p-button-rounded p-button-info2 p-button-sm "
                                    onClick={handleAdd}
                                    disabled={!userRole.includes(getUserRole())}
                                />
                            </div>
                        </div>

                        <div className="card-body p-0">
                            <DataTable
                                value={processedPlanList}
                                scrollable
                                scrollHeight="370px"
                                size="normal"
                                paginator
                                rows={5}
                                rowsPerPageOptions={[5, 10, 20, 50]}
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                currentPageReportTemplate="Показано {first} - {last} из {totalRecords}"
                                emptyMessage="Нет данных для отображения"
                                // tableStyle={{ width: '100%', minWidth: '800px' }}
                                className="p-datatable-striped p-datatable-hover compact-paginator"
                                responsiveLayout="scroll"
                            >
                                {/* Дата с сортировкой */}
                                <Column
                                    field="planDate"
                                    header="Дата"
                                    sortable
                                    style={{ width: '120px' }}
                                    body={(rowData) => new Date(rowData.planDate).toLocaleDateString('ru-RU')}
                                />

                                {/* Гипсокартон с фильтрацией */}
                                <Column
                                    field="gypsumBoardSearchText" // Используем вычисляемое поле
                                    header="Гипсокартон"
                                    sortable
                                    // style={{ minWidth: '250px' }}
                                    body={(rowData) => (
                                        <div>
                                            <div className="font-weight-bold">
                                                {rowData.gypsumBoard.tradeMark.name} {rowData.gypsumBoard.boardType.name}
                                            </div>
                                            <div className="text-muted small">
                                                {rowData.gypsumBoard.edge.name} {rowData.gypsumBoard.thickness.value}×
                                                {rowData.gypsumBoard.width.value}×{rowData.gypsumBoard.length.value}
                                            </div>
                                        </div>
                                    )}
                                    filter
                                    filterPlaceholder="Поиск по типу..."
                                />

                                {/* Количество с выравниванием по правому краю */}
                                <Column
                                    field="planValue"
                                    header="Количество (м²)"
                                    sortable
                                    style={{ width: '120px', textAlign: 'right' }}
                                    body={(rowData) => (
                                        <span className="font-weight-medium">
                                            {rowData.planValue?.toLocaleString('ru-RU')}
                                        </span>
                                    )}
                                />

                                {/* Действия с улучшенным стилем */}
                                <Column
                                    header="Действия"
                                    style={{ width: '120px', textAlign: 'center' }}
                                    body={(rowData) => (
                                        <div className="d-flex justify-content-center gap-2">
                                            <Button
                                                icon="pi pi-pencil"
                                                className="p-button-rounded p-button-info p-button-sm"
                                                onClick={() => handleEdit(rowData)}
                                                tooltip="Редактировать"
                                                tooltipOptions={{ position: 'top' }}
                                                disabled={!userRole.includes(getUserRole())}
                                            />
                                            <Button
                                                icon="pi pi-trash"
                                                className="p-button-rounded p-button-danger p-button-sm"
                                                onClick={() => handleDelete(rowData)}
                                                tooltip="Удалить"
                                                tooltipOptions={{ position: 'top' }}
                                                disabled={!userRole.includes(getUserRole())}
                                            />
                                        </div>
                                    )}
                                />
                            </DataTable>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};
export default PlanTable;