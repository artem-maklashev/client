import React, { useCallback, useEffect, useState } from "react";
import BoardDefectsLog from "../../model/defects/BoardDefectsLog";
import { Col, Container, Row, Tab, Tabs } from "react-bootstrap";
import DefectsTable from "./defectElements/DefectsTable";
import ShiftsDefect from "./defectElements/ShiftsDefect";
import ChartDefects from "./defectElements/ChartDefects";
import { api } from "../../service/Api";
import ApiService from "../../service/ApiService";
import BoardProduction from "../../model/production/BoardProduction";
import Preloader from "./commonElements/preloader";
import DefectsByShift from "./defectElements/defectsByShift";
import DateRangeSelector from "./dashBoardComponent/dateRangeSelector";
import NotQulaty from "./defectElements/notQulaty";

// Utility function to format date as YYYY-MM-DD
const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Get first day of current month
const getFirstDate = (): string => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    return formatDate(firstDay);
};

// Get current date
const getCurrentDate = (): string => {
    return formatDate(new Date());
};

interface DefectsShowProps { }

const DefectsShow: React.FC<DefectsShowProps> = () => {
    const [defectsData, setDefectsData] = useState<BoardDefectsLog[]>([]);
    const [errorText, setErrorText] = useState<string | null>(null);
    const [selectedStartDate, setSelectedStartDate] = useState<string>(getFirstDate());
    const [selectedEndDate, setSelectedEndDate] = useState<string>(getCurrentDate());
    const [productionData, setProductionData] = useState<BoardProduction[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchDefectsData = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                startDate: selectedStartDate,
                endDate: selectedEndDate
            });

            const response = await api.get(`${process.env.REACT_APP_API_URL}/allboard/defects?${params.toString()}`);

            if (!response.data) {
                throw new Error(`Ошибка при запросе: ${response.status} ${response.statusText}`);
            }

            setDefectsData(response.data);
            setErrorText(null);
        } catch (error: any) {
            console.error(`Произошла ошибка: ${error.message}`);
            setErrorText(error.message);
            setDefectsData([]);
        }
    }, [selectedStartDate, selectedEndDate]);

    const fetchProductionData = useCallback(async () => {
        try {
            const startDate = new Date(selectedStartDate);
            const endDate = new Date(selectedEndDate);
            const prod = await ApiService.fetchBoardProduction(startDate, endDate);
            setProductionData(prod);
        } catch (error: any) {
            console.error(`Ошибка при загрузке данных производства: ${error.message}`);
            setErrorText(`Ошибка при загрузке данных производства: ${error.message}`);
            setProductionData([]);
        } finally {
            setLoading(false);
        }
    }, [selectedStartDate, selectedEndDate]);

    useEffect(() => {
        const fetchData = async () => {
            await fetchDefectsData();
            await fetchProductionData();
        };

        fetchData();
    }, [selectedStartDate, selectedEndDate, fetchDefectsData, fetchProductionData]);

    const handlePeriodChange = (startDate: Date | null, endDate: Date | null) => {
        if (startDate && endDate) {
            setSelectedStartDate(formatDate(startDate));
            setSelectedEndDate(formatDate(endDate));
        }
    };

    return (
        <div className="row mt-5 justify-content-center" style={{ backgroundColor: '#b5b5b5' }}>
            <Container className="container mt-auto col-lg-11">
                <Row className='justify-content-center mt-3'>
                    <Col lg={3} sm={3}>
                        <DateRangeSelector onDatesChange={handlePeriodChange} />
                    </Col>
                </Row>
            </Container>

            {errorText && <div className="alert alert-danger">{errorText}</div>}
            {loading && <Preloader />}

            {/* <Container className="p-lg-2 col-lg-11 mb-5"> */}
            <Container className="p-lg-2 mb-5">
                <Tabs defaultActiveKey="table" id="defects-tabs">
                    <Tab eventKey="table" title="Таблица" className="mb-3">
                        <Row className="justify-content-center">
                            <Col xs={12} lg={7} className="mb-3 mb-lg-0 ">
                                <DefectsTable defectsLog={defectsData} data={productionData} />
                            </Col>
                            <Col xs={12} lg={5}>
                                <ShiftsDefect data={productionData} defectsLog={defectsData} />
                            </Col>
                        </Row>

                    </Tab>
                    <Tab eventKey="bar" title="График" className="mb-3">
                        <Row className="justify-content-center">
                            <Col xs={12}>
                                <ChartDefects defectsLog={defectsData} data={productionData} />
                            </Col>
                        </Row>
                    </Tab>
                    <Tab eventKey="opinion" title="Брак по сменам">
                        <DefectsByShift production={productionData} />
                    </Tab>
                </Tabs>
                {/* </Container> */}
            </Container>
        </div>
    );
};

export default DefectsShow;