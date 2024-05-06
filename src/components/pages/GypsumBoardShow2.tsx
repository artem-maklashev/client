import React, {useCallback, useEffect, useState} from 'react';
import GypsumBoardInputData from "../../model/inputData/GypsumBoardInputData";
import GypsumBoardTable from "./gypsumBoardElements/GypsumBoardTable";
import {Col, Container, Row, Spinner, Tab, Tabs} from "react-bootstrap";
import './MyStyle.css'
import EdgeChart from "./gypsumBoardElements/EdgeChart";
import DefectChart from "./gypsumBoardElements/DefectChart";
import ThicknessChart from "./gypsumBoardElements/ThicknessChart";
import {useFetchProductionData} from "./commonElements/GetProductionData";
import TypesChart from './gypsumBoardElements/TypesChart';
import GypsumBoardChart from "./gypsumBoardElements/GypsumBoardChart";
import axios from 'axios';
import {api} from "../../service/Api";
import width from "../../model/gypsumBoard/Width";

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
            setLoading(true);
            const response = await api.get(`${process.env.REACT_APP_API_URL}/allboard`, {
                params: {
                    startDate: selectedStartDate,
                    endDate: selectedEndDate
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

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setGypsumBoardData([]);
        const enteredDate = event.target.value;

        if (event.target.id === "startDateInput") {
            setSelectedStartDate(enteredDate);
            
            setErrorText(null);
        } else if (event.target.id === "endDateInput") {
            setSelectedEndDate(enteredDate);
            setErrorText(null);
        } else {
            setErrorText(`Invalid date format. Please use ${getLocalizedDateFormat()}.`);
        }
        fetchGypsumBoardData();        
    };

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

    const getLocalizedDateFormat = (): string => {
        const exampleDate = new Date(2023, 0, 1); // January 1, 2023
        return exampleDate.toLocaleDateString(undefined, {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
        });
    };

    useEffect(() => {
        setLoading(false);
    }, []);

    return (
        <div className="row mt-5 justify-content-center" style={{backgroundColor: '#b5b5b5'}}>
            <Container className="container mt-auto">
                <div className="row mt-5">
                    <div className="col-md-3 mb-3 mx-auto">
                        <div className="input-group">
                            <span className="input-group-text" id="basic-addon1">
                                Период:
                            </span>
                            <input
                                type="date"
                                id="startDateInput"
                                value={selectedStartDate ? selectedStartDate : getFirstDate()}
                                onChange={handleDateChange}
                                className="form-control "
                            />
                            <input
                                type="date"
                                id="endDateInput"
                                value={selectedEndDate ? selectedEndDate : getCurrentDate()}
                                onChange={handleDateChange}
                                className="form-control "
                            />
                        </div>
                    </div>
                    {/*<div className="row">*/}
                    {/*    <div className="col-md-3 mb-3 mx-auto">*/}
                    {/*        <div className="input-group">*/}
                    {/*            <span className="input-group-text" id="basic-addon1">*/}
                    {/*                Дата окончания*/}
                    {/*            </span>*/}
                    {/*            <input*/}
                    {/*                type="date"*/}
                    {/*                id="endDateInput"*/}
                    {/*                value={selectedEndDate}*/}
                    {/*                onChange={handleDateChange}*/}
                    {/*                className="form-control "*/}
                    {/*            />*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                </div>
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
                                <GypsumBoardTable data={gypsumBoardData}/>
                            </Col>
                        </Tab>
                        <Tab eventKey="bar" title="График">
                            <Col className="col-12">
                                <Row className="justify-content-center">
                                    <Col xs={12} sm={6} md={4} lg={4}>
                                        <GypsumBoardChart raw_data={gypsumBoardData}/>
                                    </Col>
                                    <Col xs={12} sm={6} md={4} lg={4}>
                                        <Row className="d-flex justify-content-center">
                                            <EdgeChart edgeData={productionData}/>
                                        </Row>
                                        <Row className="d-flex justify-content-center">
                                            <ThicknessChart edgeData={productionData}/>
                                        </Row>
                                    </Col>
                                    <Col xs={12} sm={12} md={4} lg={4} className="d-flex align-items-center" >

                                            <TypesChart edgeData={productionData}/>

                                    </Col>
                                </Row>
                                <Row className="d-flex justify-content-center">
                                    <Col xs={12} className="col-xxl">
                                        <DefectChart data={productionData}/>
                                    </Col>
                                </Row>
                            </Col>
                        </Tab>
                        <Tab eventKey="opinion" title="В разработке" disabled={true}>
                            В разработке...
                        </Tab>
                    </Tabs>
                </Row>
            </Container>
        </div>
    );
};

export default GypsumBoardShow;
