import React, {  } from "react";
import { Col, Container, Row } from "react-bootstrap";
import WeatherWidget from "./WeatherWidget";
import MyCard from "../../service/library/MyCard";
import MixMainPageCard from "./drymix/mixMainPageCard";
import BoardMainPageCard from "./gypsumBoardElements/boardsMainPageCard";

interface MainPageProps { }

const MainPage: React.FC<MainPageProps> = () => {    

return (
    <div style={{ backgroundColor: '#7fc7ff', minHeight: '100vh', width: '100%' }}>
        <Container className="mt-5 mb-5" fluid style={{ backgroundColor: '#7fc7ff' }}>
            <Row className="mt-5 mb-5 justify-content-center text-center">

                <h2 className="mt-2 mb-2 text-center">
                    Показатели за текущий месяц
                </h2>                
                {/* <Col className="mt-3 col-lg-2 col-sm-6">
                    <MyCard value={<WeatherWidget />} />
                </Col> */}

                <Col className="mt-3 col-lg-3 col-sm-12 align-items-center">
                    <BoardMainPageCard />
                </Col>
                <Col className="mt-3 col-lg-3 col-sm-12  align-items-center">
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


