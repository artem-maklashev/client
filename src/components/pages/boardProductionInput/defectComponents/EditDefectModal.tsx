import BoardDefectsLog from "../../../../model/defects/BoardDefectsLog";
import React, { useCallback, useEffect, useMemo, useState } from "react";
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
    const [value, setValue] = useState<number>(0);
    const [reasonList, setReasonList] = useState<DefectReason[]>([]);
    const [reason, setReason] = useState<DefectReason | null>(null);
    const [defectTypeList, setDefectTypeList] = useState<DefectTypes[]>([]);
    const [defectType, setDefectType] = useState<DefectTypes | null>(null);
    const [defectsList, setDefectsList] = useState<Defects[]>([]);
    const [selecteddefect, setSelectedDefect] = useState<Defects | null>(null);

    const fetcher = useMemo(() => new FetchDefectData(), []);

    const fetchDefectReasons = useCallback(async () => {
        const reasons = await fetcher.getDefectReason();
        setReasonList(reasons);
        if (reasons.length > 0 && !reason) {
            setReason(reasons[0]);
        }
    }, [fetcher]);

    const fetchDefectTypes = useCallback(async () => {
        const types = await fetcher.getDefectTypes();
        setDefectTypeList(types);
        if (types.length > 0 && !defectType) {
            setDefectType(types[0]);
        }
    }, [fetcher]);

    const fetchDefects = useCallback(async (defectReasonId: number, defectTypeId: number) => {
        const defects = await fetcher.getDefects(defectReasonId, defectTypeId);
        setDefectsList(defects);
        if (defects.length > 0 && !selecteddefect) {
            setSelectedDefect(defects[0]);
        }
    }, [fetcher]);

    const handleSave = () => {
        if (defect) {
            defect.defects = selecteddefect!;
            defect.value = value;
            onSave(defect);
            onHide();
        } else {
            const newDefect = new BoardDefectsLog(
                -1,
                value,
                selecteddefect!
            );
            onSave(newDefect);
            onHide();
        }
    };

    useEffect(() => {
        if (show) {
            setValue(0);
            setReason(null);
            setDefectType(null);
            setSelectedDefect(null);

            fetchDefectReasons();
            fetchDefectTypes();

            if (defect) {
                setReason(defect.defects.defectReason);
                setDefectType(defect.defects.defectTypes);
                setSelectedDefect(defect.defects);
                setValue(defect.value);
            }
        }
    }, [show, fetchDefectReasons, fetchDefectTypes, defect]);

    useEffect(() => {
        if (reason && defectType) {
            fetchDefects(reason.id, defectType.id);
        }
    }, [reason, defectType, fetchDefects]);

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Редактирование дефекта ID-"{defect?.id}"</Modal.Title>
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
