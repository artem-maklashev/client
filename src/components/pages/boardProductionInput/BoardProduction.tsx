import React, { useEffect, useState } from "react";
import ProductionListTable from "./productionListTable";
import { ProductionLogData } from "./productionLogData";
import { Button, Col, Container, Row } from "react-bootstrap";
import ReportData from "../../../model/ReportData";
import GypsumBoardCategory from "../../../model/gypsumBoard/GypsumBoardCategory";
import GypsumBoard from "../../../model/gypsumBoard/GypsumBoard";
import BoardProduction from "../../../model/production/BoardProduction";
import Delays from "../../../model/delays/Delays";
import ReportModalPage from "./ReportModalPage";
import { saveUpdatedReport } from "./SaveUpdatedReport";
import NewReport from "./NewReport";


const BoardProductionPage: React.FC = () => {
    // При использовании хука ProductionLogData, деструктурируем объект, который он возвращает
    const { productionList, } = ProductionLogData();
    const [reposts, setReports] = useState<ReportData<GypsumBoard, GypsumBoardCategory, BoardProduction, Delays>[]>(productionList);
    const [showReportModal, setShowReportModal] = useState<boolean>(false);
    const [newReport, setNewReport] = useState<ReportData<GypsumBoard, GypsumBoardCategory, BoardProduction, Delays> | null>(null);

    useEffect(() => {
        setReports(productionList);
    }, [productionList]);

    useEffect(() => {
        const fetchReportData = async () => {
            const data = await NewReport();
            setNewReport(data);
            console.log(data);
        };

        if (showReportModal) {
            fetchReportData();
        }
    }, [showReportModal]);

    const handleAddReport = () => {
        setShowReportModal(true);
    }

    const onSave = (report: ReportData<GypsumBoard, GypsumBoardCategory, BoardProduction, Delays>) => {
        // saveUpdatedReport(report);
        setShowReportModal(false);
    }

    // Данные загружены успешно
    return (
        <Container fluid className="mt-5 " style={{ backgroundColor: 'grey' }}>
            <Row>
                <Col className="col-12">
                    <ProductionListTable boardProductions={reposts} />

                </Col>
            </Row>
            <Row className="justify-content-center ">
                <Col className="col-2">
                    <Button onClick={() => { handleAddReport() }}>Добавить отчет</Button>
                </Col>
            </Row>
            <ReportModalPage show={showReportModal} reportData={newReport} onHide={() => setShowReportModal(false)} onSave={onSave}></ReportModalPage>
        </Container>

    );
}

export default BoardProductionPage;
