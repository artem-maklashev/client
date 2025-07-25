import BoardDefectsLog from "../../../model/defects/BoardDefectsLog";
import DefectsDataPrepare from "./DefectsDataPrepare";
import { Col, Table } from "react-bootstrap";
import React from "react";
import BoardProduction from "../../../model/production/BoardProduction";

interface DefectsTableProps {
    defectsLog: BoardDefectsLog[];
    data: BoardProduction[];
}

const DefectsTable: React.FC<DefectsTableProps> = ({ defectsLog, data }) => {
    if (data.length === 0) {
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
    const summaryDefects = preparedDefects.getSummary();
    
    // Преобразуем в массив и сортируем по убыванию
    const sortedDefects = Object.entries(summaryDefects)
        .sort(([,a], [,b]) => b - a);
    
    const totalCount = Object.values(summaryDefects).reduce((acc, value) => acc + value, 0);
    const maxCount = sortedDefects.length > 0 ? sortedDefects[0][1] : 0;

    return (
        <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.02)',
            overflow: 'hidden',
            border: '1px solid #e2e8f0'
        }}>
            <div style={{
                padding: '1.5rem',
                borderBottom: '1px solid #e2e8f0',
                backgroundColor: '#f8fafc'
            }}>
                <h3 style={{
                    margin: 0,
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    color: '#1e293b',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 20v-6M6 20V10M18 20V4"/>
                    </svg>
                    Анализ брака категории А
                </h3>
            </div>
            
            <div style={{ padding: '1.5rem' }}>
                <Table hover style={{ marginBottom: 0 }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                            <th style={{ 
                                width: '50%', 
                                fontWeight: 600, 
                                color: '#334155',
                                fontSize: '0.875rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.025em'
                            }}>
                                Виды брака
                            </th>
                            <th style={{ 
                                width: '15%', 
                                textAlign: 'right', 
                                fontWeight: 600, 
                                color: '#334155',
                                fontSize: '0.875rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.025em'
                            }}>
                                Количество, м²
                            </th>
                            <th style={{ 
                                width: '35%', 
                                fontWeight: 600, 
                                color: '#334155',
                                fontSize: '0.875rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.025em'
                            }}>
                                Доля
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedDefects.map(([defectType, count]) => {
                            const percentage = totalCount > 0 ? (count / totalCount) * 100 : 0;
                            const widthPercentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
                            
                            return (
                                <tr 
                                    key={defectType} 
                                    style={{ 
                                        borderBottom: '1px solid #f1f5f9',
                                        transition: 'background-color 0.2s'
                                    }}
                                >
                                    <td style={{ 
                                        fontWeight: 500, 
                                        color: '#334155',
                                        padding: '1rem 0.75rem'
                                    }}>
                                        {defectType}
                                    </td>
                                    <td style={{ 
                                        textAlign: 'right', 
                                        fontWeight: 600, 
                                        color: '#1e293b',
                                        padding: '1rem 0.75rem'
                                    }}>
                                        {count.toFixed(0)}
                                    </td>
                                    <td style={{ padding: '1rem 0.75rem' }}>
                                        <div style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: '0.75rem' 
                                        }}>
                                            <div style={{
                                                flex: 1,
                                                height: '8px',
                                                backgroundColor: '#e2e8f0',
                                                borderRadius: '4px',
                                                overflow: 'hidden'
                                            }}>
                                                <div 
                                                    style={{
                                                        height: '100%',
                                                        width: `${widthPercentage}%`,
                                                        backgroundColor: percentage > 50 ? '#ef4444' : 
                                                        percentage > 20 ? '#f59e0b' : '#10b981',
                                                        borderRadius: '4px',
                                                        transition: 'width 0.5s ease'
                                                    }}
                                                />
                                            </div>
                                            <div style={{ 
                                                width: '40px', 
                                                textAlign: 'right', 
                                                fontWeight: 600, 
                                                color: '#64748b',
                                                fontSize: '0.875rem'
                                            }}>
                                                {percentage.toFixed(1)}%
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                    <tfoot>
                        <tr style={{ 
                            borderTop: '2px solid #cbd5e1',
                            backgroundColor: '#f8fafc'
                        }}>
                            <td style={{ 
                                fontWeight: 700, 
                                color: '#1e293b',
                                padding: '1rem 0.75rem'
                            }}>
                                ИТОГО:
                            </td>
                            <td style={{ 
                                textAlign: 'right', 
                                fontWeight: 700, 
                                color: '#1e293b',
                                padding: '1rem 0.75rem'
                            }}>
                                {totalCount.toFixed(2)}
                            </td>
                            <td style={{ 
                                fontWeight: 700, 
                                color: '#1e293b',
                                padding: '1rem 0.75rem'
                            }}>
                                100%
                            </td>
                        </tr>
                    </tfoot>
                </Table>
            </div>
        </div>
    );
};

export default DefectsTable;