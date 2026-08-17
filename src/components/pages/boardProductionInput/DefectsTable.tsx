import { Badge, Button, Table } from "react-bootstrap";
import React from "react";
import { TiEdit } from "react-icons/ti";
import BoardDefectsLog from "../../../model/defects/BoardDefectsLog";

interface DefectsTableProps {
    defects: BoardDefectsLog[] | undefined;
    handleEditDefects: (delay: BoardDefectsLog) => void;
}

const DefectsTable: React.FC<DefectsTableProps> = ({
    defects = [],
    handleEditDefects,
}) => {
    return (
        <div>
            <div className="table-responsive rounded-2">
                <Table hover align="center" className="mb-0 table-sm small align-middle border ">
                    <thead className="table-light text-light">
                        <tr>
                            <th className="py-2 px-3 fw-semibold">Причина</th>
                            <th className="py-2 px-3 fw-semibold">Тип дефекта</th>
                            <th className="py-2 px-3 fw-semibold text-end">м²</th>
                            <th className="py-2 px-3 fw-semibold text-end">Действия</th>
                        </tr>
                    </thead>                    
                    <tbody>
                        {defects.length > 0 ? (
                            defects.map((entry) => (
                                <tr key={entry.id}>
                                    {/* Причина дефекта в виде бейджа */}
                                    <td className="px-3">
                                        <Badge bg="light" className="text-secondary border fw-normal py-1 px-2">
                                            {entry.defects.defectReason.name}
                                        </Badge>
                                    </td>

                                    {/* Описание дефекта с ограничением ширины и тултипом по hover */}
                                    <td
                                        className="px-3 text-dark"
                                        style={{ maxWidth: '260px' }}
                                        title={entry.defects.defectTypes.name}
                                    >
                                        <div className="text-truncate">{entry.defects.defectTypes.name}</div>
                                    </td>

                                    {/* Количество с выравниванием по правому краю */}
                                    <td className="px-3 text-end fw-bold text-dark">{entry.value}</td>

                                    {/* Кнопка действия */}
                                    <td className="px-3 text-end">
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            className="py-1 px-2 rounded-2"
                                            onClick={() => handleEditDefects(entry)}
                                            title="Редактировать"
                                        >
                                            <TiEdit size={16} />
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="text-center py-4 text-muted">
                                    Нет данных для отображения
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
        </div>
    );
};
export default DefectsTable;
