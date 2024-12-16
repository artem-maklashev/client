
import React, { useEffect, useState } from "react"
import DayRangeSelector from "./dashBoardComponent/dateRangeSelector";
import { Col, Container, Row, Tab, Tabs } from "react-bootstrap";
import ApiService from "../../service/ApiService";
import Plan from "../../model/gypsumBoard/Plan";
import PlanFactChart from "./dashBoardComponent/planFactChart";
import BoardProduction from "../../model/production/BoardProduction";
import Speedometr from "./dashBoardComponent/speedometr";
import BatteryChart from "./dashBoardComponent/batteryChart";
import EdgesAndThikness from "./dashBoardComponent/edgesAndThickness";
import Delays from "../../model/delays/Delays";
import DelaysChartBoard from "./dashBoardComponent/delaysChart";
import ShiftDefects from "./dashBoardComponent/shiftDefects";
import Preloader from "./commonElements/preloader";
import MonthRangeSelector from "./dashBoardComponent/monthRangeSelector";
import PlanFactChartByMonth from "./dashBoardComponent/planFactChartByMonth";
import DelaysMonthChartBoard from "./dashBoardComponent/delaysMonthChart";
import ProductivityChart from "./dashBoardComponent/productivityChart";

interface DashBoardProps {

}
const now = new Date(ApiService.formatDateToISO(new Date()));
const DashBoard: React.FC<DashBoardProps> = () => {
    const [selectedRange, setSelectedRange] = useState<{ startDate: Date | null, endDate: Date | null }>({
        startDate: new Date(now.getFullYear(), now.getMonth(), 1),
        endDate: now
    });
    const [planData, setPlanData] = useState<Plan[]>([]);
    const [productionData, setProductionData] = useState<BoardProduction[]>([]);
    const [allProductionData, setAllProductionData] = useState<BoardProduction[]>([]);
    const [delays, setDelays] = useState<Delays[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedMonthRange, setSelectedMonthRange] = useState<{ startDate: Date | null, endDate: Date | null }>({
        startDate: new Date(now.getFullYear(), now.getMonth(), 1),
        endDate: new Date(now.getFullYear(), now.getMonth() + 1, 0)
    });

    //Для вкладки по месяцам
    const [planMonthData, setPlanMonthData] = useState<Plan[]>([]);
    const [productionMonthData, setProductionMonthData] = useState<BoardProduction[]>([]);
    const [allProductionMonthData, setAllProductionMonthData] = useState<BoardProduction[]>([]);
    const [delaysMonth, setDelaysMonth] = useState<Delays[]>([]);
    const [activeTab, setActiveTab] = useState<string | undefined>('1');


    function handleDatesChange(startDate: Date | null, endDate: Date | null): void {
        setSelectedRange({ startDate, endDate });
    }

    function filterBoardProductions(boardProductions: BoardProduction[]): BoardProduction[] {
        const filtered = boardProductions.filter((bp) => bp.category.id === 2 || bp.category.id === 3 || bp.category.id === 4);
        return filtered;
    }



    useEffect(() => {
        setProductionData([]);
        setPlanData([]);
        setAllProductionData([]);
        setDelays([]);
        const fetchData = async () => {
            setLoading(true);
            try {
                if (selectedRange.startDate !== null && selectedRange.endDate !== null) {
                    // console.log(selectedRange.startDate);
                    const fetchedPlan = await ApiService.fetchPlan(selectedRange.startDate, selectedRange.endDate);
                    console.log("Получен план в размере " + fetchedPlan.length + " записей");
                    setPlanData(fetchedPlan);
                    const fetchedProduction = await ApiService.fetchBoardProduction(selectedRange.startDate, selectedRange.endDate);
                    console.log("Получены данные по производству в размере " + fetchedProduction.length);
                    setAllProductionData(fetchedProduction);
                    const production = filterBoardProductions(fetchedProduction);
                    setProductionData(production);
                    const fetchedDelays = await ApiService.fetchDelaysData(selectedRange.startDate, selectedRange.endDate);
                    setDelays(fetchedDelays);
                }
            } catch (error: any) {
                console.error(`Произошла ошибка: ${error.message}`);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [selectedRange])

    useEffect(() => {
        setProductionMonthData([]);
        setPlanMonthData([]);
        setAllProductionMonthData([]);
        setDelaysMonth([]);
        const fetchData = async () => {
            setLoading(true);
            if (selectedMonthRange.startDate !== null && selectedMonthRange.endDate !== null) {
                try {
                    // console.log(selectedRange.startDate);
                    const fetchedPlan = await ApiService.fetchPlan(selectedMonthRange.startDate, selectedMonthRange.endDate);
                    console.log("Получен план в размере " + fetchedPlan.length + " записей");
                    setPlanMonthData(fetchedPlan);
                    const fetchedProduction = await ApiService.fetchBoardProduction(selectedMonthRange.startDate, selectedMonthRange.endDate);
                    console.log("Получены данные по производству в размере " + fetchedProduction.length);
                    setAllProductionMonthData(fetchedProduction);
                    const production = filterBoardProductions(fetchedProduction);
                    setProductionMonthData(production);
                    const fetchedDelays = await ApiService.fetchDelaysData(selectedMonthRange.startDate, selectedMonthRange.endDate);
                    setDelaysMonth(fetchedDelays);
                }
                catch (error: any) {
                    console.error(`Произошла ошибка: ${error.message}`);
                } finally {
                    setLoading(false);
                }
            }
        }
        fetchData();
    }, [selectedMonthRange]);

    const handleTabSelect = (key: string | null) => {
        // Приводим ключ к строке или undefined
        setActiveTab(key ?? undefined);
    };

    const uniqueTradeMarks = productionData.reduce((acc, curr) => {
        if (!acc.includes(curr.product.tradeMark.name)) {
            acc.push(curr.product.tradeMark.name);
        }
        return acc;
    }, [] as string[]);

    const colWidth = 12 / uniqueTradeMarks.length;

    function handleMonthChange(startDate: Date | null, endDate: Date | null): void {
        if (startDate && endDate) {
            setSelectedMonthRange({ startDate, endDate });
        }
    }

    return (
        <Container fluid className="mt-5 mb-5 bg-secondary">
            <Row>
                <Tabs activeKey={activeTab} onSelect={handleTabSelect} className="mt-5">
                    <Tab eventKey={1} title="По дням">
                        <Row className="mt-5">
                            {loading && (
                                <Preloader />
                            )}
                        </Row>
                        <Row lg={12} sm={12} md={12}>
                            <Col className="col-lg-3 col-md-6 col-sm-6 mb-2">
                                <Row>
                                    <DayRangeSelector onDatesChange={handleDatesChange} />
                                </Row>
                                <Row>
                                    <Speedometr productionData={allProductionData} />
                                </Row>
                                <Row>
                                    <BatteryChart planData={planData} factData={productionData} />
                                </Row>
                                <Row>
                                    <ShiftDefects shiftProduction={allProductionData} />
                                </Row>
                            </Col>
                            <Col lg={9} sm={12} className="mb-5">
                                <Row>
                                    <Col >
                                        <PlanFactChart planData={planData} productionData={productionData} allProductionData={allProductionData} />
                                    </Col>
                                </Row>
                                <Row>
                                    <ProductivityChart productions={allProductionData} delays={delays} />                              </Row>
                                <Row>
                                    {uniqueTradeMarks.map(tradeMark => {
                                        const data = productionData.filter(prod => prod.product.tradeMark.name === tradeMark);
                                        return (
                                            <Col key={tradeMark} lg={colWidth} sm={12}>
                                                <EdgesAndThikness allProductionData={data} tradeMark={tradeMark} />
                                            </Col>
                                        );
                                    })}
                                </Row>
                                <Row>
                                    <Col>
                                        <DelaysChartBoard delays={delays} />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Tab>
                    <Tab eventKey={2} title="По месяцам" mountOnEnter unmountOnExit>
                        {activeTab === '2' &&
                            <Row>
                                <Row className="mt-5">
                                    {loading && (
                                        <Preloader />
                                    )}
                                </Row>
                                <Row lg={12} sm={12} md={12}>
                                    <Col className="col-lg-3 col-md-12 col-sm-12 mb-2">
                                        <Row>
                                            <Col className="col-6">
                                                <MonthRangeSelector onDatesChange={handleMonthChange} />
                                            </Col>
                                            <Col className="col-6">
                                                <Speedometr productionData={allProductionMonthData} />
                                            </Col>
                                        </Row>
                                        <Row >
                                            <Col className="col-lg-12 col-sm-6">
                                                <BatteryChart planData={planMonthData} factData={productionMonthData} />
                                            </Col>
                                        
                                            <Col className="col-lg-12 col-sm-6">
                                                <ShiftDefects shiftProduction={allProductionMonthData} />
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col lg={9} sm={12} >
                                        <Row>
                                            <Col >
                                                <PlanFactChartByMonth planData={planMonthData} productionData={productionMonthData} allProductionData={allProductionMonthData} />
                                            </Col>
                                        </Row>
                                        <Row>
                                            {uniqueTradeMarks.map(tradeMark => {
                                                const data = productionMonthData.filter(prod => prod.product.tradeMark.name === tradeMark);
                                                return (
                                                    <Col key={tradeMark} lg={colWidth} sm={12}>
                                                        <EdgesAndThikness allProductionData={data} tradeMark={tradeMark} />
                                                    </Col>
                                                );
                                            })}
                                        </Row>
                                        <Row>
                                            <Col>
                                                <DelaysMonthChartBoard delays={delaysMonth} />
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Row>}
                    </Tab>
                </Tabs>
            </Row>
        </Container>
    )
}
export default DashBoard;