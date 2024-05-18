import { Button, Table } from "react-bootstrap";
import React from "react";
import BoardProduction from "../../../model/production/BoardProduction";
import { TiEdit } from "react-icons/ti";
import Delays from "../../../model/delays/Delays";
import Product from "../../../model/Product";
import GypsumBoard from "../../../model/gypsumBoard/GypsumBoard";

interface DelaysTableProps {
    delays: Delays[];
    handleEditDelay: (delay: Delays) => void;
}

const DelaysTable: React.FC<DelaysTableProps> = ({
    delays,
    handleEditDelay,
}) => {
    return (
        <div>
        <h3 className="text-center">
            Простои
        </h3>
        <Table striped bordered hover size="sm" responsive>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Время начала</th>
                    <th>Время окончания</th>
                    <th>Длительность </th>
                    <th>Смена</th>
                    <th>Деталь</th>
                    <th>Оборудование/Причина</th>
                    <th>Участок</th>
                </tr>
            </thead>
            <tbody>
                {delays.length > 0 ? (
                    delays.map((entry) => (
                        <tr key={entry.id}>
                            <td>{entry.id}</td>
                            <td>{new Date(entry.startTime).toUTCString()}</td>
                            <td>{new Date(entry.endTime).toUTCString()}</td>
                            <td>{(new Date(entry.endTime).getTime()- new Date(entry.startTime).getTime())/(1000*60)}</td>
                            <td>{entry.shift.name}</td>
                            {/* <td>
                                {(() => {
                                    const gypsumBoardInstance = new GypsumBoard(
                                        entry.product.id,
                                        entry.product.ptype,
                                        entry.product.tradeMark,
                                        entry.product.boardType,
                                        entry.product.edge,
                                        entry.product.thickness,
                                        entry.product.width,
                                        entry.product.length
                                    );
                                    return <>{gypsumBoardInstance.toString()}</>;
                                })()}
                            </td> */}
                            <td>{entry.unitPart.name}</td>
                            <td>{entry.unitPart.unit.name}</td>
                            <td>{entry.unitPart.unit.productionArea.name}</td>                            
                            <td>
                                <Button
                                    variant="secondary"
                                    style={{ right: 0 }}
                                    onClick={() => handleEditDelay(entry)}
                                >
                                    <TiEdit />
                                </Button>{" "}                                
                            </td>                            
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={8} className="text-center">Нет данных для отображения</td>
                    </tr>
                )}
            </tbody>
            </Table>
        </div>
    );
};
export default DelaysTable;
