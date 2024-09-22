import { Card, Modal, Table } from "react-bootstrap";
import Delays from "../../../model/delays/Delays";
import React from "react";


interface DelaysProps {
    show: boolean;
    delays: Delays[];
    onHide: () => void;
    date: string;
}

interface TypesPercent {
    types: string;
    percent: number;
}



const DelaysModal: React.FC<DelaysProps> = ({ delays, show, onHide, date }) => {

    const deltaTime = (delay: Delays) => {
        return ((new Date(delay.endTime).getTime() - new Date(delay.startTime).getTime()) / (1000 * 60)).toFixed(0);
    }

    const typesAndPercent = () => {
        if (delays.length > 0) {
            const data: TypesPercent[] = [];
            const delaysDate = new Date(delays[0].delayDate);
            const month = delaysDate.getMonth();
            const year = delaysDate.getFullYear();
            const totalTime = (new Date(year, month, 1).getTime() - new Date(year, month + 1, 0).getTime()) / (1000 * 60);
            delays.forEach((d) => {
                const existingEntry = data.find((item) => item.types === d.delayType.name);
                if (!existingEntry) {
                    data.push({
                        types: d.delayType.name,
                        percent: Number(deltaTime(d))
                    })
                } else {
                    existingEntry.percent += Number(deltaTime(d));
                }
            })
            data.forEach((item) => item.percent = Number((item.percent * 100 / totalTime).toFixed(2)));
            return data;
        } else {
            return [];
        }
    }

    return (
        <Modal show={show} onHide={onHide} centered={true} close backdrop="static" size="xl">
            <Modal.Header closeButton className="custom-modal-header">
                Данные по простоям за {date}
            </Modal.Header>
            <Modal.Body>
                <Card >
                    <Card.Header>{typesAndPercent().map(item => {
                        return (`${item.types}${item.percent}% `)
                    })}</Card.Header>
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
                                        <td className="text-center">{item.delayType.name.substring(0, 1)}</td>
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