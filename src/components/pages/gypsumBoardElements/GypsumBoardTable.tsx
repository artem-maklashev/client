import React from 'react';
import GypsumBoardInputData from "../../../model/inputData/GypsumBoardInputData";

interface GypsumBoardTableProps {
    data: GypsumBoardInputData[];
}

const GypsumBoardTable: React.FC<GypsumBoardTableProps> = ({ data }) => {
    const calculateTotal = <K extends keyof GypsumBoardInputData>(property: K): number => {
        return data.reduce((total, item) => total + Number(item[property]), 0);
    };

    const calculatePercentageTotal = (): string => {
        const totalFact = calculateTotal('factValue');
        const totalTotal = calculateTotal('total');
        return totalTotal > 0 ? (((totalTotal - totalFact) * 100) / totalTotal).toFixed(2) + "%" : "0%";
    };

    const getDeviationColor = (value: number) => {
        return value < 0 ? 'text-danger' : 'text-success';
    };

    const getDefectSeverity = (percentage: number) => {
        if (percentage > 3) return 'high';
        if (percentage > 2) return 'medium';
        return 'low';
    };

    const TrafficLight = ({ severity }: { severity: 'high' | 'medium' | 'low' }) => {
        return (
            <div className="traffic-light-container">
                <div className={`traffic-light-dot ${severity === 'high' ? 'active bg-danger' : 'bg-secondary'}`} />
                <div className={`traffic-light-dot ${severity === 'medium' ? 'active bg-warning' : 'bg-secondary'}`} />
                <div className={`traffic-light-dot ${severity === 'low' ? 'active bg-success' : 'bg-secondary'}`} />
            </div>
        );
    };

    return (
        <div className="table-responsive rounded-lg shadow-sm border border-light">
            <style>{`
                .traffic-light-container {
                    display: flex;
                    gap: 6px;
                    align-items: center;
                }
                .traffic-light-dot {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    opacity: 0.2;
                }
                .traffic-light-dot.active {
                    opacity: 1;
                    box-shadow: 0 0 6px currentColor;
                }
            `}</style>
            
            <table className="table table-hover align-middle mb-0">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="ps-4 py-3 text-start fw-semibold text-muted small">Гипсокартон</th>
                        <th className="py-3 text-end fw-semibold text-muted small">План</th>
                        <th className="py-3 text-end fw-semibold text-muted small">Факт</th>
                        <th className="py-3 text-center fw-semibold text-muted small">Процент брака</th>
                        <th className="pe-4 py-3 text-end fw-semibold text-muted small">Отклонение</th>
                    </tr>
                </thead>
                <tbody>
                    {data.sort((a, b) => b.planValue - a.planValue).map((item, index) => {
                        const defectPercentage = item.total > 0 ? ((item.total - item.factValue) * 100 / item.total) : 0;
                        const deviation = item.factValue - item.planValue;
                        const defectSeverity = getDefectSeverity(defectPercentage);

                        return (
                            <tr key={index} className="border-top">
                                <td className="ps-4 fw-medium">{item.boardTitle}</td>
                                <td className="text-end">{item.planValue.toLocaleString()}</td>
                                <td className={`text-end fw-medium ${item.factValue >= item.planValue ? 'text-success' : 'text-danger'}`}>
                                    {item.factValue.toLocaleString()}
                                </td>
                                <td>
                                    {item.total > 0 ? (
                                        <div className="d-flex align-items-center justify-content-center gap-2">
                                            <span className={`fw-medium ${defectSeverity === 'high' ? 'text-danger' : defectSeverity === 'medium' ? 'text-warning' : 'text-success'}`}>
                                                {defectPercentage.toFixed(2)}%
                                            </span>
                                            <TrafficLight severity={defectSeverity} />
                                        </div>
                                    ) : (
                                        <span className="text-muted">---</span>
                                    )}
                                </td>
                                <td className={`pe-4 text-end fw-medium ${getDeviationColor(deviation)}`}>
                                    {deviation.toFixed(2)}
                                </td>
                            </tr>
                        );
                    })}
                    <tr className="border-top bg-light fw-bold">
                        <td className="ps-4">Итого</td>
                        <td className="text-end">{calculateTotal('planValue').toLocaleString()}</td>
                        <td className={`text-end ${calculateTotal('factValue') >= calculateTotal('planValue') ? 'text-success' : 'text-danger'}`}>
                            {calculateTotal('factValue').toLocaleString()}
                        </td>
                        <td>
                            <div className="d-flex align-items-center justify-content-center gap-2">
                                <span className={`fw-medium ${getDefectSeverity(Number(calculatePercentageTotal().replace('%',''))) === 'high' ? 'text-danger' : 
                                    getDefectSeverity(Number(calculatePercentageTotal().replace('%',''))) === 'medium' ? 'text-warning' : 'text-success'}`}>
                                    {calculatePercentageTotal()}
                                </span>
                                <TrafficLight severity={getDefectSeverity(Number(calculatePercentageTotal().replace('%','')))} />
                            </div>
                        </td>
                        <td className={`pe-4 text-end ${getDeviationColor(calculateTotal('factValue') - calculateTotal('planValue'))}`}>
                            {(calculateTotal('factValue') - calculateTotal('planValue')).toFixed(2)}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default GypsumBoardTable;