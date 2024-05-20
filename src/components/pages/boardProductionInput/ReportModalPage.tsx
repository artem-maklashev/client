import React, { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Form,
  Col,
  Container,
  Row,
} from "react-bootstrap";
import "../../pages/MyStyle.css";
import ReportData from "../../../model/ReportData";
import { ShiftList } from "./FetchShiftList";
import Shift from "../../../model/Shift";
import GypsumBoard from "../../../model/gypsumBoard/GypsumBoard";
import { GypsumBoardList } from "./FetchGypsumBoard";
import EditCategoryModal from "./EditCategoryModal";
import "react-datepicker/dist/react-datepicker.css";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import GypsumBoardCategory from "../../../model/gypsumBoard/GypsumBoardCategory";
import { Stack } from "@mui/material";
import 'dayjs/locale/ru';
import BoardProduction from "../../../model/production/BoardProduction";
import { MobileDateTimePicker } from "@mui/x-date-pickers";
import Delays from "../../../model/delays/Delays";
import CategoriesTable from "./CategoriesTable";
import DelaysTable from "./DelaysTable";
import EditDelayModal from "./EditDelayModal";
import dayjs from "dayjs";
// import utc from 'dayjs/plugin/utc';
// import timezone from 'dayjs/plugin/timezone';
// import customParseFormat from 'dayjs/plugin/customParseFormat';

// dayjs.extend(utc);
// dayjs.extend(timezone);
// dayjs.extend(customParseFormat);

interface ReportModalPageProps {
  show: boolean;
  reportData: ReportData<GypsumBoard, GypsumBoardCategory, BoardProduction, Delays> | null;
  onHide: () => void;
  onSave: (reportData: ReportData<GypsumBoard, GypsumBoardCategory, BoardProduction, Delays>) => void;
}

// const formatLocalDateTime = (date : Date) => new Date(date.toLocaleString().slice(0, 19).replace('T',' '));

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
  };

  useEffect(() => {
    if (show && reportData) {
      setSelectedShift(reportData.productionList.shift);
      setSelectedProduct(reportData.product as GypsumBoard);
      setTableData(reportData.productions);
      setStartDate(reportData.productionList.productionStart);
      setEndDate(reportData.productionList.productionFinish);
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

  const handleCategoryUpdate = (updatedCategory: BoardProduction): void => {
    if (report) {
      const updatedReport = new ReportData<GypsumBoard, GypsumBoardCategory, BoardProduction, Delays>(
        report.product,
        report.productionList,
        tableData,
        delays
      );

      updatedReport.updateProductions(updatedCategory);
      setReport(updatedReport);
    }
  };

  const handleDelayUpdate = (updatedDelay: Delays): void => {
    if (report) {
      const updatedReport = new ReportData<GypsumBoard, GypsumBoardCategory, BoardProduction, Delays>(
        report.product,
        report.productionList,
        tableData,
        delays
      );

      updatedReport.updateDelays(updatedDelay);
      setReport(updatedReport);
    }
  };

  const updateReportData = () => {
    if (report) {

      const updatedProductionList = { ...report.productionList };
      updatedProductionList.shift = selectedShift || shiftList[0];
      updatedProductionList.productionStart = startDate || new Date();
      updatedProductionList.productionFinish = endDate || new Date();//(new Date(dayjs(endDate).utc(true).toISOString()) || new Date());
      const updatedProduct = selectedProduct ?? report.product;

      const updatedReport = new ReportData<GypsumBoard, GypsumBoardCategory, BoardProduction, Delays>(
        updatedProduct,
        updatedProductionList,
        tableData,
        delays
      );
      
      setReport(updatedReport);
      onSave(updatedReport);
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
          <Col className="col-lg-2 col-sm-6 bordered">
              <Form.Group>
                <Form.Label>Начало работы:</Form.Label>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={dayjs.locale("ru")}>
                  <Stack spacing={3}>
                    <MobileDateTimePicker
                      label="Дата"
                      value={startDate ? dayjs(startDate) : null}
                      onChange={(newValue) =>
                        setStartDate(newValue ? dayjs(newValue).toDate() : new Date())
                      }
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
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={dayjs.locale("ru")}>
                  <Stack spacing={3}>
                    <MobileDateTimePicker
                      label="Дата"
                      value={endDate ? dayjs(endDate) : null}
                      onChange={(newValue) => {
                        setEndDate(newValue?.toDate() || new Date());                        
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
              <Col className="col-lg-3 col-sm-6 bordered">
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
                      <option key={gypsumBoard.id} value={gypsumBoard.id.toString()}>
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
                <CategoriesTable categories={tableData} handleEditCategory={handleEditCategory} />
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
        <Button variant="primary" onClick={() => {
          //alert('Установлена дата и время окончания ' + endDate);
          updateReportData();
          onHide();
        }}>
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
        onHide={() => setEditDelayShow(false)}
        onSave={(updatedDelay) => {
          handleDelayUpdate(updatedDelay);
          setEditDelayShow(false);
        }}
      />
    </Modal>
  );
};

export default ReportModalPage;
