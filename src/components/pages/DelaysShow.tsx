import React, {useCallback, useEffect, useState} from "react";
import Delays from "../../model/delays/Delays";
import {Col, Container, Row, Tab, Tabs} from "react-bootstrap";
import DelaysTable from "./delaysElements/DelaysTable";
import DelaysChart from "./delaysElements/DelaysChart";
import {api} from "../../service/Api";

interface DelaysShowProps {
}


const DelaysShow: React.FC<DelaysShowProps> = () => {
    const [delaysData, setDelaysData] = useState<Delays[]>([]);
    const [errorText, setErrorText] = useState<string | null>(null);
    const [selectedStartDate, setSelectedStartDate] = useState<string>(getFirstDate()); // Set initial date to today
    const [selectedEndDate, setSelectedEndDate] = useState<string>(getCurrentDate()); // Set initial date to today
    const [planDuartion, setPlanDuration] = useState<number>(0);


    const fetchDelaysData = useCallback(async () => {
        try {
            const params = new URLSearchParams({
                startDate: selectedStartDate,
                endDate: selectedEndDate

            });

            const response = await api.get(`${process.env.REACT_APP_API_URL}/allboard/delays?${params.toString()}`);

            if (!response.data) {
                throw new Error(`Ошибка при запросе: ${response.status} ${response.statusText}`);
            }
            const data: Delays[] = await response.data;
            setErrorText(null);
            setDelaysData(data);
        } catch (error: any) {
            console.error(`Произошла ошибка: ${error.message}`);
            setErrorText(error.message);
            setDelaysData([]);
        }
    }, [selectedStartDate, selectedEndDate]);


    useEffect(() => {
        const fetchData = async () => {
            await fetchDelaysData();
        };

        const newDuration = (new Date(selectedEndDate).getTime() - new Date(selectedStartDate).getTime())/(1000*60);
        setPlanDuration(newDuration);

        fetchData();
    }, [selectedStartDate, selectedEndDate, fetchDelaysData]);


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


    return (
        <div className="row mt-5" style={{backgroundColor: '#b5b5b5'}}>
            <Container className="container mt-auto">
                <div className="row mt-5">
                    <div className="col-md-3 mb-3 mx-auto">
                        <div className="input-group">
                          <span className="input-group-text" id="basic-addon1">
                            C
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
                                    До
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
            <Container className="p-lg-2 mb-5">
                <Row xs={1} md={1} lg={1} className="d-flex justify-content-center">
                    <div className="col-lg-11 ">
                        <Tabs defaultActiveKey="table">
                            <Tab eventKey="table" title="Таблица" >
                                <Col>
                                    <Row >
                                        <DelaysTable data={delaysData} planDuration={planDuartion}/>
                                    </Row>
                                </Col>
                            </Tab>
                            <Tab eventKey="bar" title="График">
                                <Container className="align-items-center justify-content-center" >
                                    <Row>
                                        <DelaysChart delays_data={delaysData}/>
                                    </Row>
                                </Container>

                            </Tab>
                            {/* <Tab eventKey="opinion" title="В разработке" disabled={true}>
                                В разработке...
                            </Tab> */}
                        </Tabs>
                    </div>

                </Row>
            </Container>
        </div>
    );
};

export default DelaysShow;
