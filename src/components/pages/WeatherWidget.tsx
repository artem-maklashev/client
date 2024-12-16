import React, { useEffect } from 'react';
import { Col, Container } from 'react-bootstrap';

const WeeklyWeatherWidget: React.FC = () => {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://rusmeteo.net/api/informerV2/4b95f27d56601ace36314b6a9a706868/';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <Container>
            <Col>
                <link href="https://api.rusmeteo.net/service/informers/css/widget-column.min.css" rel="stylesheet" type="text/css" />
                <a href="https://rusmeteo.net/weather/tolyatti/weekly/" className="widget-column" id="4b95f27d56601ace36314b6a9a706868" style={{ width: 220, backgroundColor: 'rgb(0, 114, 181)', color: 'rgb(250, 250, 250)' }}>Погода</a>
            </Col>
        </Container>

    );
};

export default WeeklyWeatherWidget;
