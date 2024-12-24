import { Col, Container, Navbar, Row } from "react-bootstrap";
import React from "react";
import WeatherString from "../WeatherRunningString";

const Footer = () => {
    return (
        <Container>
            <Navbar fixed="bottom" bg="dark" variant="dark" >
                <Row >
                    <Row className="justify-content-start ">
                    <Col sm={10} lg={8} xl={8}>
                        <WeatherString />
                    </Col>
                    </Row>
                    <Row className="justify-content-start ">

                        <Col sm={2} lg={4} xl={4}>
                            <Navbar.Text style={{ fontSize: '10px', marginTop: 'auto' }} >&copy; 2023-2025 Маклашев Артем</Navbar.Text>
                        </Col>
                    </Row>
                </Row>
            </Navbar>
        </Container>
    );
};

export default Footer;
