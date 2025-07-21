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
import "./modal.css"

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
        <Modal
            show={show}
            onHide={handleHide}
            scrollable={true}
            animation={true}
            size="lg"
            backdrop="static"
            keyboard={false}
            centered
            className="modern-modal"
        >
            <Modal.Header className="border-0 pb-0">
                <Modal.Title className="fw-bold fs-4 text-dark">Расход материалов</Modal.Title>
                <button
                    type="button"
                    className="btn-close"
                    onClick={handleHide}
                    aria-label="Close"
                />
            </Modal.Header>

            <Modal.Body className="pt-0">
                <div className="table-container-modal">
                    <Table hover className="modern-table-modal mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th className="ps-4 py-3 text-start fw-semibold text-muted small">Наименование</th>
                                <th className="py-3 text-end fw-semibold text-muted small">Норма</th>
                                <th className="py-3 text-end fw-semibold text-muted small">По норме</th>
                                <th className="py-3 text-end fw-semibold text-muted small">Факт</th>
                                <th className="pe-4 py-3 text-end fw-semibold text-muted small">Отклонение</th>
                            </tr>
                        </thead>
                        <tbody>
                            {specification.length > 0 ? (
                                specification.map((entry) => {
                                    const difference = getDifference(entry);
                                    const percentDiff = entry.quantity && productionTotal
                                        ? (difference * 100 / (entry.quantity * productionTotal)).toFixed(2)
                                        : '--';

                                    return (
                                        <tr key={entry.id} className="align-middle">
                                            <td className="ps-4 fw-medium">{entry.material.name}</td>
                                            <td className="text-end">{entry.quantity}</td>
                                            <td className="text-end">{(entry.quantity * productionTotal).toFixed(2)}</td>
                                            <td className="pe-3">
                                                <Form.Control
                                                    type="number"
                                                    defaultValue={getMaterialConsumption(entry)}
                                                    size="sm"
                                                    onChange={(event) => handleMaterialConsumptionChange(event, entry)}
                                                    className="modern-input-modal"
                                                />
                                            </td>
                                            <td className={`pe-4 text-center fw-medium ${difference > 0 ? 'text-danger' : 'text-success'}`}>
                                                <div className="d-flex flex-column">
                                                    <span>{difference.toFixed(2)}</span>
                                                    <small className={`badge ${difference > 0 ? 'bg-danger-light' : 'bg-success-light'} rounded-pill`}>
                                                        {percentDiff}%
                                                    </small>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={5} className="text-center py-4 text-muted">
                                        <i className="bi bi-database-exclamation me-2" />
                                        Нет данных
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            </Modal.Body>

            <Modal.Footer className="border-0 pt-0">
                <button
                    className="btn btn-outline-secondary me-2 px-4"
                    onClick={onHide}
                >
                    Отмена
                </button>
                <button
                    className="btn btn-primary px-4"
                    onClick={handleSave}
                    disabled={!['USER', 'ADMIN'].includes(getUserRole())}
                >
                    <i className="bi bi-check-circle me-2" />
                    Сохранить
                </button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditConsumptionModal;
