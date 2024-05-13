import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import ReportData from "../../../model/ReportData";
import GypsumBoard from "../../../model/gypsumBoard/GypsumBoard";
import ReportModalPage from "./ReportModalPage";
import { TiEdit } from "react-icons/ti";
import GypsumBoardCategory from "../../../model/gypsumBoard/GypsumBoardCategory";
import { saveUpdatedReport } from "./SaveUpdatedReport";
import BoardProduction from "../../../model/production/BoardProduction";
import Delays from "../../../model/delays/Delays";


interface ProductionListTableProps {
  boardProductions: ReportData<GypsumBoard, GypsumBoardCategory, BoardProduction, Delays>[];
}

const ProductionListTable: React.FC<ProductionListTableProps> = ({
  boardProductions,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ReportData<GypsumBoard, GypsumBoardCategory, BoardProduction, Delays> | null>(null);
  const [reportData, setReportData] = useState<ReportData<GypsumBoard, GypsumBoardCategory, BoardProduction, Delays>[] | null>(null);


  const handleClick = (
    event: React.MouseEvent<HTMLElement>,
    item: ReportData<GypsumBoard, GypsumBoardCategory, BoardProduction, Delays>
  ) => {
    setSelectedItem(item);
    setShowModal(true);

  };

  useEffect(() => {
    if (boardProductions) {
      setReportData(boardProductions);

    }

  }, [boardProductions]);

  const onSave = (updatedReport: ReportData<GypsumBoard, GypsumBoardCategory, BoardProduction, Delays>) => {
    if (reportData) {
      const updatedList = reportData?.map((item) => {
        if (item.productionList.id === updatedReport.productionList.id) {
          return updatedReport;
        }
        return item;
      });
      setReportData(updatedList);      
      console.log("обновлен список отчетов размером ", updatedList.length);
      saveUpdatedReport(updatedReport);
      setShowModal(false);
    }

  }

  return (
    <Container fluid className="mt-5">
      <Row>
        <Col>
          <Table striped bordered hover responsive size="sm" variant="light" >
            <thead className="table-dark">
              <tr>
                <th className="text-center">ID</th>
                <th className="text-center">Дата начала работы</th>
                <th className="text-center">Дата окончания работы</th>
                <th className="text-center">Дата производства</th>
                <th className="text-center">Смена</th>
                <th className="text-center">Вид продукции</th>
                <th className="text-center">Наименование</th>
                <th> </th>
              </tr>
            </thead>
            
            <tbody>
              {reportData ?
                reportData.map((item) => (
                  <tr key={item.productionList.id}>
                    <td>
                      <span>{item.productionList.id}</span>
                    </td>
                    <td>
                      <span>
                        {new Date(
                          item.productionList.productionStart
                        ).toLocaleString()}
                      </span>
                    </td>
                    <td>
                      <span>
                        {new Date(
                          item.productionList.productionFinish
                        ).toLocaleString()}
                      </span>
                    </td>
                    <td>
                      <span>
                        {new Date(
                          item.productionList.productionDate
                        ).toLocaleDateString()}
                      </span>
                    </td>
                    <td>{item.productionList.shift.name}</td>
                    <td>{item.productionList.type.name}</td>
                    <td>
                      <span>

                        {item.product.tradeMark.name} тип{" "}
                        {(item.product as GypsumBoard).boardType.name}-
                        {(item.product as GypsumBoard).edge.name}{" "}
                        {(item.product as GypsumBoard).thickness.value}-
                        {(item.product as GypsumBoard).width.value}-
                        {(item.product as GypsumBoard).length.value}
                      </span>
                    </td>
                    <td>
                      <Button
                        variant="secondary"
                        onClick={(evt) => handleClick(evt, item)}
                      >
                        <TiEdit />
                      </Button>
                    </td>
                  </tr>
                )) :
                <td rowSpan={4}>Нет данных</td>
              }
            </tbody>
          </Table>
        </Col>
      </Row>
      <ReportModalPage show={showModal} reportData={selectedItem} onHide={() => setShowModal(false)} onSave={onSave} />

    </Container>
  );
};

export default ProductionListTable;
