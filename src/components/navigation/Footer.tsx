import { Container, Navbar } from "react-bootstrap";
import React from "react";
import WeatherString from "../WeatherRunningString";

const Footer = () => {
    return (
        <Container>
            <Navbar fixed="bottom" bg="dark" variant="dark" className="justify-content-end">
                <WeatherString />
                <Navbar.Brand >&copy; 2023-2025 Маклашев Артем</Navbar.Brand>
            </Navbar>
        </Container>
    );
};

export default Footer;
