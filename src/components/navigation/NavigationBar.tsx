import React from "react";
import { Button, Form, FormControl, Nav, Navbar, NavbarBrand, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

interface NavigationBarProps {
    tokenValid?: boolean; // Пропс для проверки валидности токена
    onLogout: () => void; // Пропс для функции выхода из системы
}

function NavigationBar({ tokenValid, onLogout }: NavigationBarProps) {
    const handleLogout = () => {
        // localStorage.removeItem('authToken'); // Удаление токена при выходе
        // alert("Вы вышли из системы");
        onLogout(); // Вызываем функцию выхода из системы
    };

    return (
        <Navbar expand="lg" className="bg-body-tertiary fixed-top mb-5" bg="dark" data-bs-theme="dark" >        
            <div className="container-fluid">
                <NavbarBrand as={Link} to="/">Декоратор</NavbarBrand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        <NavDropdown title="Гипсокартон" id="board-dropdown">
                            <NavDropdown.Item as={Link} to="/board">Производство</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/boardDelays">Простои</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/boardDefects">Брак</NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link as={Link} to="/boardReport" disabled={false}>Выпуск ГСП</Nav.Link>
                        {tokenValid ? (
                            <Nav.Link as={Link} to="/login" onClick={handleLogout}>Logout</Nav.Link>
                        ) : (
                            <Nav.Link as={Link} to="/login">Login</Nav.Link>
                        )}
                    </Nav>
                    {/*<Form className="d-inline-flex">*/}
                    {/*    <FormControl type="text" placeholder="Search" className="mr-sm-2" />*/}
                    {/*    <Button variant="outline-success">Search</Button>*/}
                    {/*</Form>*/}
                </Navbar.Collapse>
            </div>
        </Navbar>
    );
}

export default NavigationBar;
