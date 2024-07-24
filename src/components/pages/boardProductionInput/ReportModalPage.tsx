import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Col, Container, Row } from "react-bootstrap";
import "../../pages/MyStyle.css";
import ReportData from "../../../model/ReportData";
import { ShiftList } from "./productComponents/FetchShiftList";
import Shift from "../../../model/Shift";
import GypsumBoard from "../../../model/gypsumBoard/GypsumBoard";
import { GypsumBoardList } from "./productComponents/FetchGypsumBoard";
import EditCategoryModal from "./productComponents/EditCategoryModal";
import "react-datepicker/dist/react-datepicker.css";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import GypsumBoardCategory from "../../../model/gypsumBoard/GypsumBoardCategory";
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
import ProductionList from "../../../model/production/ProductionList";
import { createNewReport } from "./NewReport";
import ProductTypes from "../../../model/ProductTypes";
dayjs.extend(utc);

interface ReportModalPageProps {
  show: boolean;
  reportData: ReportData<
    GypsumBoard,
    GypsumBoardCategory,
    BoardProduction,
    Delays
  > | null;
  onHide: () => void;
  onSave: (
    reportData: ReportData<
      GypsumBoard,
      GypsumBoardCategory,
      BoardProduction,
      Delays
    >
  ) => void;
}

const ReportModalPage: React.FC<ReportModalPageProps> = ({
  show,
  reportData,
  onHide,
  onSave,
}) => {

  const [draftReport, setDraftReport] = useState<ReportData<GypsumBoard, GypsumBoardCategory, BoardProduction, Delays> | null>(null);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<GypsumBoard | null>(null);
  const { shiftList } = ShiftList();
  const { gypsumBoardList } = GypsumBoardList();
  const [selectedCategory, setSelectedCategory] = useState<BoardProduction | null>(null);
  const [editCategoryShow, setEditCategoryShow] = useState(false);
  const [editDelayShow, setEditDelayShow] = useState(false);
  const [editDefectsShow, setEditDefectsShow] = useState(false);
  const [tableData, setTableData] = useState<BoardProduction[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [delays, setDelays] = useState<Delays[]>([]);
  const [selectedDelay, setSelectedDelay] = useState<Delays | null>(null);
  const [defects, setDefects] = useState<BoardDefectsLog[]>([]);
  const [selectedDefect, setSelectedDefect] = useState<BoardDefectsLog | null>(null);


  const getName = (gboard: GypsumBoard) => {
    return (
      gboard.tradeMark.name +
      " тип " +
      gboard.boardType.name +
      " " +
      gboard.edge.name +
      "-" +
      gboard.thickness.value +
      "-" +
      gboard.width.value +
      "-" +
      gboard.length.value
    );
  };

  useEffect(() => {
    const initializeReportData = async () => {
      if (!reportData) {
        const emptyReport = await createNewReport(shiftList[0], gypsumBoardList[0]);
        setDraftReport(structuredClone(emptyReport));
      } else {
        setDraftReport(structuredClone(reportData));
      }
    };

    if (show) {
      initializeReportData();
    }
  }, [show, reportData, shiftList]);

  useEffect(() => {
    if (draftReport) {
      setSelectedShift(draftReport.productionList.shift);
      setSelectedProduct(draftReport.product as GypsumBoard);
      setTableData(draftReport.productions);
      setStartDate(draftReport.productionList.productionStart);
      setEndDate(draftReport.productionList.productionFinish);
      setDelays(draftReport.delays);
      setDefects(draftReport.defectsLogs);
    }
  }, [draftReport]);


  if (!draftReport) {
    return null;
  }

  const handleEditCategory = (category: BoardProduction) => {
    setSelectedCategory(category);
    setEditCategoryShow(true);
  };

  const handleEditDelay = (delay: Delays) => {
    setSelectedDelay(delay);
    setEditDelayShow(true);
  };

  const handleEditDefect = (defect: BoardDefectsLog) => {
    setSelectedDefect(defect);
    setEditDefectsShow(true);
  };

  const handleCategoryUpdate = (updatedCategory: BoardProduction): void => {
    // if (draftReport) {
    //   const updatedReport = new ReportData<
    //     GypsumBoard,
    //     GypsumBoardCategory,
    //     BoardProduction,
    //     Delays
    //   >(draftReport.product, draftReport.productionList, tableData, delays, defects);

    //   updatedReport.updateProductions(updatedCategory);
    //   setDraftReport(updatedReport);
    // }    
    tableData.forEach(categorie => {
      categorie.product = selectedProduct || gypsumBoardList[0];
      categorie.productionList = draftReport?.productionList ||
        new ProductionList(
          -1,
          startDate || new Date(),
          endDate || new Date(),
          new Date(),
          selectedShift || shiftList[0],
          new ProductTypes(1, "")
        );
      if (categorie.category.id === updatedCategory.category.id) {
        categorie.value = updatedCategory.value;
      }
    });
  };

  const handleDelayUpdate = (updatedDelay: Delays): void => {
    // Найти элемент по id
    const findIndex = delays.findIndex((delay) => delay.id === updatedDelay.id);
  
    if (findIndex !== -1) {
      // Если найден, обновить элемент
      console.log("ОБНОВЛЯЕМ ПРОСТОЙ:\nСтарый простой:\n", delays[findIndex], "\nНовый простой\n", updatedDelay);
      delays[findIndex] = updatedDelay;
    } else {
      // Если не найден, создать новый id
      console.log("Создаем новый простой");
  
      // Проверяем, есть ли элементы в delays
      if (delays.length > 0) {
        // Находим минимальный id и создаем новый id
        const minId = Math.min(...delays.map(delay => delay.id));
        updatedDelay.id = minId - 1;
      } else {
        // Если список пустой, установим id равным -1
        updatedDelay.id = -2;
      }
      
      console.log(updatedDelay);
      // Добавить новый элемент      
      delays.push(updatedDelay);
    }
    
    // Обновить состояние
    setDelays([...delays]);
  };

  const handleRemoveDelay = (removingDelay: Delays): void => {
    const updatedDelays = delays.filter(
      (delay) => delay.id !== removingDelay.id
    );
    setDelays([...updatedDelays]);
    if (draftReport) {
      draftReport.delays = updatedDelays;
    }
  };

  const handleDefectUpdate = async (
    updatedDefect: BoardDefectsLog
  ): Promise<void> => {
    const find = defects.find((isFind) => isFind.id === updatedDefect.id);
    if (!find) {
      updatedDefect.id = (() => {
        let max = delays[0].id;
        defects.forEach((defect) => {
          if (defect.id > max) {
            max = defect.id;
          }
        });
        return max + 1;
      })();
    }
    if (defects.length > 0) {
      defects.forEach((defect) => {
        if (defect.id === updatedDefect.id) {
          defect.defects = updatedDefect.defects;
          defect.value = updatedDefect.value;
        }
      });
    } else {
      defects.push(updatedDefect);
    }
    setDefects([...defects]);
  };

  const handleSave = () => {
    console.log("Установлено значение startDate в ReportMoadl: " + startDate);
    console.log("Установлено значение endDate в ReportMoadl: " + endDate);

    if (draftReport) {
      draftReport.product = selectedProduct as GypsumBoard;
      draftReport.productionList.productionStart = startDate ? new Date(startDate) : new Date();
      draftReport.productionList.productionFinish = endDate ? new Date(endDate) : new Date();
      draftReport.productionList.shift = selectedShift || shiftList[0];
      draftReport.delays = delays;
      draftReport.defectsLogs = defects;
      draftReport.productions = tableData;
      console.log("СОХРАНЯЕМ ДАННЫЕ В NEW CATEGORY");
      console.log(draftReport);
      onSave(draftReport);
    }
    onHide();
  };

  const handleClose = () => {
    onHide();
  };

  const handleDateChange = (newValue: any) => {
    return ApiService.getFormatedLocalDateFromDayjs(newValue);
  };

  return (
    <Modal show={show} onHide={handleClose} centered={true} fullscreen={true}>
      <Modal.Header closeButton className="custom-modal-header">
        <Modal.Title>Редактирование данных</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container fluid>
          <Row>
            <Col className="col-lg-2 col-sm-6 bordered">
              <Form.Group>
                <Form.Label>Начало работы:</Form.Label>
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale={dayjs.locale("ru")}
                >
                  <Stack spacing={3}>
                    <MobileDateTimePicker
                      label="Дата"
                      value={startDate ? dayjs(startDate) : null}
                      // onChange={(newValue) => {
                      //   setStartDate(
                      //     newValue ? new Date(dayjs.utc(newValue).local().format('YYYY-MM-DDTHH:mm:ss')) : new Date()
                      //   );                        
                      // }
                      // }
                      onChange={(newValue) => setStartDate(handleDateChange(newValue))}
                      ampm={false}
                      orientation="landscape"
                    />
                  </Stack>
                </LocalizationProvider>
              </Form.Group>
            </Col>
            <Col className="col-lg-2 col-sm-6 bordered">
              <Form.Group>
                <Form.Label>Окончание работы:</Form.Label>
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale={dayjs.locale("ru")}
                >
                  <Stack spacing={3}>
                    <MobileDateTimePicker
                      label="Дата"
                      value={endDate ? dayjs(endDate) : null}
                      onChange={(newValue) => {
                        setEndDate(handleDateChange(newValue));
                      }}
                      ampm={false}
                      orientation="landscape"
                    />
                  </Stack>
                </LocalizationProvider>
              </Form.Group>
            </Col>
            <Row>
              <Col className="col-lg-2 col-sm-6 bordered">
                <Form.Group>
                  <Form.Label>Смена</Form.Label>
                  <Form.Select
                    value={
                      selectedShift ? selectedShift.name : shiftList[1].name
                    }
                    onChange={(e) => {
                      const selectedShiftName = e.target.value;
                      const foundShift = shiftList.find(
                        (shift) => shift.name === selectedShiftName
                      );
                      setSelectedShift(foundShift || null);
                    }}
                  >
                    {shiftList.map((shift) => (
                      <option key={shift.id} value={shift.name}>
                        {shift.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col className="col-lg-3 col-sm-6 bordered">
                <Form.Group>
                  <Form.Label>Гипсокартон</Form.Label>
                  <Form.Select
                    value={
                      selectedProduct
                        ? selectedProduct.id.toString()
                        : gypsumBoardList[0].id.toString()
                    }
                    onChange={(e) => {
                      const selectedProductId = parseInt(e.target.value);
                      const foundGypsumBoard = gypsumBoardList.find(
                        (gypsumBoard) => gypsumBoard.id === selectedProductId
                      );
                      setSelectedProduct(foundGypsumBoard || null);
                    }}
                  >
                    {gypsumBoardList.map((gypsumBoard) => (
                      <option
                        key={gypsumBoard.id}
                        value={gypsumBoard.id.toString()}
                      >
                        {getName(gypsumBoard)}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col className="col-lg-5 col-sm-12">
                <h3 className="text-center">Данные по производству</h3>
                <CategoriesTable
                  categories={tableData}
                  handleEditCategory={handleEditCategory}
                />
              </Col>
              <Col className="col-lg-7 col-sm-12">
                <Row>
                  <DelaysTable
                    delays={delays}
                    handleEditDelay={handleEditDelay}
                    handleRemoveDelay={handleRemoveDelay}                  
                  />
                </Row>
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
                <Row>
                  <DefectsTable
                    defects={defects}
                    handleEditDefects={handleEditDefect}
                  />
                </Row>
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
              </Col>
            </Row>
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
        category={selectedCategory}
        onHide={() => setEditCategoryShow(false)}
        onSave={(updatedCategory) => {
          handleCategoryUpdate(updatedCategory);
          setEditCategoryShow(false);
        }}
      />
      <EditDelayModal
        show={editDelayShow}
        delay={selectedDelay}
        shift={selectedShift}
        product={selectedProduct}
        onHide={() => setEditDelayShow(false)}
        onSave={(updatedDelay) => {
          handleDelayUpdate(updatedDelay);
          setEditDelayShow(false);
        }}
      />
      <EditDefectModal
        show={editDefectsShow}
        defect={selectedDefect}
        onHide={() => setEditDefectsShow(false)}
        onSave={(updatedDefect) => {
          handleDefectUpdate(updatedDefect);
          setEditDefectsShow(false);
        }}
      />
    </Modal>
  );
};

export default ReportModalPage;

