import { Card, Col, Modal, Table } from "react-bootstrap";
import Delays from "../../../model/delays/Delays";
import Plan from "../../../model/gypsumBoard/Plan";
import BoardProduction from "../../../model/production/BoardProduction";
import React from "react";
import GypsumBoard from "../../../model/gypsumBoard/GypsumBoard";

interface DelaysProps {
    show: boolean;
    delays: Delays[];
    onHide: () => void;
    date: string;
}



const DelaysModal: React.FC<DelaysProps> = ({ delays, show, onHide, date }) => {

    const deltaTime = (delay: Delays) => {
        return ((new Date(delay.endTime).getTime() - new Date(delay.startTime).getTime()) / (1000 * 60)).toFixed(0);
    }

    return (
        <Modal show={show} onHide={onHide} centered={true} close backdrop="static" size="xl">
            <Modal.Header closeButton className="custom-modal-header">
                Данные по простоям за {date}
            </Modal.Header>
            <Modal.Body>
            <Card >
                <Card.Body>
                  
                        <Table striped bordered hover responsive>
                            <thead className="table-dark">
                                <tr className="text-center">
                                    <th>Тип простоя</th>
                                    <th>Дата смены</th>
                                    <th>Время начала</th>
                                    <th>Время окончания</th>
                                    <th>Длительность</th>
                                    <th>Узел</th>
                                    <th>Деталь</th>
                                </tr>
                            </thead>
                            <tbody>
                                {delays.map((item, index) => (
                                    <tr key={index} 
                                    className={item.delayType.id === 1 ? 'table-success' : (item.delayType.id === 2 ? 'table-danger' : 'table-warning')}>
                                        <td className="text-center">{item.delayType.name.substring(0,1)}</td>
                                        <td className="text-center">{new Date(item.delayDate).toLocaleDateString()}</td>
                                        <td className="text-left">{new Date(item.startTime).toLocaleTimeString()}</td>
                                        <td className="text-center">{new Date(item.endTime).toLocaleTimeString()}</td>
                                        <td className="text-center">{deltaTime(item)}</td>
                                        <td className="text-center">{item.unitPart.unit.name}</td>
                                        <td className="text-center">{item.unitPart.name}</td>
                                    </tr>
                                ))}

                                <tr className="table-dark">
                                    <td colSpan={4}>Итого</td>
                                    <td className="text-center">{delays.reduce((sum, item) => sum + Number(deltaTime(item)), 0)}</td>
                                    <td colSpan={2}></td>
                                </tr>

                            </tbody>
                        </Table>
                    
                </Card.Body>
            </Card>
            </Modal.Body>
        </Modal>
    )


}
export default DelaysModal;