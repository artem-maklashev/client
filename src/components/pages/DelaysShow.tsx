import React, { useCallback, useEffect, useState } from "react";
import Delays from "../../model/delays/Delays";
import { Col, Container, Row, Tab, Tabs } from "react-bootstrap";
import DelaysTable from "./delaysElements/DelaysTable";
import DelaysChart from "./delaysElements/DelaysChart";
import { api } from "../../service/Api";
import Preloader from "./commonElements/preloader";
import ApiService from "../../service/ApiService";
import DateRangeSelector from "./dashBoardComponent/dateRangeSelector";

interface DelaysShowProps {
}


const DelaysShow: React.FC<DelaysShowProps> = () => {
    const [delaysData, setDelaysData] = useState<Delays[]>([]);
    const [errorText, setErrorText] = useState<string | null>(null);
    const [selectedStartDate, setSelectedStartDate] = useState<string>(getFirstDate()); // Set initial date to today
    const [selectedEndDate, setSelectedEndDate] = useState<string>(getCurrentDate()); // Set initial date to today
    const [planDuartion, setPlanDuration] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);



    const fetchDelaysData = useCallback(async () => {
        setLoading(true);
        try {
            // const params = new URLSearchParams({
            //     startDate: selectedStartDate,
            //     endDate: selectedEndDate

            // });

            // const response = await api.get(`${process.env.REACT_APP_API_URL}/allboard/delays?${params.toString()}`);

            // if (!response.data) {
            //     throw new Error(`Ошибка при запросе: ${response.status} ${response.statusText}`);
            // }
            // const data: Delays[] = await response.data;
            const data: Delays[] = await ApiService.fetchDelaysData(
                new Date(selectedStartDate),
                new Date(selectedEndDate));
            setErrorText(null);
            setDelaysData(data);
        } catch (error: any) {
            console.error(`Произошла ошибка: ${error.message}`);
            setErrorText(error.message);
            setDelaysData([]);
        } finally {
            setLoading(false);
        }
    }, [selectedStartDate, selectedEndDate]);


    useEffect(() => {
        const fetchData = async () => {
            await fetchDelaysData();
        };

        // const newDuration = (new Date(selectedEndDate).getTime() - new Date(selectedStartDate).getTime()) / (1000 * 60);
       

            // setPlanDuration(newDuration); //Нужно изменить на получение данных с выпуска об отработанном времени

        fetchData();
    }, [selectedStartDate, selectedEndDate, fetchDelaysData]);

    useEffect(() => {
        const fetchFact = async () => {
            try {
                const response = await ApiService.fetchBoardProduction(
                    new Date(selectedStartDate),
                    new Date(selectedEndDate)
                );

                if (response && response.length > 0) {
                    const filteredData = response.filter(item => item.category.id === 1);
                    // Кэшируем Date объекты для лучшей производительности
                    const duration = filteredData.reduce((acc, curr) => {
                        const startDate = new Date(curr.productionList.productionStart).getTime();
                        const endDate = new Date(curr.productionList.productionFinish).getTime();

                        // Проверяем корректность дат
                        if (isNaN(startDate) || isNaN(endDate) || startDate > endDate) {
                            console.warn('Invalid date range for item:', curr);
                            return acc;
                        }

                        return acc + (endDate - startDate);
                    }, 0);

                    setPlanDuration(Math.floor(duration / (1000 * 60))); // Конвертируем в минуты
                } else {
                    setPlanDuration(0);
                }
            } catch (error) {
                console.error("Error fetching fact data:", error);
                setPlanDuration(0); // Устанавливаем 0 в случае ошибки
            }
        };

        fetchFact();
    }, [selectedStartDate, selectedEndDate]);

    // const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     const enteredDate = event.target.value;
    //     console.log(enteredDate)
    //     if (event.target.id === "startDateInput") {
    //         setSelectedStartDate(enteredDate);
    //         console.log("УСТАНОВЛЕНА НОВАЯ НАЧАЛЬНАЯ ДАТА")
    //         setErrorText(null); // Clear any previous error message
    //     } else if (event.target.id === "endDateInput") {
    //         setSelectedEndDate(enteredDate);
    //         console.log("УСТАНОВЛЕНА НОВАЯ КОНЕЧНАЯ ДАТА")
    //         setErrorText(null); // Clear any previous error message
    //     } else {
    //         // Handle invalid date
    //         setErrorText(`Invalid date format. Please use ${getLocalizedDateFormat()}.`);
    //     }

    // };

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
    // const getLocalizedDateFormat = (): string => {
    //     const exampleDate = new Date(2023, 0, 1); // January 1, 2023
    //     return exampleDate.toLocaleDateString(undefined, {
    //         day: 'numeric',
    //         month: 'numeric',
    //         year: 'numeric',
    //     });
    // };

    const formatDate = (date: Date): string => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handlePeriodChange = (startDate: Date | null, endDate: Date | null) => {
        if (startDate && endDate) {
            setSelectedStartDate(formatDate(startDate));
            setSelectedEndDate(formatDate(endDate));
        }
    };
    return (
        <div className="row mt-5" style={{ backgroundColor: '#b5b5b5' }}>
            <Container className="container mt-auto">
                {/* <div className="row mt-5">
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
                </div> */}
                <Row className='justify-content-center mt-3'>
                    <Col lg={3} sm={3}>
                        <DateRangeSelector onDatesChange={handlePeriodChange} />
                    </Col>
                </Row>
            </Container>


            {errorText && <div className="error-message">{errorText}</div>}
            {loading && (
                <Preloader />
            )}
            <Container className="p-lg-2 mb-5">
                <Row xs={1} md={1} lg={1} className="d-flex justify-content-center">
                    <div className="col-lg-11 ">
                        <Tabs defaultActiveKey="table">
                            <Tab eventKey="table" title="Таблица" >
                                <Col>
                                    <Row >
                                        <DelaysTable data={delaysData} planDuration={planDuartion} />
                                    </Row>
                                </Col>
                            </Tab>
                            <Tab eventKey="bar" title="График">
                                <Container className="align-items-center justify-content-center" >
                                    <Row>
                                        <DelaysChart delays_data={delaysData} />
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
