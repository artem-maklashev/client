import React, { useEffect, useState } from "react";
import { Badge, Col, Container, ProgressBar, Row, Spinner, Table } from "react-bootstrap";
import { Button } from "primereact/button";
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
import 'bootstrap-icons/font/bootstrap-icons.css';


interface ProductionListTableProps {
  boardProductions: ReportData<GypsumBoard, GypsumBoardCategory, BoardProduction, Delays>[];
}

const ProductionListTable: React.FC<ProductionListTableProps> = ({ boardProductions }) => {
  const adminRoles = ['ADMIN', 'GB_ADMIN'];
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ReportData<GypsumBoard, GypsumBoardCategory, BoardProduction, Delays> | null>(null);
  const [reportData, setReportData] = useState<ReportData<GypsumBoard, GypsumBoardCategory, BoardProduction, Delays>[] | null>(null);
  const [consumptions, setConsumptions] = useState<MaterialConsumption[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [updateConsumption, setUpdateConsumption] = useState(false);

  useEffect(() => {
    setReportData(boardProductions
      .sort((a, b) => new Date(b.productionList.productionStart).getTime() - new Date(a.productionList.productionStart).getTime()));
  }, [boardProductions]);

  const handleClick = (item: ReportData<GypsumBoard, GypsumBoardCategory, BoardProduction, Delays>) => {
    const selectedItemButton = new ReportData(item.product, item.productionList, item.productions, item.delays, item.defectsLogs);
    setSelectedItem(selectedItemButton);
    setShowModal(true);
  };

  const onSave = async (updatedReport: ReportData<GypsumBoard, GypsumBoardCategory, BoardProduction, Delays>, updatedConsumptions: MaterialConsumption[]) => {
    if (reportData) {
      try {
        const savedReport = await saveUpdatedReport(updatedReport);
        
        if (savedReport && updatedConsumptions?.length > 0) {
          updatedConsumptions.forEach((consumption) => consumption.productionList = savedReport.productionList);
          await saveConsumptions(updatedConsumptions);
          setUpdateConsumption(true);
        }
        
        setShowModal(false);
      } catch (error) {
        console.error("Ошибка при сохранении:", error);
      }
    }
  };

  const handleRemoveReport = async (item: ReportData<GypsumBoard, GypsumBoardCategory, BoardProduction, Delays>) => {
    try {
      await ApiService.deleteReport(item.productionList.id);
      if (reportData) {
        setReportData(reportData.filter(report => report.productionList.id !== item.productionList.id));
      }
    } catch (error) {
      console.error("Error deleting report:", error);
    }
  };

  useEffect(() => {
    const fetchComsumptions = async (reports: ReportData<GypsumBoard, GypsumBoardCategory, BoardProduction, Delays>[]) => {
      setLoading(true);
      try {
        const productions = reports.map(report => report.productionList);
        const consumptionsForReport = await ApiService.getConsumptionsByProductions(productions);
        setConsumptions(consumptionsForReport);
      } catch (error) {
        console.error("Error fetching consumptions:", error);
      } finally {
        setLoading(false);
        setUpdateConsumption(false);
      }
    };

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

  const calculateDelays = (delays: Delays[]) => {
    return delays.reduce((acc, delay) => {
      const diffInMinutes = (new Date(delay.endTime).getTime() - new Date(delay.startTime).getTime()) / (1000 * 60);
      return acc + diffInMinutes;
    }, 0);
  };

  return (
    <Container fluid className="mt-4 px-4">
      <Row>
        <Col>
          <div className="table-responsive rounded-3 shadow-sm">
            <Table hover className="modern-table mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="text-center ps-4">ID</th>
                  <th className="text-center">Время производства</th>
                  <th className="text-center">Дата</th>
                  <th className="text-center">Смена</th>
                  <th className="text-center">Наименование</th>
                  <th className="text-center">Простои</th>
                  <th className="text-center">Материалы</th>
                  <th className="text-center">Брак</th>
                  <th className="text-center pe-4">Действия</th>
                </tr>
              </thead>

              <tbody>
                {reportData ? (
                  reportData.map((item) => {
                    const delayMinutes = calculateDelays(item.delays);
                    const hasMaterials = consumptions
                      .filter(c => c.productionList.id === item.productionList.id)
                      .reduce((acc, c) => acc + c.quantity, 0) > 0;
                    const hasDefects = Math.abs(Math.round(checkDefectActs(item.productions))) !== 0;

                    function calculateProcent(item: ReportData<GypsumBoard, GypsumBoardCategory, BoardProduction, Delays>): React.ReactNode {
                      const productions = item.productions;
                      const total = productions.filter(production => production.category.id === 1);
                      const totalValue = total.reduce((acc, t) => acc + t.value, 0);
                      const good = productions.filter(production => production.category.id > 1 && production.category.id < 5);
                      const goodValue = good.reduce((acc, t) => acc + t.value, 0);
                      return (
                        ((totalValue-goodValue)/totalValue*100).toFixed(2) + '%'
                      );
                    }

                    return (
                      <tr key={item.productionList.id} className="align-middle">
                        <td className="text-center ps-4">
                          <Badge pill bg="secondary" className="fw-normal">
                            #{item.productionList.id}
                          </Badge>
                        </td>
                        
                        <td className="text-nowrap">
                          <div className="d-flex flex-column">
                            
                            <span><small className="text-muted">Начало </small>{new Date(item.productionList.productionStart).toLocaleTimeString()}</span>
                            
                            <span><small className="text-muted mt-1">Окончание </small>{new Date(item.productionList.productionFinish).toLocaleTimeString()}</span>
                          </div>
                        </td>
                        
                        <td className="text-center">
                          <div className="bg-light rounded p-2 d-inline-block">
                            {new Date(item.productionList.productionDate).toLocaleDateString()}
                          </div>
                        </td>
                        
                        <td className="text-center">
                          <Badge 
                            pill 
                            bg={item.productionList.shift.name === 'Дневная' ? 'info' : 'dark'} 
                            className="px-3 py-1"
                          >
                            {item.productionList.shift.name}
                          </Badge>
                        </td>
                        
                        <td>
                          <div>
                            <div className="fw-semibold">
                              {item.product.tradeMark.name} 
                              <span className="text-muted ms-1">
                                (тип {(item.product as GypsumBoard).boardType.name})
                              </span>
                            </div>
                            <div className="text-muted small">
                              <strong>{(item.product as GypsumBoard).thickness.value}</strong> - 
                              {(item.product as GypsumBoard).width.value} - 
                              {(item.product as GypsumBoard).length.value}
                            </div>
                          </div>
                        </td>
                        
                        <td className="text-center">
                          <div className="d-flex align-items-center gap-2">
                            <span className="fw-semibold">{delayMinutes} мин</span>
                            <ProgressBar 
                              now={Math.min(delayMinutes, 100)} 
                              variant={delayMinutes > 60 ? 'danger' : delayMinutes > 30 ? 'warning' : 'success'}
                              className="flex-grow-1" 
                              style={{ height: '6px' }}
                            />
                          </div>
                        </td>
                        
                        <td className="text-center">
                          {isLoading ? (
                            <Spinner animation="border" size="sm" />
                          ) : hasMaterials ? (
                            <i className="bi bi-check-circle-fill text-success "></i> 
                          ) : (
                            <i className="bi bi-dash-circle-fill text-muted " />
                          )}
                        </td>
                        
                        <td className="text-center">
                          {isLoading ? (
                            <Spinner animation="border" size="sm" />
                          ) : hasDefects ? (
                            <i className="bi bi-exclamation-triangle-fill text-warning "/>
                          ) : (
                            <i className="bi bi-check-circle-fill text-success "> {calculateProcent(item)}</i> 
                          )}
                        </td>
                        
                        <td className="text-center pe-4">
                          <div className="d-flex justify-content-center gap-2">
                            <Button 
                              icon="pi pi-pencil" 
                              className="p-button-rounded p-button-sm p-button-text p-button-secondary"
                              onClick={() => handleClick(item)}
                              disabled={!adminRoles.includes(getUserRole())}
                              tooltip="Редактировать"
                              tooltipOptions={{ position: 'top' }}
                            />
                            <Button 
                              icon="pi pi-trash" 
                              className="p-button-rounded p-button-sm p-button-text p-button-danger"
                              onClick={() => handleRemoveReport(item)}
                              disabled={!adminRoles.includes(getUserRole())}
                              tooltip="Удалить"
                              tooltipOptions={{ position: 'top' }}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={9} className="text-center py-5">
                      <div className="d-flex flex-column align-items-center text-muted">
                        <i className="bi bi-database-exclamation fs-1 mb-3" />
                        <span className="fs-5">Нет данных для отображения</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>

      <ReportModalPage
        show={showModal}
        reportData={selectedItem}
        onHide={() => {
          setShowModal(false);
          setSelectedItem(null);
        }}
        onSave={onSave}
      />
    </Container>
  );
};

export default ProductionListTable;