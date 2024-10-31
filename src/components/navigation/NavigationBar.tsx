import React, { useState } from "react";
import { Nav, Navbar, NavbarBrand, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getUserRole } from "../../service/Api";

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
    const [expanded, setExpanded] = useState(false);

    const handleNavClose = () => setExpanded(false);
    return (
        <Navbar expand="lg" className="bg-body-tertiary fixed-top mb-5" bg="dark" data-bs-theme="dark" expanded={expanded} >        
            <div className="container-fluid">
                <NavbarBrand as={Link} to="/">Декоратор</NavbarBrand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setExpanded(!expanded)} />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/" onClick={handleNavClose}>Home</Nav.Link>
                        <NavDropdown title="Гипсокартон" id="board-dropdown">
                            <NavDropdown.Item as={Link} to="/dashBoard" onClick={handleNavClose} disabled={
                                // getUserRole() === 'ADMIN' ? false : true}
                                false}
                                >Основные показатели</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/plan" onClick={handleNavClose}>План</NavDropdown.Item>
                            <NavDropdown.Divider></NavDropdown.Divider>
                            <NavDropdown.Item as={Link} to="/board" onClick={handleNavClose}>Производство</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/boardDelays" onClick={handleNavClose}>Простои</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/boardDefects" onClick={handleNavClose}>Брак</NavDropdown.Item>
                        </NavDropdown>

                        <NavDropdown title="Выпуск ГСП" id="board-production" disabled={(getUserRole() === 'ADMIN' || getUserRole() === 'USER') ? false : true}>
                            <NavDropdown.Item as={Link} to="/boardReport" onClick={handleNavClose}>Добавить выпуск</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/findReport" onClick={handleNavClose} disabled={
                                getUserRole() === 'ADMIN' ? false : true}>Найти выпуск</NavDropdown.Item > 
                            <NavDropdown.Item as={Link} to="/consumptionReport" onClick={handleNavClose}>Справка по расходу материалов</NavDropdown.Item>
                        </NavDropdown> 
                        <NavDropdown title="Сухие смеси" id="mix-production" disabled={(getUserRole() === 'ADMIN' || getUserRole() === 'USER') ? false : true} >
                            <NavDropdown.Item as={Link} to="/mixReport" onClick={handleNavClose}>Отчет</NavDropdown.Item>
                            <NavDropdown.Divider></NavDropdown.Divider>
                            <NavDropdown.Item as={Link} to="/mixProduction" onClick={handleNavClose} disabled={getUserRole()==='VIEWER'}>Выпуск смесей</NavDropdown.Item>
                            <NavDropdown.Divider></NavDropdown.Divider>
                            <NavDropdown.Item as={Link} to="/mixPlan" onClick={handleNavClose} disabled={getUserRole()==='VIEWER'}>План</NavDropdown.Item>                        </NavDropdown>


                        {/* <Nav.Link as={Link} to="/boardReport" disabled={false} onClick={handleNavClose}>Выпуск ГСП</Nav.Link> */}
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
