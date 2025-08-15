import React, { useEffect, useState } from "react";
import BoardProduction from "../../../model/production/BoardProduction";
import { Card, Table } from "react-bootstrap";

interface NotQualtyProps {
    productionData: BoardProduction[];
}

const NotQulaty: React.FC<NotQualtyProps> = ({ productionData }) => {

    const [notQualty, setNotQualty] = useState<BoardProduction[]>([]);

    useEffect(() => {
        if (productionData.length > 0) {
            setNotQualty(productionData.filter((production) => production.category.id === 5 && production.value !== 0));
        } else {
            setNotQualty([]);
        }
    }, [productionData]);

    if (notQualty.length === 0) {
        return (
            <div className="text-center p-3">
                <p className="text-muted">Нет данных о неопределенном качестве</p>
            </div>
        );
    }

    return (
        <Card className="shadow-sm rounded-5 border-0 " style={{ width: 'fit-content', minWidth: '300px' }}>
            <div className="card-header bg-white border-0 py-3">
                <h5 className="mb-0 text-dark">
                    <i className="bi bi bi-question-square text-warning me-2"></i>
                    Неопределенное качество
                </h5>
            </div>
            <div className="card-body p-0">
                <div className="table-responsive" style={{ overflowX: 'visible' }}>
                    <Table striped hover className="mb-0 modern-table" style={{ width: 'auto' }}>
                        <thead>
                            <tr>
                                <th className="align-middle" style={{ whiteSpace: 'nowrap' }}>Дата</th>
                                <th className="align-middle" style={{ whiteSpace: 'nowrap' }}>Гипсокартон</th>
                                <th className="align-middle text-end" style={{ whiteSpace: 'nowrap' }}>Количество (м²)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {notQualty.map((item, index) => (
                                <tr key={index}>
                                    <td className="align-middle" style={{ whiteSpace: 'nowrap' }}>
                                        {new Date(item.productionList.productionDate).toLocaleDateString('ru-RU')}
                                    </td>
                                    <td className="align-middle">
                                        <div>
                                            <strong>
                                                {item.product.tradeMark.name} {item.product.boardType.name}
                                            </strong>
                                        </div>
                                        <div className="small text-muted">
                                            {item.product.edge.name} {item.product.thickness.value}×
                                            {item.product.width.value}×{item.product.length.value}
                                        </div>
                                    </td>
                                    <td className="align-middle text-end" style={{ whiteSpace: 'nowrap' }}>
                                        <span className="font-weight-medium">
                                            {item.value?.toLocaleString('ru-RU') || '0'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div>
        </Card>
    );
};

export default NotQulaty;