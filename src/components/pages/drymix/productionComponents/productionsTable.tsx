import React from "react";
import { Col, Container } from "react-bootstrap";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { getUserRole } from "../../../../service/Api";
import MixProduction from "../../../../model/mix/prodution/MixProduction";
import "primereact/resources/themes/lara-light-indigo/theme.css";


interface MixProductionsTableProps {
    productions: MixProduction[];
    onEdit: (rowData: MixProduction) => void;
    onDelete: (rowData: MixProduction) => void;
}

export const MixProductionsTable: React.FC<MixProductionsTableProps> = ({ productions, onEdit, onDelete }) => {

    const [tableData, setTableData] = React.useState<MixProduction[]>([]);
    const editRoles = ['ADMIN', 'MIX_ADMIN', 'MIX_USER'];
    const deleteRoles = ['ADMIN', 'MIX_ADMIN'];

    const handleEdit = (rowData: MixProduction) => {
        console.log("Edit: ", rowData);
        onEdit(rowData);

    };

    const handleDelete = (rowData: MixProduction) => {
        console.log("Delete: ", rowData);
        onDelete(rowData);
    };


    React.useEffect(() => {
        const productions10 = productions.sort((a, b) => new Date(b.productionDate).getTime() - new Date(a.productionDate).getTime()).slice(-10);
        setTableData(productions10);
    }, [productions]);


    return (
        <Container>
            <Col className="col-12">
                <div className="card">
                    <DataTable value={tableData} scrollable scrollHeight="400px" size="small" tableStyle={{ width: 800, border: 'true', fontSize: 13 }}>
                        <Column field="productionDate" header="Дата" body={(rowData) => new Date(rowData.productionDate).toLocaleDateString('ru-RU')} />
                        <Column
                            header="Наименование смеси"
                            body={(rowData: MixProduction) => `${rowData.mix.tradeMark.name} ${rowData.mix.dryMixType.name} ${rowData.mix.binder.name} ${rowData.mix.name}`}
                        />
                        <Column field="shift.name" header="Смена" />

                        {/* Колонка с кнопками для редактирования и удаления */}
                        <Column
                            header="Действия"
                            body={(rowData) => (
                                <div className="d-flex justify-content-start">
                                    {/* Кнопка редактирования */}
                                    <Button
                                        icon="pi pi-pencil"
                                        className="p-button-rounded p-button-info p-button-sm"
                                        onClick={() => handleEdit(rowData)}
                                        style={{
                                            marginRight: '8px',// Отступ между кнопкамиa
                                            width: '35px', // Ширина кнопки
                                            height: '35px', // Высота кнопки
                                            fontSize: '1.2rem', // Размер текста/иконки
                                            borderRadius: '25px'
                                        }}
                                        size="small"
                                        disabled={editRoles.includes(getUserRole()) ? false : true}
                                    />
                                    {/* Кнопка удаления */}
                                    <Button
                                        icon="pi pi-trash"
                                        className="p-button-rounded p-button-danger p-button-sm"
                                        onClick={() => handleDelete(rowData)}
                                        style={{
                                            marginRight: '8px',// Отступ между кнопкамиa
                                            width: '35px', // Ширина кнопки
                                            height: '35px', // Высота кнопки
                                            fontSize: '1.2rem', // Размер текста/иконки
                                            borderRadius: '25px'
                                        }}

                                        disabled={deleteRoles.includes(getUserRole()) ? false : true}
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
export default MixProductionsTable;
