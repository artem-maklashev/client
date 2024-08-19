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
        return totalTotal > 0 ? (((totalTotal - totalFact) * 100) / totalTotal).toFixed(2) + "%" : "0";
    };

    return (
        <div className="table-responsive-sm">
            <table className="table table-sm table-bordered table-hover table-auto table-light table-striped" id="gypsumBoardTable">
                <thead className="table-dark" >
                    <tr >
                        <th>Гипсокартон</th>
                        <th>План</th>
                        <th>Факт</th>
                        <th>Процент брака</th>
                        <th>Отклонение</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            <td>{item.boardTitle}</td>
                            <td>{item.planValue}</td>
                            <td>{item.factValue}</td>
                            <td>{item.total > 0 ? ((item.total - item.factValue) * 100 / item.total).toFixed(2) + "%" : "---"}</td>
                            <td align="right" style={{ color: (item.factValue - item.planValue) < 0 ? 'red' : 'inherit' }}>
                                {(item.factValue - item.planValue).toFixed(2)}
                            </td>

                        </tr>
                    ))}
                    <tr>
                        <td><strong>Итого</strong></td>
                        <td><strong>{calculateTotal('planValue').toFixed(2)}</strong></td>
                        <td><strong>{calculateTotal('factValue').toFixed(2)}</strong></td>
                        <td><strong>{calculatePercentageTotal()}</strong></td>
                        <td align="right"><strong>{(calculateTotal('factValue') - calculateTotal('planValue')).toFixed(2)}</strong></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default GypsumBoardTable;
