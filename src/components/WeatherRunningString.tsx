import React, { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";

const WeatherString: React.FC = () => {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://rusmeteo.net/api/informerV2/47821b020fe18833e5bdf2b8c587ac25/';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        // <Container>
    <Row className="align-items-center" >
        <Col xs={2} lg={3} style={{ display: 'flex', alignItems: 'left' }}>
            <span style={{
                color: 'rgba(218, 218, 218)',             // Белый цвет текста
                fontSize: '12px',           // Уменьшенный размер шрифта
                backgroundColor: 'rgba(0, 0, 0, 0)', // прозрачный фон
                padding: '2px 8px',         // Отступы для читаемости
                borderRadius: '5px',        // Скругленные углы
                fontWeight: 'bold',         // Жирный текст
                letterSpacing: '1px',       // Межбуквенный интервал
            }}>
                Тольятти:
            </span>
        </Col>

        <Col xs={10} lg={9} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <link href="https://api.rusmeteo.net/service/informers/css/widget-ticker.min.css" rel="stylesheet" type="text/css" />
                <a href="https://rusmeteo.net/weather/tolyatti/" className="rus-widget-ticker" id="47821b020fe18833e5bdf2b8c587ac25" style={{ width: '500px', backgroundColor: 'rgba(0, 0, 0, 0)', color: 'rgba(218, 218, 218)' }}>
                    Погода
                </a>
            </div>
        </Col>
    </Row>
// </Container>




    );
}
export default WeatherString;