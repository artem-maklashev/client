import React, { useEffect, useState } from "react";
import { Button, ButtonGroup, Table } from "react-bootstrap";
import { TiEdit, TiTrash } from "react-icons/ti";
import Delays from "../../../../model/delays/Delays";
import { getUserRole } from "../../../../service/Api";

interface DelaysTableProps {
    delays: Delays[];
    handleEditDelay: (delay: Delays) => void;
    handleRemoveDelay: (removingDelay: Delays) => void;
}

const DelaysTable: React.FC<DelaysTableProps> = ({ delays, handleEditDelay, handleRemoveDelay }) => {
    const [localDelays, setLocalDelays] = useState<Delays[]>([]);

    useEffect(() => {
        setLocalDelays(delays);
    }, [delays]);

    // const handleClickDelete = (evt: React.MouseEvent<HTMLElement>, item: Delays) => {
    //     const updatedDelays = localDelays.filter((delay) => delay.id !== item.id);
    //     setLocalDelays(updatedDelays);
    //     handleRemoveDelay(updatedDelays);
    //     };

    return (
        <div>

            <Table striped bordered hover size="sm" responsive variant="light">
                <thead>
                    <tr>
                        <th>Время начала</th>
                        <th>Время окончания</th>
                        <th>Длительность</th>
                        <th>Деталь</th>
                        <th>Оборудование/Причина</th>
                        <th>Участок</th>
                        <th>Редактировать</th>
                    </tr>
                </thead>
                <tbody>
                    {localDelays.length > 0 ? (
                        localDelays.map((entry) => (
                            <tr key={entry.id}>
                                <td>{new Date(entry.startTime).toLocaleString()}</td>
                                <td>{new Date(entry.endTime).toLocaleString()}</td>
                                <td>{(new Date(entry.endTime).getTime() - new Date(entry.startTime).getTime()) / (1000 * 60)}</td>
                                <td>{entry.unitPart.name}</td>
                                <td>{entry.unitPart.unit.name}</td>
                                <td>{entry.unitPart.unit.productionArea.name}</td>
                                <td>
                                    <ButtonGroup size="sm" className="d-flex justify-content-center">
                                        <Button
                                            variant="outline-primary"
                                            onClick={() => handleEditDelay(entry)}
                                            title="Редактировать"
                                        >
                                            <TiEdit size={18} />
                                        </Button>
                                        
                                        <Button
                                            variant="outline-danger"
                                            onClick={() => handleRemoveDelay(entry)}
                                            disabled={getUserRole() !== 'ADMIN'}
                                            title="Удалить"
                                        >
                                            <TiTrash size={18} />
                                        </Button>
                                    </ButtonGroup>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={7} className="text-center">Нет данных для отображения</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    );
};

export default DelaysTable;
