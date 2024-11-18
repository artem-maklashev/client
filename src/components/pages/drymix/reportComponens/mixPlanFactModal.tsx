import { Card, Modal, Table } from "react-bootstrap";
import MixDelay from "../../../../model/mix/delays/MixDelay";
import DryMix from "../../../../model/mix/DryMix";
import MixPlan from "../../../../model/mix/plan";
import MixCategoryProduction from "../../../../model/mix/prodution/MixCategoryProduction";
import React from "react";


interface PlanFactModalProps {
    show: boolean;
    plan: MixPlan[];
    fact: MixCategoryProduction[];
    delays: MixDelay[];
    onHide: () => void;
    date: string;
}

interface CombinedData {
    id: number;
    name: string;
    plan: number;
    fact: number;
}

const MixPlanFactModal: React.FC<PlanFactModalProps> = ({ plan, fact, delays, show, onHide, date }) => {
    const result: CombinedData[] = [];
    // Заполняем данные плана
    plan.forEach((planItem) => {
        const existingItem = result.find((item) => item.id === planItem.dryMix.id);

        if (!existingItem) {
            result.push({
                id: planItem.dryMix.id,
                name: getName(planItem.dryMix),
                plan: planItem.value,
                fact: 0,
            });
        } else {
            existingItem.plan += planItem.value; // Суммируем, если уже существует
        }
    });

    // Добавляем фактические данные к соответствующим элементам
    fact.forEach((factItem) => {
        
        const existingItem = result.find((item) => item.id === factItem.production.mix.id);

        if (existingItem) {
            existingItem.fact += factItem.quantity; // Суммируем фактическое значение
        } else {
            result.push({
                id: factItem.production.mix.id,
                name: getName(factItem.production.mix),
                plan: 0,
                fact: factItem.quantity,
            });
        }
    });

    function getName(mix: DryMix) {
        return `${mix.tradeMark.name} ${mix.dryMixType.name} ${mix.binder.name} ${mix.name}`
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
                            <tr className="text-center">
                                <th>Смесь</th>
                                <th>План</th>
                                <th>Факт</th>
                                <th>+/-</th>
                            </tr>
                        </thead>
                        <tbody>
                            {result.map((item, index) => (
                                <tr key={index} >
                                    <td className="text-left">{item.name}</td>
                                    <td className="text-center">{item.plan}</td>
                                    <td className="text-center">{item.fact.toFixed(0)}</td>
                                    <td className="text-center">{(item.fact - item.plan).toFixed(0)}</td>
                                </tr>
                            ))}

                            <tr className="table-dark">
                                <td>Итого</td>
                                <td className="text-center">{result.reduce((sum, item) => sum + item.plan, 0)}</td>
                                <td className="text-center">{result.reduce((sum, item) => sum + item.fact, 0)}</td>
                                <td className="text-center">{result.reduce((sum, item) => sum + (item.fact - item.plan), 0).toFixed(0)}</td>
                            </tr>

                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </Modal>
    )


}
export default MixPlanFactModal;