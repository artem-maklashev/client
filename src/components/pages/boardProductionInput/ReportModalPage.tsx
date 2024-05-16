import { useEffect, useState } from "react";
import React from "react";
import {
  Modal,
  Button,
  Form,
  Col,
  Container,
  Row,
  Table,
} from "react-bootstrap";
import "../../pages/MyStyle.css";
import ReportData from "../../../model/ReportData";
import { ShiftList } from "./FetchShiftList";
import Shift from "../../../model/Shift";
import GypsumBoard from "../../../model/gypsumBoard/GypsumBoard";
import { GypsumBoardList } from "./FetchGypsumBoard";
import EditCategoryModal from "./EditCategoryModal";
import { TiEdit } from "react-icons/ti";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { } from "dayjs";
import GypsumBoardCategory from "../../../model/gypsumBoard/GypsumBoardCategory";
import { Stack } from "@mui/material";
import 'dayjs/locale/ru';
import BoardProduction from "../../../model/production/BoardProduction";
import { DateField, MobileDateTimePicker, MobileTimePicker, StaticDateTimePicker } from "@mui/x-date-pickers";
import Delays from "../../../model/delays/Delays";
import CategoriesTable from "./CategoriesTable";
import DelaysTable from "./DelaysTable";
import EditDelayModal from "./EditDelayModal";





interface ReportModalPageProps {
  show: boolean;
  reportData: ReportData<GypsumBoard, GypsumBoardCategory, BoardProduction, Delays> | null;
  onHide: () => void;
  onSave: (reportData: ReportData<GypsumBoard, GypsumBoardCategory, BoardProduction, Delays>) => void;
}

const ReportModalPage: React.FC<ReportModalPageProps> = ({ show, reportData, onHide, onSave }) => {
  const [selectedShift, setSelectedShift] = useState<Shift | null>(reportData ? reportData.productionList.shift : null);
  const [selectedProduct, setSelectedProduct] = useState<GypsumBoard | null>(reportData ? (reportData.product as GypsumBoard) : null);
  const { shiftList } = ShiftList();
  const { gypsumBoardList } = GypsumBoardList();
  const [selectedCategory, setSelectedCategory] = useState<BoardProduction | null>(null);
  const [editCategoryShow, setEditCategoryShow] = useState(false);
  const [editDelayShow, setEditDelayShow] = useState(false);
  const [tableData, setTableData] = useState<BoardProduction[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [report, setReport] = useState<ReportData<GypsumBoard, GypsumBoardCategory, BoardProduction, Delays> | null>(null);
  const [delays, setDelays] = useState<Delays[]>([]);
  const [selectedDelay, setSelectedDelay] = useState<Delays | null>(null);

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
    // return toString() ;
  };
  useEffect(() => {
    if (show && reportData) {
      setSelectedShift(reportData.productionList.shift);
      setSelectedProduct(reportData.product as GypsumBoard);
      setTableData(reportData.productions);
      setStartDate((reportData.productionList.productionStart));
      setEndDate((reportData.productionList.productionFinish));
      setDelays(reportData.delays);
      setReport(reportData);

    }
  }, [show, reportData]);


  if (!reportData) {
    return null;
  }

  const handleEditCategory = (category: BoardProduction) => {
    setSelectedCategory(category);
    setEditCategoryShow(true);
  };

  const handleEditDelay = (delay: Delays) => {
    setSelectedDelay(delay);
    setEditDelayShow(true);
  }

  const handleCategoryUpdate = (
    updatedCategory: BoardProduction
  ): void => {
    if (report) {
      const updatedReport = new ReportData<
        GypsumBoard,
        GypsumBoardCategory,
        BoardProduction,
        Delays
      >(report.product, report.productionList, tableData, delays);

      updatedReport.updateProductions(updatedCategory);
      setReport(updatedReport);
    }
  };

  const handleDelayUpdate = (
    updatedDelay: Delays
  ): void => {
    if (report) {
      const updatedReport = new ReportData<
        GypsumBoard,
        GypsumBoardCategory,
        BoardProduction,
        Delays
      >(report.product, report.productionList, tableData, delays);

      updatedReport.updateDelays(updatedDelay);
      setReport(updatedReport);
    }
  };



  const updateReportData = () => {
    if (report) {
      // Создаем новый экземпляр ProductionList с обновленными значениями
      const updatedProductionList = report.productionList;
      updatedProductionList.shift = selectedShift || shiftList[0];
      updatedProductionList.productionStart = startDate || new Date();
      updatedProductionList.productionFinish = endDate || new Date();

      // Создаем новый экземпляр продукта (например, GypsumBoard или Gypsum)
      const updatedProduct = selectedProduct ?? report.product;


      // Создаем новый экземпляр ReportData с обновленными значениями
      const updatedReport = new ReportData<GypsumBoard, GypsumBoardCategory, BoardProduction, Delays>(updatedProduct, updatedProductionList, tableData, delays);

      setReport(updatedReport); // Обновляем значение report
      onSave(updatedReport); // Сохраняем обновленный отчет
    }
  }



  return (
    <Modal show={show} onHide={onHide} centered={true} fullscreen={true}>
      <Modal.Header closeButton className="custom-modal-header">
        <Modal.Title>Редактирование данных</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container fluid>
          <Row>
            <Col className="col-6 bordered">
              {/* <Form.Group controlId="id">
                <Form.Label>ID:</Form.Label>
                <Form.Control
                  type="text"
                  value={reportData.productionList.id}
                  readOnly
                />
              </Form.Group> */}


              <Form.Group>
                <Form.Label>Начало работы:</Form.Label>
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale={dayjs.locale("ru")}
                >
                  <Stack spacing={3}>
                    {/* <MobileTimePicker
                      label="Время:"
                      value={dayjs(startDate)}
                      onChange={(newValue) =>
                        newValue
                          ? setStartDate(newValue?.toDate())
                          : setStartDate(new Date())
                      }
                      // renderInput={(params) => <TextField {...params} />}
                      minutesStep={1}
                      ampm={false}
                    /> */}
                    <MobileDateTimePicker
                      label="Дата"
                      value={dayjs(startDate)}
                      onChange={(newValue) =>
                        newValue
                          ? setStartDate(newValue?.toDate())
                          : setStartDate(new Date())
                      }
                      // renderInput={(params) => <TextField {...params} />}
                      ampm={false}
                      orientation="landscape"
                    />
                  </Stack>
                </LocalizationProvider>
              </Form.Group>
            </Col>
            <Col className="col-6 bordered">
              <Form.Group>
                <Form.Label>Окончание работы:</Form.Label>
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale={dayjs.locale("ru")}
                >
                  <Stack spacing={3}>
                    {/* <MobileTimePicker
                      label="Время:"
                      value={dayjs(endDate)}
                      onChange={(newValue) =>
                        newValue
                          ? setEndDate(newValue?.toDate())
                          : setStartDate(new Date())
                      }
                      // renderInput={(params) => <TextField {...params} />}
                      minutesStep={1}
                      ampm={false}
                    /> */}
                    <MobileDateTimePicker
                      label="Дата"
                      value={dayjs(endDate)}
                      onChange={(newValue) =>
                        newValue
                          ? setEndDate(newValue?.toDate())
                          : setStartDate(new Date())
                      }
                      // renderInput={(params) => <TextField {...params} />}
                      ampm={false}
                      orientation="landscape"
                    />
                  </Stack>
                </LocalizationProvider>
              </Form.Group>

              {/* <Form.Group>
                <Stack spacing={3}>
                  <Form.Label>Дата производства</Form.Label>
                  <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    adapterLocale={dayjs.locale("ru")}
                  >
                    <DateField
                      label="Дата"
                      value={dayjs(reportData.productionList.productionDate)}
                      disabled={true}
                    />
                  </LocalizationProvider>
                  <DatePicker
                    showIcon
                    selected={
                      new Date(reportData.productionList.productionDate)
                    }
                    onChange={(date: Date | null) => {}}
                    dateFormat="yyyy-MM-dd"
                    readOnly={true}
                  />
                </Stack>
              </Form.Group> */}
            </Col>
            <Row>
              <Col className="col-6 bordered">
                <Form.Group>
                  <Form.Label>Смена</Form.Label>
                  <Form.Select
                    value={selectedShift ? selectedShift.name : ""}
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
              <Col className="col-6 bordered">
                <Form.Group>
                  <Form.Label>Гипсокартон</Form.Label>
                  <Form.Select
                    value={selectedProduct ? selectedProduct.id.toString() : "0"}
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
                <h3 className="text-center"> Данные по производству</h3>
                <CategoriesTable
                  categories={tableData}
                  handleEditCategory={handleEditCategory}
                />
                {/* <Table striped bordered hover size="sm" responsive> */}
                {/* <thead> */}
                {/* <tr> */}
                {/* <th>Категория</th> */}
                {/* <th>Значение</th> */}
                {/* <th>Действия</th> */}
                {/* </tr> */}
                {/* </thead> */}
                {/* <tbody> */}
                {/* {(tableData).length > 0 ? ( */}
                {/* (tableData).map((entry) => ( */}
                {/* <tr key={entry.category.id}> */}
                {/* <td>{entry.category.title}</td> */}
                {/* <td> */}
                {/* <Button */}
                {/* variant="secondary" */}
                {/* style={{ right: 0 }} */}
                {/* onClick={() => handleEditCategory(entry)} */}
                {/* > */}
                {/* <TiEdit /> */}
                {/* </Button>{" "} */}
                {/* {entry.value}{" "} */}
                {/* </td> */}
                {/* <td>
                            <Button variant="primary" onClick={() => handleEditCategory(entry)}><TiEdit /></Button>
                          </td> */}
                {/* </tr> */}
                {/* )) */}
                {/* ) : ( */}
                {/* <tr> */}
                {/* <td colSpan={3}>Нет данных для отображения</td> */}
                {/* </tr> */}
                {/* )} */}
                {/* </tbody> */}
                {/* </Table> */}

              </Col>
              <Col className="col-lg-7 col-sm-12">
                <DelaysTable delays={delays} handleEditDelay={handleEditDelay} />
              </Col>
            </Row>
          </Row>
          
            
          
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Закрыть
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            updateReportData();
            onHide();
          }}
        >
          Сохранить изменения
        </Button>
      </Modal.Footer>
      {/* Модальное окно для редактирования категории */}
      <EditCategoryModal
        show={editCategoryShow}
        category={selectedCategory}
        onHide={() => setEditCategoryShow(false)}
        onSave={(selectedCategory) => {
          // Реализация сохранения изменений категории
          console.log("Сохранено новое значение категории:", selectedCategory);
          handleCategoryUpdate(selectedCategory);
          // Закрываем модальное окно редактирования категории
          setEditCategoryShow(false);
        }}
      />
      <EditDelayModal
        show={editDelayShow}
        delay={selectedDelay}
        onHide={() => setEditDelayShow(false)}
        onSave={(selectedDelay) => {
          // Реализация сохранения изменений категории
          console.log("Сохранено новое значение категории:", selectedDelay);
          handleDelayUpdate(selectedDelay);
          // Закрываем модальное окно редактирования категории
          setEditDelayShow(false);
        }}
      />
    </Modal>
  
    
  );
};

export default ReportModalPage;