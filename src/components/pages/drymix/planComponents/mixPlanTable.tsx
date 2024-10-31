import React from "react";
import { FC } from "react";
import {  Col, Container } from "react-bootstrap";
import MixCategoryProduction from "../../../../model/mix/prodution/MixCategoryProduction";
import MixPlan from "../../../../model/mix/plan";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { getUserRole } from "../../../../service/Api";
import { Button } from "primereact/button";
import DryMix from "../../../../model/mix/DryMix";

interface MixPlanTableProps {
    planData: MixPlan[];
    planEditing: (plan: MixPlan | null) => void;
    planDelete: (plan: MixPlan) => void;
}

const MixPlanTable: FC<MixPlanTableProps> = ({planData, planEditing, planDelete}) => {
    const handleEdit = (rowData: MixPlan) => {
        console.log('Редактировать:', rowData);
        planEditing(rowData);
    };

    const handleDelete = (rowData: MixPlan) => {
        console.log('Удалить:', rowData);
        planDelete(rowData);
    };

    return (
        <Container fluid className="mb-2 ">
            <Col className="col-12">
                <DataTable value={planData} scrollable scrollHeight="400px" size="small" tableStyle={{ width: 800 }}>
                    <Column field="planDate" header="Дата" />
                    <Column //TODO: Заменить гипсокартон на сухие смеси
                        header="Наименование смеси"
                        body={(rowData: DryMix) => `${rowData.tradeMark.name} ${rowData.dryMixType.name} ${rowData.dryMixType.name}
                    ${rowData.binder.name} ${rowData.name}`}
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
                                    style={{ marginRight: '8px' }} // Отступ между кнопками
                                    disabled={
                                        getUserRole() === 'ADMIN' ? false : true}
                                />
                                {/* Кнопка удаления */}
                                <Button
                                    icon="pi pi-trash"
                                    className="p-button-rounded p-button-danger p-button-sm"
                                    onClick={() => handleDelete(rowData)}
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

export default MixPlanTable;