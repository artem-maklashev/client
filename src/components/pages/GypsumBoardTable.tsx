import React from 'react';
import GypsumBoardInputData from "../../model/inputData/GypsumBoardInputData";

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
       <div className="table-responsive rounded-3 shadow-sm mb-4">
  <table className="table table-hover align-middle mb-0" id="gypsumBoardTable">
    <thead className="bg-light">
      <tr>
        <th className="ps-4 py-3 fw-semibold text-uppercase text-muted small border-bottom">Гипсокартон</th>
        <th className="py-3 fw-semibold text-uppercase text-muted small border-bottom">План</th>
        <th className="py-3 fw-semibold text-uppercase text-muted small border-bottom">Факт</th>
        <th className="py-3 fw-semibold text-uppercase text-muted small border-bottom">Процент брака</th>
        <th className="pe-4 py-3 fw-semibold text-uppercase text-muted small border-bottom text-end">Отклонение</th>
      </tr>
    </thead>
    <tbody>
      {data.map((item, index) => {
        const defectPercentage = item.total > 0 ? ((item.total - item.factValue) * 100 / item.total).toFixed(2) : null;
        const deviation = item.factValue - item.planValue;
        
        return (
          <tr key={index} className="border-top">
            <td className="ps-4 fw-medium">{item.boardTitle}</td>
            <td>{item.planValue.toLocaleString()}</td>
            <td className={item.factValue >= item.planValue ? "text-success fw-medium" : "text-danger fw-medium"}>
              {item.factValue.toLocaleString()}
            </td>
            <td>
              {defectPercentage ? (
                <div className="d-flex align-items-center">
                  <span>{defectPercentage}%</span>
                  <div className="progress ms-2 flex-grow-1" style={{height: '6px'}}>
                    <div 
                      className={`progress-bar ${Number(defectPercentage) > 5 ? 'bg-danger' : Number(defectPercentage) > 2 ? 'bg-warning' : 'bg-success'}`}
                      role="progressbar" 
                      style={{width: `${Math.min(100, Number(defectPercentage))}%`}}
                    />
                  </div>
                </div>
              ) : "---"}
            </td>
            <td className={`pe-4 text-end fw-medium ${deviation >= 0 ? "text-success" : "text-danger"}`}>
              {deviation.toFixed(2)}
            </td>
          </tr>
        );
      })}
      <tr className="border-top bg-light fw-bold">
        <td className="ps-4">Итого</td>
        <td>{calculateTotal('planValue').toLocaleString()}</td>
        <td className={calculateTotal('factValue') >= calculateTotal('planValue') ? "text-success" : "text-danger"}>
          {calculateTotal('factValue').toLocaleString()}
        </td>
        <td>
          {calculatePercentageTotal() !== "---" ? (
            <div className="d-flex align-items-center">
              <span>{calculatePercentageTotal()}</span>
              <div className="progress ms-2 flex-grow-1" style={{height: '6px'}}>
                <div 
                  className={`progress-bar ${Number(calculatePercentageTotal().replace('%','')) > 5 ? 'bg-danger' : Number(calculatePercentageTotal().replace('%','')) > 2 ? 'bg-warning' : 'bg-success'}`}
                  role="progressbar" 
                  style={{width: `${Math.min(100, Number(calculatePercentageTotal().replace('%','')))}%`}}
                />
              </div>
            </div>
          ) : "---"}
        </td>
        <td className={`pe-4 text-end ${(calculateTotal('factValue') - calculateTotal('planValue')) >= 0 ? "text-success" : "text-danger"}`}>
          {(calculateTotal('factValue') - calculateTotal('planValue')).toFixed(2)}
        </td>
      </tr>
    </tbody>
  </table>
</div>
    );
};

export default GypsumBoardTable;
