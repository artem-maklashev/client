import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import ReportData from "../../../../model/ReportData";
import GypsumBoard from "../../../../model/gypsumBoard/GypsumBoard";
import ReportModalPage from "../ReportModalPage";
import { TiEdit, TiTrash } from "react-icons/ti";
import GypsumBoardCategory from "../../../../model/gypsumBoard/GypsumBoardCategory";
import { saveConsumptions, saveUpdatedReport } from "../SaveUpdatedReport";
import BoardProduction from "../../../../model/production/BoardProduction";
import Delays from "../../../../model/delays/Delays";
import { getUserRole } from "../../../../service/Api";
import ApiService from "../../../../service/ApiService";
import MaterialConsumption from "../../../../model/specification/MaterialConsumption";


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
    const selectedItemButton = new ReportData(item.product, item.productionList, item.productions, item.delays, item.defectsLogs);
    console.log(selectedItemButton);
    setSelectedItem(selectedItemButton);
    setShowModal(true);

  };

  const onSave = async (updatedReport: ReportData<GypsumBoard, GypsumBoardCategory, BoardProduction, Delays>, updatedConsumptions: MaterialConsumption[]) => {
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

      try {
        // 1. Сохраняем обновленный отчет и дожидаемся результата
        let savedReport: ReportData<GypsumBoard, GypsumBoardCategory, BoardProduction, Delays> = await saveUpdatedReport(updatedReport);
        console.log(savedReport);

        if (savedReport && updatedConsumptions && updatedConsumptions.length > 0) {
          // 2. Если отчет сохранен и есть расходные данные, обновляем productionList для каждого consumption
          updatedConsumptions.forEach((consumption) => consumption.productionList = savedReport.productionList);

          try {
            // 3. Сохраняем расходные данные после успешного сохранения отчета
            console.log("Сохраняем расход");
            await saveConsumptions(updatedConsumptions);
            console.log("Расходы сохранены успешно");
          } catch (consumptionError) {
            // 4. Логируем ошибку, если произошла ошибка при сохранении расхода
            console.error("Ошибка при сохранении расхода:", consumptionError);
          }
        } else {
          console.log("нет данных для обновления расхода.");
        }

        // 5. Закрываем модальное окно независимо от результата сохранений
        setShowModal(false);

      } catch (error) {
        // 6. Логируем ошибку, если произошла ошибка при сохранении отчета
        console.error("Ошибка при сохранении отчета:", error);
      }

    }
  };


  const handleRemoveReport = async (
    event: React.MouseEvent<HTMLElement>,
    item: ReportData<GypsumBoard, GypsumBoardCategory, BoardProduction, Delays>
  ) => {
    try {
      await ApiService.deleteReport(item.productionList.id);
      if (reportData) {
        const updatedList = reportData.filter(
          (report) => report.productionList.id !== item.productionList.id
        );
        setReportData(updatedList);
      }
    } catch (error) {
      console.error("Error deleting report:", error);
      // Optional: show an error message to the user
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
                <th className="text-center">Время производства</th>
                {/* <th className="text-center">Окончание производства</th> */}
                <th className="text-center">Дата</th>
                <th className="text-center">Смена</th>
                {/* <th className="text-center">Вид продукции</th> */}
                <th className="text-center">Наименование</th>
                <th className="text-center">Простои</th>
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
                    <td className="text-center">
                      {item.delays.reduce((acc, delay) => {
                        const start = new Date(delay.startTime);
                        const end = new Date(delay.endTime);
                        const diffInDays = (end.getTime() - start.getTime()) / (1000 * 60);
                        return acc + diffInDays;
                      }, 0)}
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
          setSelectedItem(null);
        }}
        onSave={onSave} />
    </Container>
  );
};

export default ProductionListTable;
