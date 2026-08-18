import React, { useState, useEffect } from "react";
import { Card, Col, Row, ProgressBar } from "react-bootstrap";
import "./Preloader.scss";

const Preloader: React.FC = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + Math.random() * 10;
            });
        }, 200);

        return () => clearInterval(interval);
    }, []);

    return (
        <Row className="preloader-wrapper">
            <Col className="d-flex justify-content-center align-items-center">
                <Card className="preloader-card">
                    <Card.Body className="text-center">
                        <div className="logo-container">
                            <svg className="logo-spinner" viewBox="0 0 100 100">
                                <circle
                                    className="logo-circle"
                                    cx="50"
                                    cy="50"
                                    r="45"
                                    fill="none"
                                    stroke="#667eea"
                                    strokeWidth="4"
                                />
                                <path
                                    className="logo-path"
                                    d="M50 10 L50 90 M10 50 L90 50 M30 30 L70 70 M30 70 L70 30"
                                    stroke="#764ba2"
                                    strokeWidth="3"
                                />
                            </svg>
                        </div>
                        
                        <h5 className="loading-title">Загрузка</h5>
                        <p className="loading-subtitle">Пожалуйста, подождите...</p>
                        
                        <ProgressBar 
                            now={Math.min(progress, 100)} 
                            className="loading-progress"
                            variant="gradient"
                        />
                        <span className="progress-text">{Math.min(Math.round(progress), 100)}%</span>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default Preloader;