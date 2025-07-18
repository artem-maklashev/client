import React, { useEffect, useState } from "react";
import ProductionListTable from "./productionListTable";
import { useProductionLogData } from "./productionLogData";
import { Button, Col, Container, Row } from "react-bootstrap";
import ReportData from "../../../../model/ReportData";
import GypsumBoardCategory from "../../../../model/gypsumBoard/GypsumBoardCategory";
import GypsumBoard from "../../../../model/gypsumBoard/GypsumBoard";
import BoardProduction from "../../../../model/production/BoardProduction";
import Delays from "../../../../model/delays/Delays";
import ReportModalPage from "../ReportModalPage";
import { saveUpdatedReport } from "../SaveUpdatedReport";


const BoardProductionPage: React.FC = () => {
    const { productionList, fetchProductionData } = useProductionLogData();
    const [reports, setReports] = useState<ReportData<GypsumBoard, GypsumBoardCategory, BoardProduction, Delays>[]>([]);
    const [showReportModal, setShowReportModal] = useState<boolean>(false);
    const [newReport, setNewReport] = useState<ReportData<GypsumBoard, GypsumBoardCategory, BoardProduction, Delays> | null>(null);



    useEffect(() => {
        setReports(productionList);
    }, [productionList]);

    // useEffect(() => {
    //     const fetchReportData = async () => {
    //         const data = await createNewReport();

    //         setNewReport(data);

    //         console.log(data);
    //     };

    //     if (showReportModal) {
    //         fetchReportData();
    //     }
    // }, [showReportModal]);

    const handleAddReport = () => {
        setShowReportModal(true);
    };

    const onSave = async (report: ReportData<GypsumBoard, GypsumBoardCategory, BoardProduction, Delays>) => {
        await saveUpdatedReport(report);
        setShowReportModal(false);
        await refreshProductionList(); // Обновить список отчетов после сохранения
    };

    const refreshProductionList = async () => {
        fetchProductionData();
    };


    return (
        <Container fluid className="mt-5 mb-5" style={{ backgroundColor: 'grey' }}>
            <Row>
                <Col className="col-12">
                    <ProductionListTable boardProductions={reports} />
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col className="col-2 mt-2 mb-5">
                    <Button
                        onClick={handleAddReport}
                        className="d-flex align-items-center justify-content-center gap-2"
                        style={{
                            backgroundColor: '#8884d8',
                            borderColor: '#8884d8',
                            color: 'white',
                            borderRadius: '8px',
                            padding: '0.5rem 1.25rem',
                            fontWeight: 500,
                            boxShadow: '0 2px 4px rgba(136, 132, 216, 0.3)',
                            transition: 'all 0.2s ease',
                            width: '150px'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#7a76c5';
                            e.currentTarget.style.boxShadow = '0 4px 8px rgba(136, 132, 216, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#8884d8';
                            e.currentTarget.style.boxShadow = '0 2px 4px rgba(136, 132, 216, 0.3)';
                        }}
                    >
                        <i className="bi bi-plus-circle" style={{ fontSize: '1.1rem' }} />
                        <span>Добавить отчет</span>
                    </Button>

                </Col>
            </Row>
            <ReportModalPage
                show={showReportModal}
                reportData={newReport}
                onHide={() => {
                    setShowReportModal(false);
                    refreshProductionList();
                }}
                onSave={onSave}
            />
        </Container>
    );
};

export default BoardProductionPage;
