import React, { FC, useEffect, useState } from "react";
import { Col, Container } from "react-bootstrap";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { getUserRole } from "../../../../service/Api";
import MixPlan from "../../../../model/mix/plan";

interface MixPlanTableProps {
    planData: MixPlan[];
    planEditing: (plan: MixPlan | null) => void;
    planDelete: (plan: MixPlan) => void;
}

const MixPlanTable: FC<MixPlanTableProps> = ({ planData, planEditing, planDelete }) => {

    const [tableData, setTableData] = useState<MixPlan[]>([]);
    const adminRoles = ['ADMIN', 'ADMIN_MIX'];

    useEffect(() => {
        setTableData(planData);
    }, [planData]);
    
    const handleEdit = (rowData: MixPlan) => {
        planEditing(rowData);
    };

    const handleDelete = (rowData: MixPlan) => {
        planDelete(rowData);
    };



    return (
        <Container fluid className="mb-2">
            <Col className="col-12">
            <div className="card"> {/* Added card container */}

                <DataTable value={tableData} scrollable scrollHeight="400px" size="small" tableStyle={{ width: '100%', fontSize: 14 }} className="p-datatable-sm"> 
                    <Column field="planDate" header="Дата" key="planDate" />
                    <Column
                        header="Наименование смеси"
                        key="mixName"
                        body={(rowData: MixPlan) =>
                            `${rowData.dryMix.tradeMark.name} ${rowData.dryMix.dryMixType.name} ${rowData.dryMix.binder.name} ${rowData.dryMix.name}`
                        }
                    />
                    <Column field="value" header="Количество" key="planValue" />

                    <Column
                        header="Действия"
                        key="actions"
                        body={(rowData) => (
                            <div className="d-flex justify-content-start">
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
                                    disabled={!adminRoles.includes(getUserRole())}
                                />
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
                                    disabled={!adminRoles.includes(getUserRole())}
                                />
                            </div>
                        )}
                    />
                </DataTable>
                </div>
            </Col>
        </Container>
    );
};

export default MixPlanTable;
