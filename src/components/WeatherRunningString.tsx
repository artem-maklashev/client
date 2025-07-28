import React, { useEffect } from "react";
import { Col, Row } from "react-bootstrap";

const WeatherString: React.FC = () => {
    useEffect(() => {
        const link = document.createElement('link');
        link.href = 'https://api.rusmeteo.net/service/informers/css/widget-ticker.min.css';
        link.rel = 'stylesheet';
        link.type = 'text/css';
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = 'https://rusmeteo.net/api/informerV2/47821b020fe18833e5bdf2b8c587ac25/';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.head.removeChild(link);
            document.body.removeChild(script);
        };
    }, []);

    return (
       <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
    <span style={{ whiteSpace: 'nowrap', color: '#dadada', fontSize: '12px' }}>Тольятти:</span>
    <a 
        href="https://rusmeteo.net/weather/tolyatti/" 
        className="rus-widget-ticker" 
        id="47821b020fe18833e5bdf2b8c587ac25"
        style={{ 
            backgroundColor: 'transparent', 
            color: 'rgba(218, 218, 218, 0.9)',
            fontSize: '10px',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
        }}
    >
        Погода
    </a>
</div>


    );
}

export default WeatherString;