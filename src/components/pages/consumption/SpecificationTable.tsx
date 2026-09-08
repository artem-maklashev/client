import { useMemo, useState } from "react";
import Specification from "../../../model/specification/Specification";
import Material from "../../../model/specification/Material"; 
import { Card, Col, Row, Spinner, Table, Form, Button } from "react-bootstrap";

interface SpecificationTableProps {
    specification: Specification[];
    allMaterials: Material[];
    isLoadingSpecification: boolean;
    onUpdateQuantity: (materialId: number, newQuantity: number) => void;
    onRemoveMaterial: (materialId: number) => void;
    onAddMaterial: (materialId: number, quantity: number) => void;
}

export const SpecificationTable: React.FC<SpecificationTableProps> = ({ 
    specification, 
    allMaterials,
    isLoadingSpecification,
    onUpdateQuantity,
    onRemoveMaterial,
    onAddMaterial
}) => {
    const [newMaterialId, setNewMaterialId] = useState<string>('');
    const [newQuantity, setNewQuantity] = useState<string>('');

    const sortedSpecification = useMemo(() => {
        if (!specification) return [];
        return [...specification].sort((a, b) =>
            a.material.name.localeCompare(b.material.name)
        );
    }, [specification]);

    // Делим массив пополам для двух колонок
    const { leftColumn, rightColumn } = useMemo(() => {
        const mid = Math.ceil(sortedSpecification.length / 2);
        return {
            leftColumn: sortedSpecification.slice(0, mid),
            rightColumn: sortedSpecification.slice(mid)
        };
    }, [sortedSpecification]);

    const availableMaterialsToAdd = useMemo(() => {
        if (!allMaterials) return [];
        const existingIds = new Set(specification?.map(s => s.material.id));
        return allMaterials.filter(m => !existingIds.has(m.id));
    }, [allMaterials, specification]);

    const handleAddClick = () => {
        if (newMaterialId && newQuantity) {
            onAddMaterial(Number(newMaterialId), Number(newQuantity));
            setNewMaterialId('');
            setNewQuantity('');
        }
    };

    // Общая функция рендеринга таблицы, чтобы не дублировать код для двух колонок
    const renderTableRows = (items: Specification[]) => (
        items.map((row) => (
            <tr key={row.material.id}>
                <td>{row.material.name}</td>
                <td>
                    <Form.Control 
                        type="number" 
                        size="sm"
                        value={row.quantity}
                        onChange={(e) => onUpdateQuantity(row.material.id, Number(e.target.value))}
                        step="0.01"
                    />
                </td>
                <td className="text-center">
                    <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => onRemoveMaterial(row.material.id)}
                    >
                        Удалить
                    </Button>
                </td>
            </tr>
        ))
    );

    return (
        <Col xs={12} className="mt-4">
            {isLoadingSpecification || !specification ? (
                <Card className="shadow-sm border-0">
                    <Card.Body className="d-flex justify-content-center p-5">
                        <Spinner animation="border" variant="primary" role="status">
                            <span className="visually-hidden">Загрузка...</span>
                        </Spinner>
                    </Card.Body>
                </Card>
            ) : (
                /* Используем Row, чтобы разбить контент на колонки */
                <Row className="g-4">
                    {/* Первая колонка (на больших экранах занимает 6 из 12 колонок, на малых — всю ширину) */}
                    <Col xs={12} md={6}>
                        <Card className="shadow-sm border-0 h-100">                            
                            <Card.Body style={{ maxHeight: '75vh', overflowY: 'auto' }}>
                                <Table striped bordered hover responsive className="mb-0 mt-3 align-middle">
                                    <thead>
                                        <tr>
                                            <th style={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1 }}>Материал</th>
                                            <th style={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1, width: '150px' }}>Норма</th>
                                            <th style={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1, width: '100px' }}>Действия</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {renderTableRows(leftColumn)}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Вторая колонка + строка добавления в самом низу */}
                    <Col xs={12} md={6}>
                        <Card className="shadow-sm border-0 h-100">                            
                            <Card.Body style={{ maxHeight: '75vh', overflowY: 'auto' }}>
                                <Table striped bordered hover responsive className="mb-0 mt-3 align-middle">
                                    <thead>
                                        <tr>
                                            <th style={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1 }}>Материал</th>
                                            <th style={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1, width: '150px' }}>Норма</th>
                                            <th style={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1, width: '100px' }}>Действия</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {renderTableRows(rightColumn)}
                                        
                                        {/* Строка добавления нового материала теперь в конце второй колонки */}
                                        <tr>
                                            <td>
                                                <Form.Select 
                                                    size="sm"
                                                    value={newMaterialId}
                                                    onChange={(e) => setNewMaterialId(e.target.value)}
                                                >
                                                    <option value="">-- Выберите материал --</option>
                                                    {availableMaterialsToAdd.map(m => (
                                                        <option key={m.id} value={m.id}>
                                                            {m.name}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            </td>
                                            <td>
                                                <Form.Control 
                                                    type="number" 
                                                    size="sm"
                                                    placeholder="Кол-во"
                                                    value={newQuantity}
                                                    onChange={(e) => setNewQuantity(e.target.value)}
                                                    step="0.01"
                                                />
                                            </td>
                                            <td className="text-center">
                                                <Button 
                                                    variant="success" 
                                                    size="sm"
                                                    onClick={handleAddClick}
                                                    disabled={!newMaterialId || !newQuantity}
                                                >
                                                    +
                                                </Button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}
        </Col>
    );
};