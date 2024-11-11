import { Button, Form, Modal } from "react-bootstrap";
import MixCategoryProduction from "../../../../model/mix/prodution/MixCategoryProduction";
import React from "react";

interface MixEditCategoryModalProps { 
    show: boolean;
    category: MixCategoryProduction | null;
    handleSave: (category: MixCategoryProduction) => void;
    onHide: () => void;

}


const MixEditCategoryModal: React.FC<MixEditCategoryModalProps> = ({ show, category, handleSave, onHide }) => {
    const [newValue, setNewValue] = React.useState(category?.quantity || 0);
    // const [showModal, setShowModal] = React.useState(show);

    

    const saveChanges = () => {
        if (category) {
            category.quantity = newValue;
            handleSave({
                ...category
            });
        }
        console.log("Передаюизмененную категорию в MixProductionModal",category);
        setNewValue(0);
    }

    return (
        <Modal show={show} onHide={onHide} >
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
                        autoFocus
                    />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Отмена
                </Button>
                <Button variant="primary" onClick={saveChanges}>
                    Сохранить
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
export default MixEditCategoryModal;