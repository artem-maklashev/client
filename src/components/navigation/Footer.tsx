import { Container, Navbar } from "react-bootstrap";
import React from "react";

const Footer = () => {
    return (
        <Container>
            <Navbar fixed="bottom" bg="dark" variant="dark" className="justify-content-end">
                <Navbar.Brand >&copy; 2023-2024 Маклашев Артем</Navbar.Brand>
            </Navbar>
        </Container>
    );
};

export default Footer;
