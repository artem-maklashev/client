import React, { useEffect, useState } from "react";
import { Badge, Button, ButtonGroup, Table } from "react-bootstrap";
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
        <div className="table-responsive rounded-2">
            <Table hover align="center" className="mb-0 table-sm small align-middle border">
                <thead className="table-light text-secondary">
                    <tr>
                        <th className="py-2 px-3 fw-semibold">Период</th>
                        <th className="py-2 px-3 fw-semibold text-center">Длит.</th>
                        <th className="py-2 px-3 fw-semibold">Деталь</th>
                        <th className="py-2 px-3 fw-semibold">Оборудование / Причина</th>
                        <th className="py-2 px-3 fw-semibold">Участок</th>
                        <th className="py-2 px-3 fw-semibold text-end">Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {localDelays.length > 0 ? (
                        localDelays.map((entry) => {
                            const durationMinutes = Math.round(
                                (new Date(entry.endTime).getTime() - new Date(entry.startTime).getTime()) / (1000 * 60)
                            );

                            return (
                                <tr key={entry.id}>
                                    {/* Время начала и окончания в две компактные строки */}
                                    <td className="px-3">
                                        <div className="fw-semibold text-dark">
                                            {new Date(entry.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                        <div className="fw-semibold text-dark" >
                                            {new Date(entry.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </td>

                                    {/* Длительность в виде бейджа */}
                                    <td className="px-3 text-center">
                                        <Badge bg="light" className="text-dark border fw-medium px-2 py-1">
                                            {durationMinutes} мин
                                        </Badge>
                                    </td>

                                    {/* Деталь */}
                                    <td className="px-3 fw-medium text-dark">{entry.unitPart.name}</td>

                                    {/* Оборудование */}
                                    <td className="px-3 text-secondary">{entry.unitPart.unit.name}</td>

                                    {/* Участок */}
                                    <td className="px-3 text-secondary">{entry.unitPart.unit.productionArea.name}</td>

                                    {/* Кнопки действий */}
                                    <td className="px-3 text-end">
                                        <ButtonGroup size="sm">
                                            <Button
                                                variant="outline-primary"
                                                className="py-1 px-2"
                                                onClick={() => handleEditDelay(entry)}
                                                title="Редактировать"
                                            >
                                                <TiEdit size={16} />
                                            </Button>
                                            <Button
                                                variant="outline-danger"
                                                className="py-1 px-2"
                                                onClick={() => handleRemoveDelay(entry)}
                                                disabled={getUserRole() !== 'ADMIN'}
                                                title={getUserRole() !== 'ADMIN' ? 'Недостаточно прав для удаления' : 'Удалить'}
                                            >
                                                <TiTrash size={16} />
                                            </Button>
                                        </ButtonGroup>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={6} className="text-center py-4 text-muted">
                                Нет данных для отображения
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    );
};

export default DelaysTable;
