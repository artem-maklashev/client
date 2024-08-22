import React, { useCallback, useEffect, useState } from "react";
import BoardDefectsLog from "../../model/defects/BoardDefectsLog";
import { Col, Container, Row, Tab, Tabs } from "react-bootstrap";
import DefectsTable from "./defectElements/DefectsTable";
import { useFetchProductionData } from "./commonElements/GetProductionData";
import ShiftsDefect from "./defectElements/ShiftsDefect";
import ChartDefects from "./defectElements/ChartDefects";
import { api } from "../../service/Api";
import ApiService from "../../service/ApiService";
import BoardProduction from "../../model/production/BoardProduction";
import Preloader from "./commonElements/preloader";

interface DefectsShowProps {
}

const DefectsShow: React.FC<DefectsShowProps> = () => {
    const [defectsData, setDefectsData] = useState<BoardDefectsLog[]>([]);
    const [errorText, setErrorText] = useState<string | null>(null);
    const [selectedStartDate, setSelectedStartDate] = useState<string>(getFirstDate()); // Set initial date to today
    const [selectedEndDate, setSelectedEndDate] = useState<string>(getCurrentDate()); // Set initial date to today
    const [productionData, setProductionData] = useState<BoardProduction[]>([])
    // let { productionData, } = useFetchProductionData(selectedStartDate, selectedEndDate);
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

            const data: BoardDefectsLog[] = await response.data;
            setErrorText(null);
            setDefectsData(data);

        } catch (error: any) {
            console.error(`Произошла ошибка: ${error.message}`);
            setErrorText(error.message);
            setDefectsData([]);
        } finally {
            setLoading(false);
        }
    }, [selectedStartDate, selectedEndDate]);


    useEffect(() => {
        const fetchData = async () => {
            await fetchDefectsData();
            const prod = await ApiService.fetchBoardProduction(new Date(selectedStartDate), new Date(selectedEndDate));
            // console.log('Fetched production data:', prod); // Логируем полученные данные
            setProductionData(prod);
        };

        fetchData();
    }, [selectedStartDate, selectedEndDate, fetchDefectsData]);


    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const enteredDate = event.target.value;
        console.log(enteredDate)
        if (event.target.id === "startDateInput") {
            setSelectedStartDate(enteredDate);
            console.log("УСТАНОВЛЕНА НОВАЯ НАЧАЛЬНАЯ ДАТА")
            setErrorText(null); // Clear any previous error message
        } else if (event.target.id === "endDateInput") {
            setSelectedEndDate(enteredDate);
            console.log("УСТАНОВЛЕНА НОВАЯ КОНЕЧНАЯ ДАТА")
            setErrorText(null); // Clear any previous error message
        } else {
            // Handle invalid date
            setErrorText(`Invalid date format. Please use ${getLocalizedDateFormat()}.`);
        }

    };

    // Function to get the current date in YYYY-MM-DD format (required by input type="date")
    function getCurrentDate(): string {
        const now = new Date();
        const year = now.getUTCFullYear();
        const month = (now.getUTCMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
        const day = now.getUTCDate().toString().padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    function getFirstDate(): string {

        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getUTCMonth() + 1, 1);
        const year = firstDay.getUTCFullYear();
        const month = (firstDay.getUTCMonth() + 1).toString().padStart(2, '0'); // Months are zero-based


        return `${year}-${month}-01`;
    }

    // Function to get the localized date format
    const getLocalizedDateFormat = (): string => {
        const exampleDate = new Date(2023, 0, 1); // January 1, 2023
        return exampleDate.toLocaleDateString(undefined, {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
        });
    };


    console.log("Передаю данные по производству в размере " + productionData.length)

    return (
        <div className="row mt-5" style={{ backgroundColor: '#b5b5b5' }}>
            <Container className="container mt-auto">
                <div className="row mt-5 justify-content-center">
                    <div className="col-md-3 mb-3 mx-auto">
                        <div className="input-group">
                            <span className="input-group-text" id="basic-addon1">
                                Дата начала
                            </span>
                            <input
                                type="date"
                                id="startDateInput"
                                value={selectedStartDate}
                                onChange={handleDateChange}
                                className="form-control"
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-3 mb-3 mx-auto">
                            <div className="input-group">
                                <span className="input-group-text" id="basic-addon1">
                                    Дата окончания
                                </span>
                                <input
                                    type="date"
                                    id="endDateInput"
                                    value={selectedEndDate}
                                    onChange={handleDateChange}
                                    className="form-control"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Container>


            {errorText && <div className="error-message">{errorText}</div>}
            {loading && (
                <Preloader />
            )}
            <Container className="p-lg-2 mb-5">
                <Row xs={1} md={5} lg={1} className="d-flex justify-content-center">
                    <Row className="d-flex justify-content-center">
                        <div className="col-lg-11 ">
                            <Tabs defaultActiveKey="table" id="uncontrolled-tab-example" >
                                <Tab eventKey="table" title="Таблица" className="mb-5">
                                    <Row className="justify-content-center ">
                                        <Col className="col-lg-8">
                                            <DefectsTable defectsLog={defectsData} data={productionData} />
                                        </Col>
                                        <Col className="col-lg-3 ">
                                            <ShiftsDefect data={productionData} defectsLog={defectsData} />
                                        </Col>
                                    </Row>
                                </Tab>
                                <Tab eventKey="bar" title="График" className="mb-5">
                                    <Row className="justify-content-center">
                                        <ChartDefects defectsLog={defectsData} data={productionData} />
                                    </Row>
                                </Tab>
                                <Tab eventKey="opinion" title="В разработке" disabled={true}>
                                    В разработке...
                                </Tab>
                            </Tabs>
                        </div>
                    </Row>
                </Row>
            </Container>
        </div>
    );
};

export default DefectsShow;
