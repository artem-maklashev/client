import React, { useEffect, useState } from "react";
import { Col, Container, Row, Table } from "react-bootstrap";
import ReportData from "../../../../model/ReportData";
import GypsumBoard from "../../../../model/gypsumBoard/GypsumBoard";
import ReportModalPage from "../ReportModalPage";
import GypsumBoardCategory from "../../../../model/gypsumBoard/GypsumBoardCategory";
import { saveConsumptions, saveUpdatedReport } from "../SaveUpdatedReport";
import BoardProduction from "../../../../model/production/BoardProduction";
import Delays from "../../../../model/delays/Delays";
import { getUserRole } from "../../../../service/Api";
import ApiService from "../../../../service/ApiService";
import MaterialConsumption from "../../../../model/specification/MaterialConsumption";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";


interface ProductionListTableProps {
  boardProductions: ReportData<GypsumBoard, GypsumBoardCategory, BoardProduction, Delays>[];
}

const ProductionListTable: React.FC<ProductionListTableProps> = ({
  boardProductions,
}) => {

  const adminRoles = ['ADMIN', 'GB_ADMIN'];

  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ReportData<GypsumBoard, GypsumBoardCategory, BoardProduction, Delays> | null>(null);
  const [reportData, setReportData] = useState<ReportData<GypsumBoard, GypsumBoardCategory, BoardProduction, Delays>[] | null>(null);
  const [consumptions, setConsumptions] = useState<MaterialConsumption[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [updateConsumption, setUpdateConsumption] = useState(false);

  useEffect(() => {
    setReportData(boardProductions);
  }, [boardProductions]);

  const handleClick = (
    // event: React.MouseEvent<HTMLElement>,
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
            setUpdateConsumption(true);
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
    // event: React.MouseEvent<HTMLElement>,
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

  useEffect(() => {
    const fetchComsumptions = async (reports: ReportData<GypsumBoard, GypsumBoardCategory, BoardProduction, Delays>[]) => {
      const productions = reports.map((report) => report.productionList);
      setLoading(true);
      try {
        const consumptionsForReport = await ApiService.getConsumptionsByProductions(productions);
        setConsumptions(consumptionsForReport);
      } catch (error) {
        console.error("Error fetching consumptions:", error);
      } finally {
        setLoading(false);
        setUpdateConsumption(false);
      }
    }

    if (reportData && updateConsumption) {

      fetchComsumptions(reportData);
    }
  }, [reportData, updateConsumption]);

  useEffect(() => {
    setUpdateConsumption(true);
  }, [reportData]);

  function checkDefectActs(productions: BoardProduction[]): number {
    return productions.reduce((sum, production) => 
      production.category.id === 1 ? sum - production.value : sum + production.value, 0);
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
                <th className="text-center">Материалы</th>
                <th className="text-center">Акты бракования</th>
                <th className="text-center ">Действия</th>
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
                    <td className="text-center">

                      { isLoading ? ( <ProgressSpinner style={{ width: "25px", height: "25px" }} />) :
                      consumptions
                        .filter(c => c.productionList.id === item.productionList.id)
                        .reduce((acc, consumption) => acc + consumption.quantity, 0) === 0 ? (
                        <i className="pi pi-minus" style={{ color: "gray" }}></i>
                      ) : (
                        <i className="pi pi-check" style={{ color: "green" }}></i>
                      )}
                    </td>
                    <td className="text-center">
                    { isLoading ? ( <ProgressSpinner style={{ width: "25px", height: "25px" }} />) :
                      Math.abs(Math.round(checkDefectActs(item.productions))) === 0 ? (
                        <i className="pi pi-check" style={{ color: "green" }}></i>
                      ) : (
                        <i className="pi pi-minus" style={{ color: "gray" }}></i>
                      )
                    }                    
                    </td>
                    <td className="text-center">
                      {/* Кнопка редактирования */}
                      <Button
                        icon="pi pi-pencil"
                        className="p-button-rounded p-button-info p-button-sm"
                        onClick={() => handleClick(item)}
                        style={{
                          marginRight: '8px',// Отступ между кнопкамиa
                          width: '35px', // Ширина кнопки
                          height: '35px', // Высота кнопки
                          fontSize: '1.2rem', // Размер текста/иконки
                          borderRadius: '25px'
                        }}
                      // disabled={
                      //   getUserRole() === 'ADMIN' ? false : true}
                      />
                      {/* Кнопка удаления */}
                      <Button
                        icon="pi pi-trash"
                        className="p-button-rounded p-button-danger p-button-sm"
                        onClick={() => handleRemoveReport(item)}
                        style={{
                          marginRight: '8px',// Отступ между кнопкамиa
                          width: '35px', // Ширина кнопки
                          height: '35px', // Высота кнопки
                          fontSize: '1.2rem', // Размер текста/иконки
                          borderRadius: '25px'
                        }}
                        disabled={
                          (adminRoles.includes(getUserRole())) ? false : true}
                      />
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
