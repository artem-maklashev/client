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
import dayjs, {  } from "dayjs";
import GypsumBoardCategory from "../../../model/gypsumBoard/GypsumBoardCategory";
import { Stack } from "@mui/material";
import 'dayjs/locale/ru';
import BoardProduction from "../../../model/production/BoardProduction";
import { DateField, MobileTimePicker } from "@mui/x-date-pickers";
import Delays from "../../../model/delays/Delays";
import CategoriesTable from "./CategoriesTable";





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
  const [tableData, setTableData] = useState<BoardProduction[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [report, setReport] = useState<ReportData<GypsumBoard, GypsumBoardCategory, BoardProduction, Delays> | null>(null);
  const [delays, setDelays] = useState<Delays[]>([]);

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

  // useEffect(() => {
  //   // Устанавливаем начальные данные таблицы при загрузке компонента
  //   if (reportData) {
  //     setTableData(Object.values(reportData.productCategories));
  //   }
  // }, [reportData]);

  if (!reportData) {
    return null;
  }

  const handleEditCategory = (category: BoardProduction) => {
    setSelectedCategory(category);
    setEditCategoryShow(true);
  };

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

      updatedReport.updateProductions(updatedCategory); // Здесь вызываем метод на экземпляре класса ReportData
      setReport(updatedReport);
    }

    //ToDo: Обновить данные в ReportData.productCategories
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
      const updatedReport = new ReportData<GypsumBoard, GypsumBoardCategory, BoardProduction, Delays>(updatedProduct, updatedProductionList,  tableData, delays);

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
        <Container>
          <Row>
            <Col className="col-4 bordered">
              <Form.Group controlId="id">
                <Form.Label>ID:</Form.Label>
                <Form.Control
                  type="text"
                  value={reportData.productionList.id}
                  readOnly
                />
              </Form.Group>
              {/* <Form.Group>
                <Form.Label>Дата начала работы:</Form.Label>
                <DatePicker
                  timeInputLabel="Время:"
                  showIcon
                  showTimeInput
                  selected={startDate}
                  onChange={(e) => {
                    setStartDate(e);
                  }}
                  dateFormat="yyyy-MM-dd HH:mm:ss" 
                />
              </Form.Group>   */}
              <Form.Group>
                <Form.Label>Дата начала работы:</Form.Label>
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale={dayjs.locale("ru")}
                >
                  <Stack spacing={3}>
                    <MobileTimePicker
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
                    />
                    <DateTimePicker
                      label="Дата"
                      value={dayjs(startDate)}
                      onChange={(newValue) =>
                        newValue
                          ? setStartDate(newValue?.toDate())
                          : setStartDate(new Date())
                      }
                      // renderInput={(params) => <TextField {...params} />}
                      ampm={false}
                    />
                  </Stack>
                </LocalizationProvider>
              </Form.Group>

              <Form.Group>
                <Form.Label>Дата и время окончания работы:</Form.Label>
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale={dayjs.locale("ru")}
                >
                  <Stack spacing={3}>
                    <MobileTimePicker
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
                    />
                    <DateTimePicker
                      label="Дата"
                      value={dayjs(endDate)}
                      onChange={(newValue) =>
                        newValue
                          ? setEndDate(newValue?.toDate())
                          : setStartDate(new Date())
                      }
                      // renderInput={(params) => <TextField {...params} />}
                      ampm={false}
                    />
                  </Stack>
                </LocalizationProvider>
              </Form.Group>

              {/* <Form.Group>
                <Form.Label>Дата окончания работы:</Form.Label>
                <DatePicker
                  timeInputLabel="Время:"
                  showIcon
                  showTimeInput
                  selected={endDate}
                  onChange={(date: Date | null) => {
                    if (date) {
                      setEndDate(date);                    

                    }
                  }}
                  
                  dateFormat="yyyy-MM-dd HH:mm:ss" // Формат даты и времени
                />
              </Form.Group> */}
              <Form.Group>
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
              </Form.Group>
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
            <Col className="col-6">
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
    </Modal>
  );
};

export default ReportModalPage;