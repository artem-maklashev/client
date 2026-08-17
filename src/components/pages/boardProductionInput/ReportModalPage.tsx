import React, { useEffect, useMemo, useRef, useState } from "react";
import { Modal, Button, Form, Col, Container, Row, FloatingLabel, Card } from "react-bootstrap";
import "../../pages/MyStyle.css";
import { ShiftList } from "./productComponents/FetchShiftList";
import Shift from "../../../model/Shift";
import GypsumBoard from "../../../model/gypsumBoard/GypsumBoard";
import { GypsumBoardList } from "./productComponents/FetchGypsumBoard";
import EditCategoryModal from "./productComponents/EditCategoryModal";
import "react-datepicker/dist/react-datepicker.css";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Stack } from "@mui/material";
import "dayjs/locale/ru";
import BoardProduction from "../../../model/production/BoardProduction";
import { MobileDateTimePicker } from "@mui/x-date-pickers";
import Delays from "../../../model/delays/Delays";
import CategoriesTable from "./productComponents/CategoriesTable";
import DelaysTable from "./delayComponents/DelaysTable";
import EditDelayModal from "./delayComponents/EditDelayModal";
import dayjs from "dayjs";
import BoardDefectsLog from "../../../model/defects/BoardDefectsLog";
import DefectsTable from "./DefectsTable";
import EditDefectModal from "./defectComponents/EditDefectModal";
import utc from 'dayjs/plugin/utc';
import ApiService from "../../../service/ApiService";
import { createNewReport } from "./NewReport";
import MaterialConsumption from "../../../model/specification/MaterialConsumption";
import Specification from "../../../model/specification/Specification";
import EditConsumptionModal from "./specificationComponents/EditConsumptionModal";
import { Toast } from "primereact/toast";
import { ReportModalService } from "./reportEditing/ReportModalService";
import { ReportModalState, BoardReportData } from "../../../model/reportEditing/ReportModalState";
dayjs.extend(utc);

interface ReportModalPageProps {
  show: boolean;
  reportData: BoardReportData | null;
  onHide: () => void;
  onSave: (
    reportData: BoardReportData,
    consumptions: MaterialConsumption[]
  ) => void;
}

/**
 * Модальное окно редактирования отчёта.
 *
 * Компонент отвечает только за презентацию и состояние UI.
 * Вся предметная бизнес-логика вынесена в ReportModalService,
 * а агрегированное состояние — в ReportModalState.
 */
const ReportModalPage: React.FC<ReportModalPageProps> = ({
  show,
  reportData,
  onHide,
  onSave,
}) => {
  const service = useMemo(() => new ReportModalService(), []);
  const { shiftList } = ShiftList();
  const { gypsumBoardList } = GypsumBoardList();

  const [state, setState] = useState<ReportModalState | null>(null);

  const [editCategoryShow, setEditCategoryShow] = useState(false);
  const [editDelayShow, setEditDelayShow] = useState(false);
  const [editDefectsShow, setEditDefectsShow] = useState(false);
  const [editConsumtionShow, setEditConsumtionShow] = useState(false);
  const [specification, setSpecification] = useState<Specification[]>([]);
  const [consumptions, setConsumptions] = useState<MaterialConsumption[]>([]);
  const toast = useRef<Toast>(null);

  // Инициализация состояния при открытии модального окна
  useEffect(() => {
    const initializeReportData = async () => {
      if (!reportData) {
        const emptyReport = await createNewReport(shiftList[0], gypsumBoardList[0]);
        setState(fromReport(emptyReport));
      } else {
        setState(fromReport(reportData));
      }
    };

    if (show) {
      initializeReportData();
    }
  }, [show, reportData, shiftList, gypsumBoardList]);

  const fromReport = (report: BoardReportData): ReportModalState => {
    return new ReportModalState({
      reportData: report,
      selectedShift: report.productionList.shift,
      selectedProduct: report.product,
      tableData: report.productions,
      startDate: report.productionList.productionStart,
      endDate: report.productionList.productionFinish,
      delays: report.delays,
      defects: report.defectsLogs,
    });
  };

  // Загрузка спецификации при выборе продукта
  useEffect(() => {
    let isMounted = true;
    const fetchSpecification = async () => {
      if (state?.selectedProduct && isMounted) {
        const data = await ApiService.fetchSpecification(state.selectedProduct);
        setSpecification(data);
      }
    };
    fetchSpecification();
    return () => {
      isMounted = false;
    };
  }, [state?.selectedProduct]);

  // Применение суммы дефектов к категории "брак"
  useEffect(() => {
    if (!state) return;
    const tableData = service.applyDefectsSum(state.tableData, state.defects);
    setState((prev) => (prev ? prev.withTableData(tableData) : prev));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.defects]);

  if (!state) {
    return null;
  }

  const { tableData, selectedShift, selectedProduct, startDate, endDate, delays, defects } = state;

  const handleEditCategory = (category: BoardProduction) => {
    const tableData = service.updateCategoryValue(state.tableData, category);
    setState(state.withTableData(tableData));
  };

  const handleEditDelay = (delay: Delays) => {
    setState(state.withDelays(service.upsertDelay(state.delays, delay)));
    setEditDelayShow(false);
  };

  const handleRemoveDelay = (removingDelay: Delays) => {
    setState(state.withDelays(service.removeDelay(state.delays, removingDelay)));
  };

  const handleDefectUpdate = (updatedDefect: BoardDefectsLog) => {
    setState(
      state.withDefects(
        service.upsertDefect(state.defects, updatedDefect, state.delays)
      )
    );
  };

  const handleShiftChange = (shift: Shift | null) => {
    setState(state.withSelectedShift(shift));
  };

  const handleProductChange = (product: GypsumBoard | null) => {
    setState(service.applyProduct(state, product));
  };

  const handleStartDateChange = (value: any) => {
    setState(state.withStartDate(ApiService.getFormatedLocalDateFromDayjs(value)));
  };

  const handleEndDateChange = (value: any) => {
    setState(state.withEndDate(ApiService.getFormatedLocalDateFromDayjs(value)));
  };

  const handleSave = () => {
    const errorMessage = service.validate(startDate, endDate, delays);
    if (errorMessage) {
      toast.current?.show({
        severity: 'error',
        summary: 'Ошибка',
        detail: errorMessage,
        life: 5000,
      });
      return;
    }
    const report = service.buildReportData(state, shiftList[0]);
    onSave(report, consumptions);
    onHide();
  };

  const handleClose = () => {
    setConsumptions([]);
    setSpecification([]);
    onHide();
  };

  const handleSaveConsumption = (updatedConsumptions: MaterialConsumption[]) => {
    setEditConsumtionShow(false);
    setConsumptions(updatedConsumptions);
  };

  const categoryWithId = (id: number): number => {
    return service.getCategoryValue(tableData, id);
  };

  const resultCheck = tableData.length > 0
    ? (categoryWithId(1) * 2 - tableData.reduce((sum, item) => sum + (item?.value || 0), 0)).toFixed(1)
    : null;
  const isNonZero = resultCheck !== null && parseFloat(resultCheck) !== 0;

  const defectPercent = (() => {
    if (categoryWithId(1) <= 0) return 0;
    return (1 - (categoryWithId(2) + categoryWithId(3) + categoryWithId(4)) / categoryWithId(1)) * 100;
  })().toFixed(2);

  return (
    <Modal show={show} onHide={handleClose} centered={true} fullscreen={true} className="custom-modal" animation={false}
      dialogClassName="modal-slide-down">
      <Modal.Header closeButton className="custom-modal-header">
        <Modal.Title>Редактирование данных</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container fluid>
          <Row>
            <Col className="col-lg-5 col-sm-12">
              <Card className="p-3 border-0 shadow-sm rounded-3 bg-white ">
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale={dayjs.locale("ru")}
                >
                  {/* Строка 1: Смена и Номенклатура */}
                  <Row className="g-3 mb-2">
                    {/* Смена */}
                    <Col xs={12} md={3}>
                      <div className="position-relative border rounded-2 px-2 pb-1 pt-2 bg-white">
                        <label
                          className="position-absolute bg-white px-1 text-secondary fw-semibold"
                          style={{ top: '-9px', left: '10px', fontSize: '0.75rem', lineHeight: 1 }}
                        >
                          Смена
                        </label>
                        <Form.Select
                          size="sm"
                          value={selectedShift ? selectedShift.name : shiftList[1]?.name}
                          onChange={(e) => {
                            const selectedShiftName = e.target.value;
                            const foundShift = shiftList.find(
                              (shift) => shift.name === selectedShiftName
                            );
                            handleShiftChange(foundShift || null);
                          }}
                          className="border-0 shadow-none p-0 fw-medium bg-transparent"
                        >
                          {shiftList.map((shift) => (
                            <option key={shift.id} value={shift.name}>
                              {shift.name}
                            </option>
                          ))}
                        </Form.Select>
                      </div>
                    </Col>

                    {/* Номенклатура */}
                    <Col xs={12} md={9}>
                      <div className="position-relative border rounded-2 px-2 pb-1 pt-2 bg-white">
                        <label
                          className="position-absolute bg-white px-1 text-secondary fw-semibold"
                          style={{ top: '-9px', left: '10px', fontSize: '0.75rem', lineHeight: 1 }}
                        >
                          Гипсокартон
                        </label>
                        <Form.Select
                          size="sm"
                          value={selectedProduct ? selectedProduct.id.toString() : gypsumBoardList[0]?.id.toString()}
                          onChange={(e) => {
                            const selectedProductId = parseInt(e.target.value);
                            const foundGypsumBoard = gypsumBoardList.find(
                              (gypsumBoard) => gypsumBoard.id === selectedProductId
                            );
                            handleProductChange(foundGypsumBoard || null);
                          }}
                          className="border-0 shadow-none p-0 fw-medium bg-transparent text-truncate"
                        >
                          {gypsumBoardList.map((gypsumBoard) => (
                            <option
                              key={gypsumBoard.id}
                              value={gypsumBoard.id.toString()}
                            >
                              {service.getProductName(gypsumBoard)}
                            </option>
                          ))}
                        </Form.Select>
                      </div>
                    </Col>
                  </Row>

                  {/* Строка 2: Начало и Окончание работы */}
                  <Row className="g-3">
                    <Col xs={12} md={6}>
                      <MobileDateTimePicker
                        label="Начало работы:"
                        value={startDate ? dayjs(startDate) : null}
                        onChange={handleStartDateChange}
                        ampm={false}
                        orientation="landscape"
                        slotProps={{
                          textField: {
                            size: "small",
                            fullWidth: true,
                            sx: {
                              '& .MuiInputBase-root': { height: '38px' },
                              '& .MuiInputBase-input': { fontSize: '0.875rem' },
                              '& .MuiInputLabel-root': { fontSize: '0.85rem' }
                            }
                          }
                        }}
                      />
                    </Col>

                    <Col xs={12} md={6}>
                      <MobileDateTimePicker
                        label="Окончание работы:"
                        value={endDate ? dayjs(endDate) : null}
                        onChange={handleEndDateChange}
                        ampm={false}
                        orientation="landscape"
                        slotProps={{
                          textField: {
                            size: "small",
                            fullWidth: true,
                            sx: {
                              '& .MuiInputBase-root': { height: '38px' },
                              '& .MuiInputBase-input': { fontSize: '0.875rem' },
                              '& .MuiInputLabel-root': { fontSize: '0.85rem' }
                            }
                          }
                        }}
                      />
                    </Col>
                  </Row>
                </LocalizationProvider>
              </Card>



              <Row>
                <Col className="col-lg-12 col-sm-12">

                  <Card className="border-0 shadow-sm rounded-3 h-100 d-flex flex-column">
                    {/* <Card.Header className="bg-light border-bottom-0 py-2 px-3 fs-6 fw-bold text-dark">
                      Данные по производству
                    </Card.Header> */}
                    <Card.Body className="p-2 flex-grow-1 bg-light">
                      <CategoriesTable
                        categories={tableData}
                        handleEditCategory={handleEditCategory}
                      />
                    </Card.Body>
                    <Card.Footer className="p-2 bg-light border-top rounded-bottom-1">
                      <div className="d-flex gap-2">
                        {/* Карточка: Проверка */}
                        <div className="w-50 bg-white p-2 rounded-2 border text-center shadow-sm">
                          <div className="text-secondary small fw-medium mb-1">Проверка</div>
                          <div
                            className={`fw-bold fs-6 ${resultCheck === null
                              ? 'text-muted'
                              : isNonZero
                                ? 'text-danger'
                                : 'text-success'
                              }`}
                          >
                            {resultCheck !== null ? resultCheck : '—'}
                          </div>
                        </div>

                        {/* Карточка: Процент брака */}
                        <div className="w-50 bg-white p-1 rounded-2 border text-center shadow-sm">
                          <div className="text-secondary small fw-medium mb-1">Процент брака</div>
                          <div className="fw-bold fs-6 text-warning">
                            {defectPercent !== undefined && defectPercent !== null ? `${defectPercent}%` : '—'}
                          </div>
                        </div>
                      </div>
                    </Card.Footer>
                  </Card>
                </Col>

              </Row>
            </Col>

            <Col className="col-lg-7 col-sm-12">
              <Col>
                <Card className="mb-4 shadow-sm border-0" bg='white'>
                  <Card.Header className="text-center bg-white" as="h6" >Простой</Card.Header>
                  <Card.Body>

                    <DelaysTable
                      delays={delays}
                      handleEditDelay={(delay) => {
                        setEditDelayShow(true);
                        setState(state.withDelays([...state.delays])); // placeholder, редактирование через модалку
                        // Note: actual editing happens via EditDelayModal below
                      }}
                      handleRemoveDelay={handleRemoveDelay}
                    />
                  </Card.Body>
                  <Card.Footer className="text-center">
                    <Row className="justify-content-center">
                      <Button
                        type="button"
                        variant="outline-primary"
                        size="sm"
                        style={{ width: "150px" }}
                        onClick={() => {
                          setEditDelayShow(true);
                        }}
                      >
                        Добавить простой
                      </Button>
                    </Row>
                  </Card.Footer>
                </Card>
              </Col>
              <Card bg='white' className="shadow-sm border-0">
                <Card.Header className="text-center" as="h6">
                  Дефекты
                </Card.Header>
                <Card.Body>
                  <DefectsTable
                    defects={defects}
                    handleEditDefects={(defect) => {
                      setEditDefectsShow(true);
                    }}
                  />
                </Card.Body>
                <Card.Footer className="text-center">
                  <Row className="justify-content-center">
                    <Button
                      type="button"
                      variant="outline-primary"
                      size="sm"
                      style={{ width: "150px" }}
                      onClick={() => {
                        setEditDefectsShow(true);
                      }}
                    >
                      Добавить дефекты
                    </Button>
                  </Row>
                </Card.Footer>
              </Card>


              <Row className="justify-content-center mt-5 ">
                <Button
                  type="button"
                  variant="outline-primary"
                  size="sm"
                  style={{ width: "150px" }}
                  onClick={() => setEditConsumtionShow(true)}
                  className="shadow-sm"
                >
                  Расход материалов
                </Button>
              </Row>
            </Col>

          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Закрыть
        </Button>
        <Button
          variant="primary"
          onClick={handleSave}
        >
          Сохранить изменения
        </Button>
      </Modal.Footer>
      <EditCategoryModal
        show={editCategoryShow}
        category={state.tableData[0] ?? null}
        onHide={() => setEditCategoryShow(false)}
        onSave={(updatedCategory) => {
          handleEditCategory(updatedCategory);
          setEditCategoryShow(false);
        }}
      />
      <EditDelayModal
        show={editDelayShow}
        delay={null}
        shift={selectedShift}
        product={selectedProduct}
        onHide={() => setEditDelayShow(false)}
        onSave={(updatedDelay) => {
          handleEditDelay(updatedDelay);
        }}
      />
      <EditDefectModal
        show={editDefectsShow}
        defect={null}
        onHide={() => setEditDefectsShow(false)}
        onSave={(updatedDefect) => {
          handleDefectUpdate(updatedDefect);
        }}
      />
      <EditConsumptionModal
        show={editConsumtionShow}
        product={selectedProduct}
        productionTotal={tableData[0] ? tableData[0].value : 0}
        produtionList={state.reportData.productionList}
        onHide={() => setEditConsumtionShow(false)}
        specifications={specification}
        onSave={handleSaveConsumption}
      />
      <Toast ref={toast} />
    </Modal>
  );
};

export default ReportModalPage;
