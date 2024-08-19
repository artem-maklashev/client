import { Card, Modal, Table } from "react-bootstrap";
import Delays from "../../../model/delays/Delays";
import Plan from "../../../model/gypsumBoard/Plan";
import BoardProduction from "../../../model/production/BoardProduction";
import React from "react";
import GypsumBoard from "../../../model/gypsumBoard/GypsumBoard";

interface PlanFactModalProps {
    show: boolean;
    plan: Plan[];
    fact: BoardProduction[];
    delays: Delays[];
    onHide: () => void;
    date: string;
}

interface CombinedData {
    id: number;
    name: string;
    plan: number;
    fact: number;
}

const PlanFactModal: React.FC<PlanFactModalProps> = ({ plan, fact, delays, show, onHide, date }) => {
    const result: CombinedData[] = [];
    // Заполняем данные плана
    plan.forEach((planItem) => {
        const existingItem = result.find((item) => item.id === planItem.gypsumBoard.id);

        if (!existingItem) {
            result.push({
                id: planItem.gypsumBoard.id,
                name: getName(planItem.gypsumBoard),
                plan: planItem.planValue,
                fact: 0,
            });
        } else {
            existingItem.plan += planItem.planValue; // Суммируем, если уже существует
        }
    });

    // Добавляем фактические данные к соответствующим элементам
    fact.forEach((factItem) => {
        const existingItem = result.find((item) => item.id === factItem.product.id);

        if (existingItem) {
            existingItem.fact += factItem.value; // Суммируем фактическое значение
        } else {
            result.push({
                id: factItem.product.id,
                name: getName(factItem.product),
                plan: 0,
                fact: factItem.value,
            });
        }
    });

    function getName(gypsumboard: GypsumBoard) {
        return gypsumboard.ptype.name + ' ' +
            gypsumboard.tradeMark.name + ' ' +
            gypsumboard.boardType.name + '-' +
            gypsumboard.edge.name + ' ' +
            gypsumboard.length.value + '-' +
            gypsumboard.width.value + ' ' +
            gypsumboard.thickness.value
    }

    return (
        <Modal show={show} onHide={onHide} centered={true} close>
            <Modal.Header closeButton className="custom-modal-header">
                Данные за {date}
                </Modal.Header>
            <Card>
                <Card.Body>
                    <Table striped bordered hover>
                        <thead className="table-dark">
                            <tr>
                                <th>Вид Гипсокартона</th>
                                <th>План</th>
                                <th>Факт</th>
                                <th>Отклонение</th>
                            </tr>
                        </thead>
                        <tbody>
                            {result.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.name}</td>
                                    <td>{item.plan}</td>
                                    <td>{item.fact.toFixed(2)}</td>
                                    <td>{(item.fact - item.plan).toFixed(2)}</td>
                                </tr>
                            ))}
                            
                                <tr className="table-success">
                                    <td>Итого</td>
                                    <td>{result.reduce((sum, item) => sum + item.plan, 0)}</td>
                                    <td>{result.reduce((sum, item) => sum + item.fact, 0)}</td>
                                    <td>{result.reduce((sum, item) => sum + (item.fact - item.plan), 0)}</td>
                                </tr>
                            
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </Modal>
    )


}
export default PlanFactModal;