import Delays from "../../../../model/delays/Delays";
import BoardDefectsLog from "../../../../model/defects/BoardDefectsLog";
import React, { useEffect, useState } from "react";
import ProductionList from "../../../../model/production/ProductionList";
import Defects from "../../../../model/defects/Defects";
import FetchDefectData from "./FetchDefectData";
import DefectReason from "../../../../model/defects/DefectReason";
import DefectTypes from "../../../../model/defects/DefectTypes";
import { Button, Form, Modal } from "react-bootstrap";

interface EditDefectModalProps {
    show: boolean;
    defect: BoardDefectsLog | null;
    onHide: () => void;
    onSave: (updatedDefect: BoardDefectsLog) => void;
}

const EditDefectModal: React.FC<EditDefectModalProps> = ({
    show,
    defect,
    onHide,
    onSave
}) => {
    const [productionList, setProductionList] = useState<ProductionList | null>(null);
    const [value, setValue] = useState<number>(0);
    const [newDefect, setDefect] = useState<Defects | null>(null);
    const [reasonList, setReasonList] = useState<DefectReason[]>([]);
    const [reason, setReason] = useState<DefectReason | null>(defect ? defect.defects.defectReason : null);
    const [defectTypeList, setDefectTypeList] = useState<DefectTypes[]>([]);
    const [defectType, setDefectType] = useState<DefectTypes | null>(defect ? defect.defects.defectTypes : null);
    const [defectsList, setDefectsList] = useState<Defects[]>([]);
    const [selecteddefect, setSelectedDefect] = useState<Defects | null>(defect ? defect.defects : null);

    const fetcher = new FetchDefectData();

    const fetchDefectReasons = async () => {
        const reasons = await fetcher.getDefectReason();
        setReasonList(reasons);
        if (reasons.length > 0 && !defect) {
            setReason(reasons[0]);
        }
    }

    const fetchDefectTypes = async (defectReasonId: number) => {
        const types = await fetcher.getDefectTypes(defectReasonId);
        setDefectTypeList(types);
        if (types.length > 0 && !defect) {
            setDefectType(types[0]);
        }
    }

    const fetchDefects = async (defectReasonId: number, defectTypeId: number) => {
        const defects = await fetcher.getDefects(defectReasonId, defectTypeId);
        setDefectsList(defects);
        if (defects.length > 0 && !defect) {
            setSelectedDefect(defects[0]);
        }
    }

    const handleSave = () => {
        if (defect) {
            defect.defects = selecteddefect!;
            defect.value = value;
            onSave(defect);
            // } else {
            //     if (unitPart && shift && product) {
            //         const newDelay = new Delays(
            //             -1,
            //             new Date(),
            //             startTime,
            //             endTime,
            //             unitPart,
            //             shift,
            //             product,
            //             selectedDelayType!
            //         );
            //         onSave(newDelay);
            //     }
            // }
            onHide();
        }
    }

    useEffect(() => {
        if (show) {
            fetchDefectReasons();
        }
    }, [show]);

    useEffect(() => {
        if (reason) {
            fetchDefectTypes(reason.id);
        } else {
            setDefectTypeList([]);
        }
    }, [reason]);

    useEffect(() => {
        if (defectType && reason) {
            fetchDefects(reason.id, defectType.id);
        } else {
            setDefectsList([]);
        }
    }, [defectType, reason]);

    useEffect(() => {
        if (show && defect) {
            setReason(defect.defects.defectReason);
            setDefectType(defect.defects.defectTypes);
            setSelectedDefect(defect.defects);
        }
    }, [defect, show]);

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Редактирование дефекта</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group>
                    <Form.Label>Причина дефекта</Form.Label>
                    <Form.Select
                        value={reason?.id || 0}
                        onChange={(e) => {
                            const selectedDefectReasonId = parseInt(e.target.value);
                            const foundReason = reasonList.find((defectReason) => defectReason.id === selectedDefectReasonId);
                            setReason(foundReason || null);
                        }}
                    >
                        {reasonList.map((reason) => (
                            <option key={reason.id} value={reason.id}>
                                {reason.name}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Тип дефекта</Form.Label>
                    <Form.Select
                        value={defectType?.id || 0}
                        onChange={(e) => {
                            const selectedTypeId = parseInt(e.target.value);
                            const foundType = defectTypeList.find((defectType) => defectType.id === selectedTypeId);
                            setDefectType(foundType || null);
                        }}
                    >
                        {defectTypeList.map((defectType) => (
                            <option key={defectType.id} value={defectType.id}>
                                {defectType.name}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Дефект</Form.Label>
                    <Form.Select
                        value={selecteddefect?.id || ''}
                        onChange={(e) => {
                            const selectedDefectId = parseInt(e.target.value);
                            const foundDefect = defectsList.find((defect) => defect.id === selectedDefectId);
                            setSelectedDefect(foundDefect || null);
                        }}
                    >
                        {defectsList.map((defect) => (
                            <option key={defect.id} value={defect.id}>
                                {defect.name}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>
                <Form.Group controlId="defectValue">
                    <Form.Label>Количество:</Form.Label>
                    <Form.Control
                        type="number"
                        value={value}
                        onChange={(e) => setValue(parseFloat(e.target.value))}
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

export default EditDefectModal;
