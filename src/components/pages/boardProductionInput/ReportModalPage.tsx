import React from "react";
import { Modal, Button } from "react-bootstrap";
import GypsumBoard from "../../../model/gypsumBoard/GypsumBoard";
import ReportData from "../../../model/ReportData";

interface ReportModalPageProps {
    show: boolean;
    reportData: ReportData | null;
    onHide: () => void; // добавляем onHide в пропсы
}

const ReportModalPage: React.FC<ReportModalPageProps> = ({ show, reportData, onHide }) => {
    if (!reportData) {
        return null;
    }

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Редактирование данных</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>ID: {reportData.productionList.id}</p>
                <p>Дата начала работы: {new Date(reportData.productionList.productionStart).toLocaleString()}</p>
                <p>Дата окончания работы: {new Date(reportData.productionList.productionFinish).toLocaleString()}</p>
                <p>Дата производства: {new Date(reportData.productionList.productionDate).toLocaleDateString()}</p>
                <p>Смена: {reportData.productionList.shift.name}</p>
                <p>Вид продукции: {reportData.productionList.type.name}</p>
                <p>Наименование: {reportData.product.tradeMark.name} тип {((reportData.product) as GypsumBoard).boardType.name}-{((reportData.product) as GypsumBoard).edge.name}{" "}{((reportData.product) as GypsumBoard).thickness.value}-{((reportData.product) as GypsumBoard).width.value}-{((reportData.product) as GypsumBoard).length.value}</p>
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
