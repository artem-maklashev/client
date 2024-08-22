import React, { useEffect, useState } from "react";
import ProductionListTable from "./productionListTable";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import ReportData from "../../../../model/ReportData";
import GypsumBoardCategory from "../../../../model/gypsumBoard/GypsumBoardCategory";
import GypsumBoard from "../../../../model/gypsumBoard/GypsumBoard";
import BoardProduction from "../../../../model/production/BoardProduction";
import Delays from "../../../../model/delays/Delays";
import ReportModalPage from "../ReportModalPage";
import { saveUpdatedReport } from "../SaveUpdatedReport";
import ApiService from "../../../../service/ApiService";
import DatePicker from "react-datepicker";
import { ru } from "date-fns/locale";
import Preloader from "../../commonElements/preloader";


const FindBoardReport: React.FC = () => {
    const [productions, setProductions] = useState<ReportData<GypsumBoard, GypsumBoardCategory, BoardProduction, Delays>[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [showReportModal, setShowReportModal] = useState<boolean>(false);
    const [newReport, setNewReport] = useState<ReportData<GypsumBoard, GypsumBoardCategory, BoardProduction, Delays> | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const findReport = async () => {
            if (selectedDate) {  // Убедимся, что selectedDate не null
                setLoading(true);
                try {
                    const report = await ApiService.fetchReports(selectedDate);
                    setProductions(report);
                } catch (error) {
                    console.error("Error fetching report:", error);
                    setProductions([]);
                } finally {
                    setLoading(false);
                }
            }
        };

        findReport();
    }, [selectedDate]);



    const onSave = async (report: ReportData<GypsumBoard, GypsumBoardCategory, BoardProduction, Delays>) => {
        await saveUpdatedReport(report);
        setShowReportModal(false);
        // await refreshProductionList(); // Обновить список отчетов после сохранения
    };

    function handleChange(date: Date | null,): void {
        setSelectedDate(date);
    }

    // const refreshProductionList = async () => {
    //     fetchProductionData();
    // };


    return (
        <Container fluid className="mt-5 mb-5" style={{ backgroundColor: 'grey' }}>
            <Row className="justify-content-center">
                <Col lg={3} md={6} sm={6} className="mb-2">
                    <Card className="mt-5">
                        <Card.Header className='text-center'>
                            <h4>Выберите дату</h4>
                        </Card.Header>
                        <Card.Body className="d-flex flex-column align-items-center">
                            <DatePicker
                                locale={ru}
                                selected={selectedDate}
                                onChange={handleChange}
                                dateFormat="d.MM.yyyy"
                                dropdownMode="select"
                            // closeOnScroll={true}
                            />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                {loading && (
                    <Preloader />
                )}
                <Col className="col-12">
                    <ProductionListTable boardProductions={productions} />
                </Col>
            </Row>
            <Row className="justify-content-center">
                {/* <Col className="col-2 mb-5">
                    <Button onClick={handleAddReport} style={{ width: '150px' }}>Добавить отчет</Button>

                </Col> */}
            </Row>
            <ReportModalPage
                show={showReportModal}
                reportData={newReport}
                onHide={() => {
                    setShowReportModal(false);
                    // refreshProductionList();
                }}
                onSave={onSave}
            />
        </Container>
    );
};

export default FindBoardReport;
