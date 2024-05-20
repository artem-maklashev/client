import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import ProductCategoryMapEntry from "../../../model/production/ProductCategoryMapEntry";
import GypsumBoardCategory from "../../../model/gypsumBoard/GypsumBoardCategory";
import BoardProduction from "../../../model/production/BoardProduction";


interface EditCategoryModalProps {
    show: boolean;
    category: BoardProduction | null;
    onHide: () => void;
    onSave: (updatedCategory: BoardProduction) => void;
}

const EditCategoryModal: React.FC<EditCategoryModalProps> = ({
    show,
    category,
    onHide,
    onSave
    
}) => {
    const [newValue, setNewValue] = useState<number>(category ? category.value : 0);

    const handleSave = () => {
        if (category) {
            category.value = newValue;
            onSave(category); // Вызываем функцию onSave с обновленной категорией
            onHide();
        }
    };

    useEffect(() => {
        if (show && category) {
            setNewValue(category.value);
        }
    }, [show,category]);

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>{category?.category.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group controlId="categoryValue">
                    <Form.Label>Новое значение:</Form.Label>
                    <Form.Control
                        type="number"
                        value={newValue}
                        onChange={(e) => setNewValue(parseFloat(e.target.value))}
                    />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Отмена
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    Сохранить
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditCategoryModal;
