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
    productionDelays: (delays: MixDelay[]) => void;
};

const MixDelayTable: React.FC<MixDelayTableProps> = ({ mixProduction, productionDelays }) => {

    const [delays, setDelays] = useState<MixDelay[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [delay, setDelay] = useState<MixDelay | null>(null);
    const [delayType, setDelayType] = useState<DelayType | null>(null);

    useEffect(() => {
        const fetchDelays = async () => {
            if (mixProduction) {
                const result = await MixApiService.getDelaysByProduction(mixProduction);
                if (result) setDelays(result);
            }
        }
        fetchDelays();
    }, [mixProduction]);

    React.useEffect(() => {
        if (delays) {
            console.log("Обновлен список простоев:", delays);
            productionDelays(delays);
        }
    }, [delays, productionDelays]);
    

    const handleDelete = (delay: MixDelay) => {
        setDelays((prevDelays) => {
            const updatedDelays = prevDelays.filter((d) => d.id !== delay.id);
            console.log("После удаления:", updatedDelays); // Отладка
            return updatedDelays;
        });
    };
    
    

    const handleEdit = (delay: MixDelay) => {
        console.log(delay);
        setDelay(delay);
        setShowModal(true);
    }

    const setId = () => {
        if (delays.length > 0) {
            const minId = Math.min(...delays.map(d => d.id));
            return minId <= 0 ? minId - 1 : -1;
        }
        return -1;
    }

    const handleSaveDelay = (delay: MixDelay) => {
        setShowModal(false);
        console.log("Новый простой:", delay);
        // Если `delay.id` отсутствует, назначаем новый уникальный ID
        if (!delay.id) {
            delay.id = setId();
            // Добавляем новый объект в массив задержек
            setDelays((prevDelays) => [...prevDelays, delay]);
        } else {
            // Обновляем существующий объект в массиве задержек
            setDelays((prevDelays) => prevDelays.map((d) => (d.id === delay.id ? delay : d)));
        }

        // Очищаем текущую задержку
        setDelay(null);
    };

    const timeOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit', // Убираем секунды
    };

    return (
        <Container>
            <Row>
                <DataTable value={delays} size="small" tableStyle={{ fontSize: 13 }} showGridlines>
                    <Column field="delayStart" header="Начало простоя" body={(rowData) => new Date(rowData.delayStart).toLocaleString('ru-RU', timeOptions)} />
                    <Column field="delayEnd" header="Конец простоя" body={(rowData) => new Date(rowData.delayEnd).toLocaleString('ru-RU', timeOptions)} />
                    <Column header="Минут" body={(rowData) => (new Date(rowData.delayEnd).getTime() - new Date(rowData.delayStart).getTime()) / 1000 / 60} />
                    <Column header="Деталь" body={(rowData) => rowData.mixUnitPart.name} />
                    <Column header="Оборудование/причина" body={(rowData: MixDelay) => rowData.mixUnitPart.unit.name} />
                    <Column header="Участок" body={(rowData: MixDelay) => rowData.mixUnitPart.unit.productionArea.name} />
                    <Column
                        header="Действия"
                        key="actions"
                        body={(rowData) => (
                            <div
                                style={{
                                    display: 'flex', // Устанавливаем кнопки в строку
                                    alignItems: 'center', // Выравниваем кнопки по вертикали
                                    justifyContent: 'center', // Центрируем кнопки (если нужно)
                                    gap: '8px', // Отступы между кнопками
                                }}
                            >
                                <Button
                                    icon="pi pi-pencil"
                                    className="p-button-rounded p-button-info p-button-sm"
                                    onClick={() => handleEdit(rowData)}
                                    style={{
                                        width: '30px',
                                        height: '30px',
                                        fontSize: '0.8rem',
                                        borderRadius: '50%',
                                    }}
                                    disabled={getUserRole() !== "ADMIN"}
                                />
                                <Button
                                    icon="pi pi-trash"
                                    className="p-button-rounded p-button-danger p-button-sm"
                                    onClick={() => handleDelete(rowData)}
                                    style={{
                                        width: '30px',
                                        height: '30px',
                                        fontSize: '0.8rem',
                                        borderRadius: '50%',
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
                onSave={handleSaveDelay} />
        </Container>
    );

}
export default MixDelayTable;