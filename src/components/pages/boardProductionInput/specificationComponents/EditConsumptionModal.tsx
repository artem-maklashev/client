import React, { useEffect, useState } from "react";
import GypsumBoard from "../../../../model/gypsumBoard/GypsumBoard";
import MaterialConsumption from "../../../../model/specification/MaterialConsumption";
import Specification from "../../../../model/specification/Specification";
import { Container, Form, Modal, Table } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import ProductionList from "../../../../model/production/ProductionList";
import ApiService from "../../../../service/ApiService";
import { Button } from "@mui/material";
import { getUserRole } from "../../../../service/Api";

interface EditConsumpionProps {
    show: boolean;
    specifications: Specification[];
    product: GypsumBoard | null;
    produtionList: ProductionList;
    productionTotal: number;
    onHide: () => void;
    onSave: (updatedConsumptions: MaterialConsumption[]) => void;
}

const EditConsumptionModal: React.FC<EditConsumpionProps> = ({
    show, specifications, product, productionTotal, produtionList, onHide, onSave
}) => {
    const [specification, setSpecification] = useState<Specification[]>([]);
    const [draftConsumption, setDraftConsumption] = useState<MaterialConsumption[]>([]);

    useEffect(() => {
        console.log("Initial specifications:", specifications);
        if (specifications) {
            const sortedSpecifications = specifications.sort((a, b) => a.material.id - b.material.id);
            console.log("Sorted specifications:", sortedSpecifications);
            setSpecification(sortedSpecifications);
        }
    }, [specifications]);

    useEffect(() => {
        const fetchConsumptionData = async () => {
            if (produtionList) {
                const data = await ApiService.fetchConsumption(produtionList);
                if (data.length > 0) {
                    console.log("Получен расход в размере", data.length);
                    return data;
                } else {
                    const newConsumptionList: MaterialConsumption[] = specification.map((item) => {
                        return new MaterialConsumption(-1, produtionList, item.material, 0);
                    });
                    return newConsumptionList;
                }
            } else {
                const newConsumptionList: MaterialConsumption[] = specification.map((item) => {
                    return new MaterialConsumption(-1, new ProductionList(), item.material, 0);
                });
                return newConsumptionList;
            }
        };

        const getConsumption = async () => {
            const consumption = await fetchConsumptionData();
            setDraftConsumption(consumption);
            console.log("Consumption length:", consumption.length);
        };

        if (produtionList) {
            getConsumption();
        }
    }, [produtionList, specification]);

    const getMaterialConsumption = (specification: Specification) => {
        const factQuantity = draftConsumption.find(item => item.material.id === specification.material.id);
        return factQuantity ? factQuantity.quantity : 0;
    };

    const handleHide = (): void => {
        setDraftConsumption([]);
        setSpecification([]);
        onHide();
    };

    const getDifference = (entry: Specification) => {
        return getMaterialConsumption(entry) - entry.quantity * productionTotal;
    };

    const handleMaterialConsumptionChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, entry: Specification) => {
        const findConsumption = draftConsumption.find((cons) => cons.material.id === entry.material.id)
        if (!findConsumption) {
            draftConsumption.push(new MaterialConsumption(-1, produtionList, entry.material, 0))
        }
        const updatedConsumption = draftConsumption.map((item) =>
            item.material.id === entry.material.id
                ? new MaterialConsumption(item.id, item.productionList, item.material, Number(event.target.value))
                : item
        );
        setDraftConsumption(updatedConsumption);
    };

    const handleSave = (): void => {
        const consumptions = draftConsumption.filter((consumption) => consumption.quantity > 0);
        onSave(consumptions);
    };

    return (
        <Modal show={show} onHide={handleHide} scrollable={true} animation={true} size="lg" backdrop="static" keyboard={false}>
            <Modal.Header >
                <Modal.Title>Расход материалов</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container fluid>
                    <Table striped bordered hover responsive="sm" variant="dark" className="w-auto">
                        <thead>
                            <tr>
                                <th>Наименование</th>
                                <th>Норма</th>
                                <th>По норме</th>
                                <th>Факт</th>
                                <th>Отклонение</th>
                            </tr>
                        </thead>
                        <tbody>
                            {specification.length > 0 ? (
                                specification.map((entry) => (
                                    <tr key={entry.id}>
                                        <td>{entry.material.name}</td>
                                        <td>{entry.quantity}</td>
                                        <td>{(entry.quantity * productionTotal).toFixed(2)}</td>
                                        <td className="auto-width">
                                            <Form.Control
                                                className="w-150"
                                                type="number"
                                                defaultValue={getMaterialConsumption(entry)}
                                                size="sm"
                                                onChange={(event) => handleMaterialConsumptionChange(event, entry)}
                                                style={{ color: 'white', backgroundColor: 'transparent' }}
                                            />
                                        </td>
                                        <td style={{ color: getDifference(entry) > 0 ? 'red' : 'green' }}>
                                            <strong>{getDifference(entry).toFixed(2)}</strong> {entry.quantity && productionTotal ? (getDifference(entry) * 100 / (entry.quantity * productionTotal)).toFixed(2) : '--'}%
                                        </td>

                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5}>Нет данных</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={onHide} color="primary">
                    Отмена
                </Button>
                <Button variant="contained" onClick={handleSave} disabled={getUserRole() === 'USER' || getUserRole() === 'ADMIN' ? false : true}>
                    Сохранить
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditConsumptionModal;
