import React from "react";
import MixCategoryProduction from "../../../../model/mix/prodution/MixCategoryProduction";
import { Col, Container } from "react-bootstrap";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { getUserRole } from "../../../../service/Api";
import MixProduction from "../../../../model/mix/prodution/MixProduction";

interface MixProductionsTableProps {
    productions: MixProduction[];

}

export const MixProductionsTable: React.FC<MixProductionsTableProps> = ({ productions }) => {

    const [tableData, setTableData] = React.useState<MixCategoryProduction[]>([]);

    const handleEdit = (rowData: MixCategoryProduction) => {
        console.log("Edit: ", rowData);
    };

    const handleDelete = (rowData: MixCategoryProduction) => {
        console.log("Delete: ", rowData);
    };


    React.useEffect(() => {
        const productions10 = productions.sort((a, b) => new Date(b.production.productionDate).getTime() - new Date(a.production.productionDate).getTime()).slice(-10);
        setTableData(productions10);
    }, [productions]);


    return (
        <Container>
            <Col className="col-12">
            <DataTable value={tableData} scrollable scrollHeight="400px" size="small" tableStyle={{ width: 800 }}>
                    <Column field="planDate" header="Дата" />
                    <Column
                        header="Наименование смеси"
                        body={(rowData: MixCategoryProduction) => `${rowData.production.mix.tradeMark.name} ${rowData.production.mix.dryMixType.name} ${rowData.production.mix.binder.name} ${rowData.production.mix.name}`}
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
export default MixProductionsTable;
