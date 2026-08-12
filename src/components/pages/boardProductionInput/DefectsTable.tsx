import { Button, Table } from "react-bootstrap";
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
        
       
        <Table striped bordered hover size="sm" responsive variant="light">
            <thead>
                <tr>   
                <th>Причины дефекта</th>                 
                    <th>Тип дефекта</th>                                       
                    <th>Количество </th>
                   <th>Редактировать</th>
                </tr>
            </thead>
            <tbody>
                {defects.length > 0 ? (
                    defects.map((entry) => (
                        <tr key={entry.id}>
                            <td>{entry.defects.defectReason.name}</td>
                            <td>{entry.defects.defectTypes.name}</td>                            
                            <td>{entry.value}</td>                        
                            <td>
                                <Button 
                                className="d-flex justify-content-center"
                                    variant="outline-primary"
                                    size="sm"                      
                                    onClick={() => handleEditDefects(entry)}                                >
                                    <TiEdit size={18} />
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
export default DefectsTable;
