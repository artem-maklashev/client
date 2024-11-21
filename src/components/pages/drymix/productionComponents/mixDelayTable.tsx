import React, { useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
import MixProduction from "../../../../model/mix/prodution/MixProduction";
import MixDelay from "../../../../model/mix/delays/MixDelay";
import MixApiService from "../../../../service/MixApiService";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { getUserRole } from "../../../../service/Api";
import DelayModal from "./delayModal";
import DelayType from "../../../../model/delays/DelayType";

interface MixDelayTableProps {
    mixProduction: MixProduction | null;
};

const MixDelayTable: React.FC<MixDelayTableProps> = ({ mixProduction }) => {

    const [delays, setDelays] = useState<MixDelay[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [delay, setDelay] = useState<MixDelay | null>(null);
    const [delayType, setDelayType] = useState<DelayType | null>(null);

    useEffect(() => {
        const fetchDelays = async () => {
            if (mixProduction) {
                const result = await MixApiService.getDelaysByProduction(mixProduction);
                setDelays(result);
            }
        }
        fetchDelays();
    }, [mixProduction]);

    const handleDelete = async (delay: MixDelay) => {
        let result = [];
        if (mixProduction) {
            result = await MixApiService.deleteDelay(delay);
        } else {
            result = delays.filter(d => d.id !== delay.id);
        }
        setDelays(result);
    }

    const handleEdit = (delay: MixDelay) => {
        console.log(delay);
    }


    return (
        <Container>
            <Row>
                <DataTable value={delays} size="small" tableStyle={{ fontSize: 13 }} showGridlines>
                    <Column field="delayStart" header="Начало простоя" body={(rowData) => new Date(rowData.delayStart).toLocaleString('ru-RU')} />
                    <Column field="delayEnd" header="Конец простоя" body={(rowData) => new Date(rowData.delayEnd).toLocaleString('ru-RU')} />
                    <Column header="Длительность" body={(rowData) => (new Date(rowData.delayEnd).getTime() - new Date(rowData.delayStart).getTime()) / 1000 / 60 / 60} />
                    <Column header="Деталь" body={(rowData) => rowData.mixUnitPart.name} />
                    <Column header="Оборудование/причина" body={(rowData: MixDelay) => rowData.mixUnitPart.unit.name} />
                    <Column header="Участок" body={(rowData: MixDelay) => rowData.mixUnitPart.unit.productionArea.name} />
                    <Column
                        header="Действия"
                        key="actions"
                        body={(rowData) => (
                            <div>
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
                                    disabled={getUserRole() !== "ADMIN"}
                                />
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
                                    disabled={getUserRole() !== "ADMIN"}
                                />
                            </div>
                        )}
                    />
                </DataTable>
            </Row>
            <Row className="text-center">
                <div className="p-d-flex p-jc-end">
                    <Button
                        label="Добавить"
                        icon="pi pi-plus"
                        size="small"
                        className="p-button-rounded p-button-info"
                        raised
                        tooltip="Добавить простой"
                        tooltipOptions={{ position: 'top' }}
                        style={{
                            width: 'auto', // Ширина кнопки
                            height: '35px', // Высота кнопки
                            fontSize: '0.9rem', // Размер текста/иконки
                            borderRadius: '5px'
                        }}
                        onClick={() => { setDelay(null); setShowModal(true); }}
                    />
                </div>


            </Row>
            <DelayModal show={showModal} delay={delay}
                onHide={() => {
                    setDelay(null);
                    setShowModal(false);
                    setDelayType(null);
                }
                }
                onSave={function (updatedDelay: MixDelay): void {
                    throw new Error("Function not implemented.");
                }} />
        </Container>
    );

}
export default MixDelayTable;