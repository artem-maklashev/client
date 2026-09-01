import React from 'react';
import { Card } from 'react-bootstrap';

interface KpiCardProps {
    title: string;
    value: React.ReactNode;
    colorClass?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, colorClass = "text-dark" }) => {
    return (
        <Card 
            className="h-100 border-0 shadow-sm rounded-4" 
            style={{ backgroundColor: '#fff9f4' }}
        >
            <Card.Body className="d-flex flex-column justify-content-center p-3">
                <Card.Subtitle 
                    className="mb-2 text-muted fw-semibold text-break" 
                    style={{ fontSize: '0.75rem', letterSpacing: '0.5px', lineHeight: '1.2' }}
                >
                    {title.toUpperCase()}
                </Card.Subtitle>
                <div 
                    className={`fs-4 fw-bold mb-0 ${colorClass}`} 
                    style={{ wordBreak: 'break-word', lineHeight: '1.2' }}
                >
                    {value}
                </div>
            </Card.Body>
        </Card>
    );
};

export default KpiCard;