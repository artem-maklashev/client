import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Col, Container, Row } from "react-bootstrap";
import "../../pages/MyStyle.css";
import ReportData from "../../../model/ReportData";
import { ShiftList } from "./FetchShiftList";
import Shift from "../../../model/Shift";

interface ReportModalPageProps {
    show: boolean;
    reportData: ReportData | null;
    onHide: () => void;
}

const ReportModalPage: React.FC<ReportModalPageProps> = ({ show, reportData, onHide }) => {
    const [selectedShift, setSelectedShift] = useState<Shift | null>(reportData ? reportData.productionList.shift : null);
    const { shiftList } = ShiftList();

    useEffect(() => {
        if (show && reportData) {
            setSelectedShift(reportData.productionList.shift);
        }
    }, [show, reportData]);


    if (!reportData) {
        return null;
    }

    return (
        <Modal show={show} onHide={onHide} centered={true}>
            <Modal.Header closeButton className="custom-modal-header">
                <Modal.Title>Редактирование данных</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container>
                    <Row>
                        <Col className="col-6">
                            <Form.Group controlId="id">
                                <Form.Label>ID:</Form.Label>
                                <Form.Control type="text" value={reportData.productionList.id} readOnly />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Дата начала работы:</Form.Label>
                                <Form.Control type="datetime-local" value={new Date(reportData.productionList.productionStart).toISOString().slice(0, -8)} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Дата окончания работы:</Form.Label>
                                <Form.Control type="datetime-local" value={new Date(reportData.productionList.productionFinish).toISOString().slice(0, -8)} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Дата производства</Form.Label>
                                <Form.Control type="date" value={new Date(reportData.productionList.productionDate).toISOString().split('T')[0]} readOnly/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Смена</Form.Label>
                                <Form.Select value={selectedShift ? selectedShift.name : ""} onChange={(e) => {
                                    const selectedShiftName = e.target.value;
                                    const foundShift = shiftList.find(shift => shift.name === selectedShiftName);
                                    setSelectedShift(foundShift || null);
                                }}>
                                    {shiftList.map(shift => (
                                        <option key={shift.id} value={shift.name}>{shift.name}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>        
                    </Row>
                </Container>
                
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Закрыть
                </Button>
                <Button variant="primary" onClick={onHide}>
                    Сохранить изменения
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ReportModalPage;
