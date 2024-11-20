import React, { useCallback, useEffect, useState } from 'react';
import GypsumBoardInputData from "../../model/inputData/GypsumBoardInputData";
import GypsumBoardTable from "./gypsumBoardElements/GypsumBoardTable";
import { Card, Col, Container, Row, Tab, Tabs } from "react-bootstrap";
import './MyStyle.css'
import EdgeChart from "./gypsumBoardElements/EdgeChart";
import DefectChart from "./gypsumBoardElements/DefectChart";
import ThicknessChart from "./gypsumBoardElements/ThicknessChart";
import { useFetchProductionData } from "./commonElements/GetProductionData";
import TypesChart from './gypsumBoardElements/TypesChart';
import GypsumBoardChart from "./gypsumBoardElements/GypsumBoardChart";
import { api } from "../../service/Api";
import DateRangeSelector from './dashBoardComponent/dateRangeSelector';
import { start } from 'repl';

interface GypsumBoardShowProps {
}

const GypsumBoardShow: React.FC<GypsumBoardShowProps> = () => {
    const [gypsumBoardData, setGypsumBoardData] = useState<GypsumBoardInputData[]>([]);
    const [errorText, setErrorText] = useState<string | null>(null);
    const [selectedStartDate, setSelectedStartDate] = useState<string | null>(getFirstDate());
    const [selectedEndDate, setSelectedEndDate] = useState<string | null>(getCurrentDate());
    const [loading, setLoading] = useState<boolean>(false);
    const { productionData } = useFetchProductionData(selectedStartDate, selectedEndDate);

    const fetchGypsumBoardData = useCallback(async () => {
        try {
            setGypsumBoardData([]);
            setLoading(true);
            const response = await api.get(`${process.env.REACT_APP_API_URL}/allboard`, {
                params: {
                    startDate: selectedStartDate ? new Date(selectedStartDate).toISOString() : new Date().toISOString(),
                    endDate: selectedEndDate ? new Date(selectedEndDate).toISOString() : new Date().toISOString()
                }
            });

            if (!response.data) {
                throw new Error(`Ошибка при запросе: ${response.status} ${response.statusText}`);
            }

            setErrorText(null);
            setGypsumBoardData(response.data);
        } catch (error: any) {
            console.error(`Произошла ошибка: ${error.message}`);
            setErrorText(error.message);
            setGypsumBoardData([]);
        } finally {
            setLoading(false);
        }
    }, [selectedStartDate, selectedEndDate]);

    useEffect(() => {
        const fetchData = async () => {
            await fetchGypsumBoardData();
        };

        fetchData();
    }, [fetchGypsumBoardData]);
    

    function getCurrentDate(): string {
        const now = new Date();
        const year = now.getUTCFullYear();
        const month = (now.getUTCMonth() + 1).toString().padStart(2, '0');
        const day = now.getUTCDate().toString().padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    function getFirstDate(): string {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const year = firstDay.getFullYear();
        const month = (firstDay.getMonth() + 1).toString().padStart(2, '0');

        return `${year}-${month}-01`;
    }    

    useEffect(() => {
        setLoading(false);
    }, []);

    const handlePeriodChange = (startDate: Date | null, endDate: Date | null) => {
        if (startDate && endDate) {
        setSelectedStartDate(startDate.toDateString());
        setSelectedEndDate(endDate.toDateString());
    }
    };

    return (
        <div className="row mt-5 justify-content-center" style={{ backgroundColor: '#b5b5b5' }}>
            <Container className="container mt-auto">
                <Row className='justify-content-center mt-3'>
                    <Col lg={3} sm={3}>
                        <DateRangeSelector onDatesChange={handlePeriodChange}
                        />
                    </Col>
                </Row>                
            </Container>

            {errorText && <div className="error-message">{errorText}</div>}
            <Container className="col-lg-11 mb-5">
                <Row className="p-4">
                    <Tabs defaultActiveKey="table" id="uncontrolled-tab-example">
                        <Tab eventKey="table" title="Таблица">
                            {loading && (
                                <div className="preloader-wrapper">
                                    <span className="preloader"></span>
                                </div>
                            )}

                            <Col className="d-flex justify-content-center">
                                <GypsumBoardTable data={gypsumBoardData} />
                            </Col>
                        </Tab>
                        <Tab eventKey="bar" title="График">
                            <Col className="col-12">
                                <Row className="justify-content-center">
                                    <Col xs={12} sm={6} md={4} lg={4}>
                                        <GypsumBoardChart raw_data={gypsumBoardData} />
                                    </Col>
                                    <Col xs={12} sm={6} md={4} lg={4}>
                                        <Row className="d-flex justify-content-center">
                                            <Col>
                                                <Card>
                                                    <Card.Header className='text-center'><h3>Кромка</h3></Card.Header>
                                                    <Card.Body style={{ width: "100%", height: `340px` }} >
                                                        <EdgeChart edgeData={productionData} />
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        </Row>
                                        <Row className="d-flex justify-content-center">
                                            <Col>
                                                <Card>
                                                    <Card.Header className='text-center'><h3>Толщина</h3></Card.Header>
                                                    <Card.Body style={{ width: "100%", height: `340px` }} >
                                                        <ThicknessChart edgeData={productionData} />
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col xs={12} sm={6} md={4} lg={4} >
                                        <Row className="d-flex justify-content-center">
                                            <Col>
                                                <TypesChart edgeData={productionData} />
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row className="d-flex justify-content-center">
                                    <Col xs={12} className="col-xxl">
                                        <DefectChart data={productionData} />
                                    </Col>
                                </Row>
                            </Col>
                        </Tab>
                        {/* <Tab eventKey="opinion" title="В разработке" disabled={true}>
                            В разработке...
                        </Tab> */}
                    </Tabs>
                </Row>
            </Container>
        </div>
    );
};

export default GypsumBoardShow;
