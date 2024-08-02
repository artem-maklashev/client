import BoardDefectsLog from "../../../model/defects/BoardDefectsLog";
import DefectsDataPrepare from "./DefectsDataPrepare";
import {Col, Table} from "react-bootstrap";
import React from "react";
import BoardProduction from "../../../model/production/BoardProduction";


interface DefectsTableProps {
    defectsLog: BoardDefectsLog[];
    data: BoardProduction[];
}

const DefectsTable: React.FC<DefectsTableProps> = ({defectsLog, data}) => {
    if (data.length === 0) {
        return <div>Данных нет</div>;
    }

    const preparedDefects = new DefectsDataPrepare(defectsLog, data);
    const summaryDefects = preparedDefects.getSummary();
    console.log(defectsLog.length);


    const mainTable = (

            <Table striped bordered hover variant="light">
                <thead className="table-dark ">
                <tr>
                    <th className="text-center">Виды брака категории А</th>
                    <th colSpan={2} className="text-center">Количество</th>
                </tr>
                </thead>
                <tbody>
                {Object.entries(summaryDefects).map(([defectType, count], index) => (
                    <tr key={defectType}>
                        <td className="col-6">{defectType}</td>
                        <td className="col-1 text-center" >{count.toFixed(0)}</td>
                        <td className="col-3">
                            <div className="progress ">
                                <div className="progress-bar "
                                     style={{width: `${(count / summaryDefects[Object.keys(summaryDefects)[0]]) * 100}%`}}>
                                </div>
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
                <tbody className="table-dark">
                <tr>
                    <td>Итого:</td>
                    <td colSpan={2} className="text-center">
                        <strong>{(Object.values(summaryDefects).reduce((acc, value) => acc + value, 0)).toFixed(2)} м²</strong>
                    </td>
                </tr>
                </tbody>
            </Table>

    );

    return <div>{mainTable}</div>;

};
export default DefectsTable;
