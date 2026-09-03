import { Col, Container, Navbar, Row } from "react-bootstrap";
import React from "react";
import WeatherString from "../WeatherRunningString";
import WeatherWidget from "../pages/WeatherWidget";
import {  WeatherTickerSDK } from "../pages/WeatherTicker";

const Footer = () => {
    return (
        <Container>
            <Navbar fixed="bottom" bg="dark" variant="dark" className="py-0"> {/* Уменьшаем padding */}
                <Container fluid>
                    <Row className="w-100 align-items-center"> {/* Добавляем выравнивание */}
                        <Col xs={12} sm={8} lg={8} className="pe-0"> {/* Убираем margin и padding */}
                            <div
                                className="d-flex justify-content-center align-items-center"
                                style={{ height: "100%" }}
                            >
                                {/* <WeatherWidget /> */}
                                <WeatherTickerSDK />
                            </div>
                        </Col>
                        <Col xs={12} sm={4} lg={4} className="text-sm-end text-center ps-0"> {/* Убираем лишние отступы */}
                            <Navbar.Text
                                style={{
                                    fontSize: "10px",
                                    color: "rgba(255, 255, 255, 0.7)",
                                    lineHeight: "1.5"
                                }}
                            >
                                <div>&copy; 2023-2026 Маклашев Артем</div>
                                <div>
                                    <a
                                        href="mailto:ar.maclashev@yandex.ru"
                                        style={{ color: "rgba(255, 255, 255, 0.7)" }}
                                    >
                                        ar.maclashev@yandex.ru
                                    </a>
                                </div>
                            </Navbar.Text>
                        </Col>
                    </Row>
                </Container>
            </Navbar>
        </Container>
    );
};

export default Footer;