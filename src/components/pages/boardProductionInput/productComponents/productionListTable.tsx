import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import ReportData from "../../../../model/ReportData";
import GypsumBoard from "../../../../model/gypsumBoard/GypsumBoard";
import ReportModalPage from "../ReportModalPage";
import { TiEdit, TiTrash } from "react-icons/ti";
import GypsumBoardCategory from "../../../../model/gypsumBoard/GypsumBoardCategory";
import { saveUpdatedReport } from "../SaveUpdatedReport";
import BoardProduction from "../../../../model/production/BoardProduction";
import Delays from "../../../../model/delays/Delays";
import { getUserRole } from "../../../../service/Api";


interface ProductionListTableProps {
  boardProductions: ReportData<GypsumBoard, GypsumBoardCategory, BoardProduction, Delays>[];
}

const ProductionListTable: React.FC<ProductionListTableProps> = ({
  boardProductions,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ReportData<GypsumBoard, GypsumBoardCategory, BoardProduction, Delays> | null>(null);
  const [reportData, setReportData] = useState<ReportData<GypsumBoard, GypsumBoardCategory, BoardProduction, Delays>[] | null>(null);

  useEffect(() => {
    setReportData(boardProductions);
  }, [boardProductions]);

  const handleClick = (
    event: React.MouseEvent<HTMLElement>,
    item: ReportData<GypsumBoard, GypsumBoardCategory, BoardProduction, Delays>
  ) => {
    console.log(typeof (item));
    const selectedItem = new ReportData(item.product, item.productionList, item.productions, item.delays, item.defectsLogs);
    console.log(selectedItem);
    setSelectedItem(selectedItem);
    setShowModal(true);

  };

  const onSave = (updatedReport: ReportData<GypsumBoard, GypsumBoardCategory, BoardProduction, Delays>) => {
    console.log("Сохраняемый отчет (время начала): " + updatedReport.productionList.productionStart);
    if (reportData) {
      const updatedList = reportData.map((item) => {
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

  const handleRemoveReport = (
    event: React.MouseEvent<HTMLElement>,
    item: ReportData<GypsumBoard, GypsumBoardCategory, BoardProduction, Delays>) => {
    alert("Function not implemented.");
  }

  return (
    <Container fluid className="mt-5">
      <Row>
        <Col>
          <Table striped bordered hover responsive size="sm" variant="light" >
            <thead className="table-dark">
              <tr>
                <th className="text-center">ID</th>
                <th className="text-center">Время производства</th>
                {/* <th className="text-center">Окончание производства</th> */}
                <th className="text-center">Дата</th>
                <th className="text-center">Смена</th>
                {/* <th className="text-center">Вид продукции</th> */}
                <th className="text-center">Наименование</th>
                <th className="text-center p-3">Редактир.</th>
              </tr>
            </thead>

            <tbody>
              {reportData ?
                reportData.map((item) => (
                  <tr key={item.productionList.id}>
                    <td className="text-nowrap">
                      <span>{item.productionList.id}</span>
                    </td>
                    <td className="text-nowrap">
                      <span >
                        {new Date(
                          item.productionList.productionStart
                        ).toLocaleString()}
                      </span>
                    {/* </td>
                    <td className="text-nowrap"> */}
                    {"-"}
                      <span>
                        {new Date(
                          item.productionList.productionFinish
                        ).toLocaleString()}
                      </span>
                    </td>
                    <td className="text-nowrap">
                      <span><strong>
                        {new Date(
                          item.productionList.productionDate
                        ).toLocaleDateString()}
                      </strong>
                      </span>
                    </td>
                    <td className="text-nowrap"><strong>{item.productionList.shift.name}</strong></td>
                    {/* <td>{item.productionList.type.name}</td> */}
                    <td className="text-nowrap">
                      <span>
                        <strong>
                          {item.product.tradeMark.name} тип{" "}
                          {(item.product as GypsumBoard).boardType.name}-
                          {(item.product as GypsumBoard).edge.name}{" "}
                          {(item.product as GypsumBoard).thickness.value}-
                          {(item.product as GypsumBoard).width.value}-
                          {(item.product as GypsumBoard).length.value}
                        </strong>
                      </span>
                    </td>
                    <td style={{ width: 150 }}>
                      <Button
                        variant="secondary"
                        onClick={(evt) => handleClick(evt, item)}
                      >
                        <TiEdit />
                      </Button>

                      <Button
                        variant="secondary"
                        onClick={(evt) => handleRemoveReport(evt, item)}
                        style={{ color: "red" }}
                        disabled={getUserRole() === 'ADMIN' ? false : true}
                      >
                        <TiTrash />
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
      <ReportModalPage
        show={showModal}
        reportData={selectedItem}
        onHide={() => {
          setShowModal(false);
        }}
        onSave={onSave} />
    </Container>
  );
};

export default ProductionListTable;
