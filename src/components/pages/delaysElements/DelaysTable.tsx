import React from "react";
import Delays from "../../../model/delays/Delays";
import DelayDataPrepare from "./DalayDataPrepare";
import {Button, Col, Row} from "react-bootstrap";

interface DelaysTableProps {
    data: Delays[];
    planDuration: number;
}

const DelaysTable: React.FC<DelaysTableProps> = ({data, planDuration}) => {
    if (data.length === 0) {
        return <div>Данных нет</div>;
    }

    const minDate = new Date(Math.min(...data.map(delay => new Date(delay.delayDate).getTime())));
    const maxDate = new Date(Math.max(...data.map(delay => new Date(delay.delayDate).getTime())));

    const filteredData = data.filter(
        (item) => item.unitPart.unit.productionArea.division.id === 1
    );

    const preparedData = new DelayDataPrepare(filteredData).getSummary();
    const delaysSummary = preparedData.delaysSummary;
    const unitData = preparedData.unitData    

    const tables = Object.entries(unitData).map(
        ([delayType, tableData], tableIndex) => (
            <Row key={`row-${tableIndex}`} className="mb-2">
                <h4 className="text-center">{delayType}</h4>
                <div key={`table-${tableIndex}`} className="table-responsive">
                    <table
                        className="table table-bordered table-hover table-light table-striped"
                        id={`gypsumBoardTable-${tableIndex}`}
                    >
                        <thead className="table-dark">
                        <tr>
                            <th className="text-center">Участок</th>
                            <th className="text-center">Узел</th>
                            <th className="text-center">Деталь</th>
                            <th className="text-center">Длительность</th>
                            <th className="text-center">%</th>
                        </tr>
                        </thead>
                        <tbody>
                        {tableData.map((item, index) => (
                            <tr key={`${delayType}-${index}`}>
                                <td>{item.unitPart.unit.productionArea.name}</td>
                                <td>{item.unitPart.unit.name}</td>
                                <td>{item.unitPart.name}</td>
                                <td className="text-center">{item.delta}</td>
                                <td className="text-center">{planDuration ? (item.delta*100/planDuration).toFixed(2) : 0 } %</td>
                            </tr>
                        ))}
                        <tr key={`total-${tableIndex}`} className="table-success">
                            <td colSpan={3} className="text-end"><strong>Итого</strong></td>
                            <td className="text-center"><strong>{delaysSummary[delayType]}</strong></td>
                            <td className="text-center"><strong>{planDuration ? (delaysSummary[delayType]*100/planDuration).toFixed(2) : 0} %</strong></td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </Row>
        )
    );

    const printStyles = `
  @media print {
    @page {
      size: landscape;
      margin: 5mm;
    }
    body {
      padding: 5px;
      font-family: Arial, sans-serif;
    }
    .no-print {
      display: none !important;
    }
    .print-section {
      width: 100%;
      margin-bottom: 5px;
      page-break-after: avoid;
    }
    table {
      width: 100%;
      margin: 5px 0;
      font-size: inherit;
    }
    th, td {
      padding: 4px;
      line-height: 1.2;
    }
    h4 {
      margin: 8px 0;
      font-size: 1.1rem;
    }
    .table-responsive {
      overflow-x: visible;
    }
  }
`;
    

    const handlePrint = () => {
        const printContent = document.getElementById('print-content');
        
        if (printContent) {
            const printWindow = window.open('', '_blank');
            
            if (printWindow) {
                const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
                    .map(el => el.outerHTML)
                    .join('');
                
                const printStyles = `
                    <style>
                        @page {
                            size: landscape;
                            margin: 5mm;
                        }
                        body { 
                            margin: 0; 
                            padding: 5px; 
                            font-family: Arial, sans-serif;
                        }
                        .print-section { 
                            page-break-after: avoid; 
                            margin-bottom: 5px;
                        }
                        h4 { 
                            text-align: center; 
                            margin: 8px 0;
                            font-size: 1.1rem;
                        }
                        table { 
                            width: 100%; 
                            border-collapse: collapse; 
                            margin: 5px 0;
                            font-size: inherit;
                        }
                        th, td { 
                            border: 1px solid #ddd; 
                            padding: 4px; 
                            text-align: left;
                            line-height: 1.2;
                        }
                        th { 
                            background-color: #f2f2f2; 
                            text-align: center;
                        }
                        .table-responsive {
                            overflow-x: visible;
                        }
                    </style>
                `;
                
                printWindow.document.write(`
                    <html>
                        <head>
                            <title>Отчет по простоям</title>
                            ${styles}
                            ${printStyles}
                        </head>
                        <body>
                            ${printContent.innerHTML}
                            <script>
                                window.onload = function() {
                                    setTimeout(function() {
                                        window.print();
                                        window.close();
                                    }, 200);
                                };
                            </script>
                        </body>
                    </html>
                `);
                
                printWindow.document.close();
            } else {
                alert('Пожалуйста, разрешите всплывающие окна для этого сайта');
            }
        }
    };

    return <div>
        <style>{printStyles}</style>
        <Button variant="primary" onClick={handlePrint} className="no-print mb-3 justify-content-end" >
            Печать
        </Button>
        <div id="print-content">
            <h4>Отчет по простоям за период {minDate.toLocaleDateString()} - {maxDate.toLocaleDateString()}</h4>
            {tables}
        </div>
    </div>;
};

export default DelaysTable;