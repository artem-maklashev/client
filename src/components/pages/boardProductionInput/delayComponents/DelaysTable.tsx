import React, { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { TiEdit, TiTrash } from "react-icons/ti";
import Delays from "../../../../model/delays/Delays";
import { getUserRole } from "../../../../service/Api";

interface DelaysTableProps {
    delays: Delays[];
    handleEditDelay: (delay: Delays) => void;
    handleRemoveDelay: (removingDelay: Delays) => void;
}

const DelaysTable: React.FC<DelaysTableProps> = ({delays, handleEditDelay, handleRemoveDelay}) => {
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
            <h3 className="text-center">Простои</h3>
            <Table striped bordered hover size="sm" responsive variant="dark">
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
                                    <Button
                                        variant="secondary"
                                        
                                        onClick={() => handleEditDelay(entry)}
                                    >
                                        <TiEdit />
                                    </Button>{" "}
                                    <Button
                                        variant="secondary"
                                        onClick={() => handleRemoveDelay(entry)}
                                        style={{ color: "red" }}
                                        disabled={getUserRole() === 'ADMIN' ? false : true}
                                    >
                                        <TiTrash />
                                    </Button>
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
