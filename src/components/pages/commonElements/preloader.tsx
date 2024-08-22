import React from "react";
import { Card, Col, Row } from "react-bootstrap";

const Preloader: React.FC = () => {
    return (
        <Row className="preloader-wrapper ">
            <Col className="d-flex justify-content-center align-items-center">
                <Card>
                    <Card.Body>
                        <h5>Получаем данные</h5>
                        <span className="preloader"></span>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
}
export default Preloader;