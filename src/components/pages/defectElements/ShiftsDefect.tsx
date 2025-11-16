import BoardProduction from "../../../model/production/BoardProduction";
import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import DefectsDataPrepare from "./DefectsDataPrepare";
import BoardDefectsLog from "../../../model/defects/BoardDefectsLog";
import NotQulaty from "./notQulaty";

interface ShiftsDefectProps {
    defectsLog: BoardDefectsLog[];
    data: BoardProduction[];
}

class ProductionByShift {
    total: number;
    goodProduct: number;

    constructor(total: number, goodProduct: number) {
        this.total = total;
        this.goodProduct = goodProduct;
    }
}

const ShiftsDefect: React.FC<ShiftsDefectProps> = ({ defectsLog, data }) => {
    if (data.length === 0 && defectsLog.length === 0) {
        return (
            <div style={{
                textAlign: 'center',
                padding: '2rem',
                color: '#64748b',
                fontSize: '1.1rem',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                border: '1px dashed #cbd5e1'
            }}>                
                Нет данных для отображения
            </div>
        );
    }

    const preparedDefects = new DefectsDataPrepare(defectsLog, data);
    const productionDictRaw: { [shift: string]: ProductionByShift } = preparedDefects.getProductionDict();
    const categorySummaryRaw: { [categoryName: string]: number } = preparedDefects.getCategorySummary();

    const productionDict = Object.entries(productionDictRaw)
        .sort((a, b) => (a[1].goodProduct / a[1].total) - (b[1].goodProduct / b[1].total));
    
    const categorySummary = Object.entries(categorySummaryRaw)
        .sort((a, b) => b[1] - a[1]);
    
    const productionDictSummary = () => {
        let good = 0;
        let total = 0;
        productionDict.forEach(item => {
            good += item[1].goodProduct;
            total += item[1].total;
        });
        return (1 - good / total) * 100;
    };
    
    const summaryPercent = productionDictSummary();
    
    // Вычисляем итоговое количество для второй таблицы
    const totalDefects = categorySummary.reduce((acc: number, [, value]) => acc + value, 0) + 
                        defectsLog.reduce((acc, defect) => acc + defect.value, 0);

    // Современные стили для карточки
    const cardStyle: React.CSSProperties = {
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.02)',
        overflow: 'hidden',
        border: '1px solid #e2e8f0',
        marginBottom: '1.5rem'
    };

    // Современные стили для заголовка таблицы
    const tableHeaderStyle: React.CSSProperties = {
        padding: '1.25rem',
        borderBottom: '1px solid #e2e8f0',
        backgroundColor: '#f8fafc'
    };

    // Современные стили для заголовка колонок
    const columnHeaderStyle: React.CSSProperties = {
        fontWeight: 600,
        color: '#334155',
        fontSize: '0.875rem',
        textTransform: 'uppercase',
        letterSpacing: '0.025em'
    };

    return (
        <Container style={{ padding: '1rem' }}>
            <Row className="justify-content-center">
                <Col md={6} lg={4} style={{ marginBottom: '1.5rem' }}>
                    <div style={cardStyle}>
                        <div style={tableHeaderStyle}>
                            <h3 style={{
                                margin: 0,
                                fontSize: '1.125rem',
                                fontWeight: 600,
                                color: '#1e293b',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem'
                            }}>
                                <i className="bi bi-clipboard2-pulse"></i>
                                Процент брака по сменам
                            </h3>
                        </div>
                        
                        <div style={{ padding: '0' }}>
                            <table style={{ 
                                width: '100%', 
                                borderCollapse: 'collapse',
                                fontSize: '0.9rem'
                            }}>
                                <thead>
                                    <tr style={{ 
                                        borderBottom: '2px solid #e2e8f0',
                                        backgroundColor: '#f8fafc'
                                    }}>
                                        <th style={{ 
                                            ...columnHeaderStyle,
                                            padding: '1rem',
                                            textAlign: 'left'
                                        }}>
                                            Смена
                                        </th>
                                        <th style={{ 
                                            ...columnHeaderStyle,
                                            padding: '1rem',
                                            textAlign: 'right'
                                        }}>
                                            Процент брака
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productionDict.map(([shift, productionData], index) => {
                                        const defectPercent = (1 - productionData.goodProduct / productionData.total) * 100;
                                        // Определяем цвет в зависимости от процента брака
                                        let backgroundColor = '#ffffff';
                                        if (defectPercent > 10) {
                                            backgroundColor = '#fee2e2'; // красный фон для высокого процента
                                        } else if (defectPercent > 3) {
                                            backgroundColor = '#ffedd5'; // оранжевый фон для среднего процента
                                        }
                                        
                                        return (
                                            <tr 
                                                key={shift} 
                                                style={{ 
                                                    borderBottom: '1px solid #f1f5f9',
                                                    backgroundColor: backgroundColor,
                                                    transition: 'background-color 0.2s'
                                                }}
                                            >
                                                <td style={{ 
                                                    padding: '1rem',
                                                    fontWeight: 500,
                                                    color: '#334155'
                                                }}>
                                                    {shift}
                                                </td>
                                                <td style={{ 
                                                    padding: '1rem',
                                                    textAlign: 'right',
                                                    fontWeight: defectPercent > 5 ? 700 : 500,
                                                    color: defectPercent > 10 ? '#dc2626' : 
                                                           defectPercent > 5 ? '#ea580c' : '#1e293b'
                                                }}>
                                                    {defectPercent.toFixed(2)}%
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                                <tfoot>
                                    <tr style={{ 
                                        borderTop: '2px solid #cbd5e1',
                                        backgroundColor: '#f1f5f9'
                                    }}>
                                        <td style={{ 
                                            padding: '1rem',
                                            fontWeight: 700,
                                            color: '#1e293b'
                                        }}>
                                            ИТОГО:
                                        </td>
                                        <td style={{ 
                                            padding: '1rem',
                                            textAlign: 'right',
                                            fontWeight: 700,
                                            color: summaryPercent > 10 ? '#dc2626' : 
                                                   summaryPercent > 5 ? '#ea580c' : '#1e293b'
                                        }}>
                                            {summaryPercent.toFixed(2)}%
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </Col>
                
                <Col md={7}>
                    <div style={cardStyle}>
                        <div style={tableHeaderStyle}>
                            <h3 style={{
                                margin: 0,
                                fontSize: '1.125rem',
                                fontWeight: 600,
                                color: '#1e293b',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem'
                            }}>
                               <i className="bi bi-receipt-cutoff"></i>
                                Виды брака
                            </h3>
                        </div>
                        
                        <div style={{ padding: '0' }}>
                            <table style={{ 
                                width: '100%', 
                                borderCollapse: 'collapse',
                                fontSize: '0.9rem'
                            }}>
                                <thead>
                                    <tr style={{ 
                                        borderBottom: '2px solid #e2e8f0',
                                        backgroundColor: '#f8fafc'
                                    }}>
                                        <th style={{ 
                                            ...columnHeaderStyle,
                                            padding: '1rem',
                                            textAlign: 'left'
                                        }}>
                                            Виды брака
                                        </th>
                                        <th style={{ 
                                            ...columnHeaderStyle,
                                            padding: '1rem',
                                            textAlign: 'right'
                                        }}>
                                            Количество, м²
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categorySummary.map(([category, value], index) => (
                                        <tr 
                                            key={category} 
                                            style={{ 
                                                borderBottom: '1px solid #f1f5f9',
                                                transition: 'background-color 0.2s'
                                            }}
                                        >
                                            <td style={{ 
                                                padding: '1rem',
                                                fontWeight: 500,
                                                color: '#334155'
                                            }}>
                                                {category}
                                            </td>
                                            <td style={{ 
                                                padding: '1rem',
                                                textAlign: 'right',
                                                fontWeight: 500,
                                                color: '#1e293b'
                                            }}>
                                                {value.toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr style={{ 
                                        borderTop: '2px solid #cbd5e1',
                                        backgroundColor: '#f1f5f9'
                                    }}>
                                        <td style={{ 
                                            padding: '1rem',
                                            fontWeight: 700,
                                            color: '#1e293b'
                                        }}>
                                            ИТОГО:
                                        </td>
                                        <td style={{ 
                                            padding: '1rem',
                                            textAlign: 'right',
                                            fontWeight: 700,
                                            color: '#1e293b'
                                        }}>
                                            {totalDefects.toFixed(2)} м²
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </Col>
            </Row>
            <Row >
                <Col className="col-12 d-flex justify-content-center">
                    <NotQulaty productionData={data} />
                </Col>
            </Row>
        </Container>
    );
};

export default ShiftsDefect;