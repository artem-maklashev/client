import React from "react";
import { Card, Table } from "react-bootstrap";
import Delays from "../../../model/delays/Delays";

interface DelayUnitTableProps {
  delayType: string;
  tableData: any[];
  delaySummary: number;
  planDuration: number;
  formatPercentage: (value: number, total: number) => string;
}

const DelayUnitTable: React.FC<DelayUnitTableProps> = ({
  delayType,
  tableData,
  delaySummary,
  planDuration,
  formatPercentage
}) => (
  <Card className="mb-4 shadow-sm border-0">
    <Card.Header className="bg-primary text-white text-center">
      <h5 className="mb-0">{delayType}</h5>
    </Card.Header>
    <Card.Body className="p-0">
      <div className="table-responsive">
        <Table bordered hover className="mb-0">
          <thead className="table-light">
            <tr>
              <th className="text-center">Участок</th>
              <th className="text-center">Узел</th>
              <th className="text-center">Деталь</th>
              <th className="text-center">Длительность (мин)</th>
              <th className="text-center">%</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((item, index) => (
              <tr key={index}>
                <td>{item.unitPart.unit.productionArea.name}</td>
                <td>{item.unitPart.unit.name}</td>
                <td title={item.unitPart.name} style={{ maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {item.unitPart.name}
                </td>
                <td className="text-center">{item.delta}</td>
                <td className="text-center">
                  <span className="badge bg-info-subtle text-info-emphasis">
                    {formatPercentage(item.delta, planDuration)}%
                  </span>
                </td>
              </tr>
            ))}
            <tr className="table-success fw-bold">
              <td colSpan={3} className="text-end">Итого:</td>
              <td className="text-center">{delaySummary}</td>
              <td className="text-center">
                <span className="badge bg-success-subtle text-success-emphasis">
                  {formatPercentage(delaySummary, planDuration)}%
                </span>
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
    </Card.Body>
  </Card>
);

export default DelayUnitTable;
