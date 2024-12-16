import React, { useCallback, useState } from "react";
import Plan from "../../model/gypsumBoard/Plan";
import { Card, Col, Container, Row, Spinner } from "react-bootstrap";
import ApiService from "../../service/ApiService";
import BoardProduction from "../../model/production/BoardProduction";
import WeatherWidget from "./WeatherWidget";
import Preloader from "./commonElements/preloader";
import MyCard from "../../service/library/MyCard";
import MixMainPageCard from "./drymix/mixMainPageCard";

interface MainPageProps { }

const MainPage: React.FC<MainPageProps> = () => {
    const [boardPlanData, setBoardPlanData] = useState<Plan[]>([]);
    const [errorText, setErrorText] = useState<string | null>(null);
    const [boardProductionData, setBoardProductionData] = useState<BoardProduction[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchPlan = useCallback(async () => {
        setLoading(true);
        try {
            const data = await ApiService.fetchTodayPlan();
            setErrorText(null);
            setBoardPlanData(data);
        } catch (error: any) {
            setErrorText(error.message);
            setBoardPlanData([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchBoardProduction = useCallback(async () => {
        setLoading(true);
        try {
            const data = await ApiService.fetchTodayBoardProduction();
            setErrorText(null);
            setBoardProductionData(data);
        } catch (error: any) {
            setErrorText(error.message);
            setBoardProductionData([]);
        } finally {
            setLoading(false);
        }
    }, []);

    React.useEffect(() => {

        const fetchData = async () => {
            await fetchPlan();
            await fetchBoardProduction();
        };

        fetchData();
    }, [fetchPlan, fetchBoardProduction]);

    const plan = boardPlanData.reduce((acc, plan) => acc + plan.planValue, 0);

    const sortedBoardProduction = boardProductionData.filter(
        (board) => board.category.id < 5
    );
    const todayPlan = boardPlanData.filter(
        (plan) => new Date(plan.planDate).toDateString() === new Date(getCurrentDate()).toDateString()
    );

    const toTodayPlan = boardPlanData
        .filter((plan) => new Date(plan.planDate) < new Date(getCurrentDate()))
        .reduce((acc, plan) => acc + plan.planValue, 0);

    const { total, value } = sortedBoardProduction.reduce(
        (acc, board) => {
            const isCategory1 = board.category.id === 1;
            if (isCategory1) {
                acc.total += board.value;
            } else {
                acc.value += board.value;
            }
            return acc;
        },
        { total: 0, value: 0 }
    );

    const defectPercentResult =
        total === 0 ? 0 : ((total - value) / total) * 100;

    function getCurrentDate(): string {
        const now = new Date();
        const year = now.getUTCFullYear();
        const month = (now.getUTCMonth() + 1).toString().padStart(2, "0");
        const day = now.getUTCDate().toString().padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    function getDeviation(): string {
        const deviation = value - toTodayPlan;
        return deviation > 0
            ? `опережение на ${deviation.toFixed(0)} м²`
            : `отставание ${Math.abs(deviation).toFixed(0)} м²`;
    }

    return (
        <div style={{ backgroundColor: '#7fc7ff', minHeight: '100vh', width: '100%' }}>
            <Container className="mt-5 mb-5" fluid style={{ backgroundColor: '#7fc7ff' }}>
                <Row className="mt-5 justify-content-center text-center">
                    <h2 className="mt-3 mb-3">Показатели за текущий месяц</h2>
                    {loading && (
                        <Preloader />
                    )}
                    <Col className="mt-3 col-lg-2 col-sm-6">
                        <MyCard value={<WeatherWidget />} />
                    </Col>

                    <Col className="mt-3 col-lg-3 col-sm-12 align-items-center">
                        <MyCard label='Производство ГСП' value={
                            <div className="mt-5">
                                <MyCard label={"План на текущий месяц"} value={plan ? (plan + " м²") : <Spinner />} />
                                <MyCard label="Изготовлено" value={value ? (value.toFixed(0) + " м²") : <Spinner />} />
                                <MyCard label="Отклонение" value={(value && toTodayPlan) ? getDeviation() : <Spinner />} valueColor={(value - toTodayPlan) < 0 ? '#ff3333 ' : '#B3E5B3'} />
                                <MyCard label="Процент брака" value={defectPercentResult ? defectPercentResult.toFixed(2) + " %" : <Spinner />} valueColor={(defectPercentResult) > 3 ? '#FF7F7F ' : '#2E8B57'} />
                                <MyCard label="Запланированное производство" value={
                                    todayPlan.length > 0 ? (
                                        <table className="table table-sm mt-1 table-striped table-bordered">
                                            <thead className="table-dark">
                                                <tr>
                                                    <th>Гипсокартон</th>
                                                    <th>Количество</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {todayPlan.map((board) => (
                                                    <tr key={board.gypsumBoard.id}>
                                                        <td>
                                                            {board.gypsumBoard.tradeMark.name} тип{" "}
                                                            {board.gypsumBoard.boardType.name}-{board.gypsumBoard.edge.name}{" "}
                                                            {board.gypsumBoard.thickness.value}-
                                                            {board.gypsumBoard.width.value}-
                                                            {board.gypsumBoard.length.value}
                                                        </td>
                                                        <td>{board.planValue} м²</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <p style={{ fontSize: 12 }}>На сегодня производство не запланировано.</p>
                                    )
                                } />
                            </div>

                        }
                            labelFontSize="14px"
                            labelAlign="center"
                            labelPosition={{ top: '-5px', left: '50px' }}
                        />
                    </Col>
                    <Col className="mt-3 col-lg-3 col-sm-12 align-items-center">
                        <MixMainPageCard />
                    </Col>
                </Row>
                {/* Пример добавления видео */}
                {/* <Row className="justify-content-center mt-3">
                <Col className="col-6">
                    <iframe
                        title="Баста"
                        src="https://vk.com/video_ext.php?oid=219613407&id=456239359&hd=2&autoplay=0"
                        width="853"
                        height="480"
                        allow="autoplay; encrypted-media; fullscreen; picture-in-picture; screen-wake-lock;"
                    ></iframe>
                </Col>
            </Row> */}
            </Container>
        </div>
    );
};

export default MainPage;


