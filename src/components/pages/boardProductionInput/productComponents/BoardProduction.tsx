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
import Preloader from "../../commonElements/preloader";

const BoardProductionPage: React.FC = () => {
    const { productionList, fetchProductionData, isLoading: isFetching } = useProductionLogData();
    const [reports, setReports] = useState<ReportData<GypsumBoard, GypsumBoardCategory, BoardProduction, Delays>[]>([]);
    const [showReportModal, setShowReportModal] = useState<boolean>(false);
    const [newReport, setNewReport] = useState<ReportData<GypsumBoard, GypsumBoardCategory, BoardProduction, Delays> | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);

    useEffect(() => {
        setReports(productionList);
    }, [productionList]);

    const handleAddReport = () => {
        setShowReportModal(true);
    };

    const onSave = async (report: ReportData<GypsumBoard, GypsumBoardCategory, BoardProduction, Delays>) => {
        setIsSaving(true);
        try {
            const savedReport = await saveUpdatedReport(report);
            setShowReportModal(false);

            setReports(prevReports => {
                const findReport = prevReports.find(r => r.productionList.id === savedReport.productionList.id);
                if (findReport) {
                    return prevReports.map(r =>
                        r.productionList.id === savedReport.productionList.id ? report : r
                    );
                } else {
                    return [...prevReports, report];
                }
            });
            
            await refreshProductionList();
        } catch (error) {
            console.error("Error saving report:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const refreshProductionList = async () => {
        await fetchProductionData();
    };

    // Прелоадер на весь экран
    const showPreloader = isFetching || isLoading || isSaving;

    return (
        <>
            {/* Прелоадер */}
            {showPreloader && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    backgroundColor: 'rgba(128, 128, 128, 0.9)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999
                }}>
                    <Preloader />
                </div>
            )}
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
                        disabled={isSaving}
                    >
                        <i className="bi bi-plus-circle" style={{ fontSize: '1.1rem' }} />
                        <span>{isSaving ? 'Сохранение...' : 'Добавить отчет'}</span>
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
        </>
    );
};

export default BoardProductionPage;