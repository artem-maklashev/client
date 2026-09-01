import React from 'react';
import { Accordion, Table, Badge } from 'react-bootstrap';
import { ProductAverageConsumption } from '../../../model/specification/conumptions/ProductAverageConsumption';

interface Props {
    consumptions: ProductAverageConsumption[];
}

export const ConsumptionTreeView: React.FC<Props> = ({ consumptions }) => {
    if (!consumptions || consumptions.length === 0) {
        return <div className="text-muted fst-italic p-3">Нет данных для отображения</div>;
    }

    return (
        // flush убирает внешние границы, делая аккордеон легче визуально
        <Accordion defaultActiveKey="0" flush className="rounded-4 overflow-hidden border">
            {consumptions.map((item, index) => (
                <Accordion.Item eventKey={index.toString()} key={index}>
                    <Accordion.Header>
                        <div className="d-flex justify-content-between align-items-center w-100 me-3">
                            <span className="fw-semibold text-dark">
                                {/* Предполагаем, что у GypsumBoard есть поле name или метод toString() */}
                                {item.gypsumBoard.toString() || 'ГСП'} 
                            </span>
                            <Badge bg="light" text="secondary" pill className="border">
                                компонентов: {item.averageConsumptionComparisons.length} 
                            </Badge>
                        </div>
                    </Accordion.Header>
                    <Accordion.Body className="p-0">
                        <Table hover responsive className="mb-0 align-middle text-nowrap">
                            <thead className="table-light text-muted" style={{ fontSize: '0.85rem' }}>
                                <tr>
                                    <th className="px-4 py-2 border-0">Материал</th>
                                    <th className="py-2 border-0">Норма (средний)</th>
                                    <th className="py-2 border-0">Факт (текущий)</th>
                                    <th className="px-4 py-2 border-0 text-end">Отклонение</th>
                                </tr>
                            </thead>
                            <tbody style={{ fontSize: '0.95rem' }}>
                                {item.averageConsumptionComparisons.map((comp, idx) => {
                                    // Считаем разницу для красивой подсветки
                                    const diff = (comp.currentConsumption - comp.averageConsumption)*100/comp.averageConsumption;
                                    const isOverConsumption = diff > 0;

                                    return (
                                        <tr key={idx}>
                                            <td className="px-4 fw-medium text-dark">
                                                {comp.material.name}
                                            </td>
                                            <td>{comp.averageConsumption.toLocaleString('ru-RU',
                                                {minimumFractionDigits: 4, maximumFractionDigits: 6}
                                            )}</td>
                                            <td>{comp.currentConsumption.toLocaleString('ru-RU',
                                                {minimumFractionDigits: 4, maximumFractionDigits: 6}
                                                )}</td>
                                            <td className={`px-4 text-end fw-bold ${isOverConsumption ? 'text-danger' : 'text-success'}`}>
                                                {isOverConsumption ? '+' : ''}{diff.toFixed(2)}%
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                    </Accordion.Body>
                </Accordion.Item>
            ))}
        </Accordion>
    );
};