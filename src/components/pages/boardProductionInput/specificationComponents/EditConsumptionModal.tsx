import React, { useEffect, useState } from "react";
import GypsumBoard from "../../../../model/gypsumBoard/GypsumBoard";
import MaterialConsumption from "../../../../model/specification/MaterialConsumption";
import Specification from "../../../../model/specification/Specification";
import { Modal, Table } from "react-bootstrap";

interface EditConsumpionProps {
    show: boolean;
    specifications: Specification[];
    product: GypsumBoard | null;
    onHide: () => void;
    // onSave: (updatedConsumptions: MaterialConsumption[]) => void;
}

const EditConsumptionModal: React.FC<EditConsumpionProps> = ({
    show, specifications, product, onHide
}) => {
    const [specification, setSpecification] = useState<Specification[]>(specifications);
    useEffect(() => {
        console.log(specifications);
        if (specifications) {
            setSpecification(specifications);
        }
    }, [specifications]);

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Расход материалов</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Table striped bordered hover size="sm" variant="dark" >
                    <thead>
                        <tr>
                            <th>Наименование</th>
                            <th>Норма</th>
                        </tr>
                    </thead>
                    <tbody>
                        {specification.length > 0 ?
                            (
                                specification.map((entry) => (
                                    <tr key={entry.id}>
                                        <td>{entry.material.name}</td>
                                        <td>{entry.quantity}</td>
                                    </tr>
                                )
                                )
                            ) : (

                                <tr>
                                    <td colSpan={2}>Нет данных</td>
                                </tr>

                            )}
                    </tbody>
                </Table>
            </Modal.Body>
        </Modal>
    );
}
export default EditConsumptionModal;