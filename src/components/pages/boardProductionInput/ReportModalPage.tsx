import React, { useEffect, useState } from "react";
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
import ProductCategoryMapEntry from "../../../model/production/ProductCategoryMapEntry";
import EditCategoryModal from "./EditCategoryModal";
import { TiEdit } from "react-icons/ti";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


interface ReportModalPageProps {
  show: boolean;
  reportData: ReportData | null;
  onHide: () => void;
  onSave: (reportData: ReportData) => void;
}

const ReportModalPage: React.FC<ReportModalPageProps> = ({ show, reportData, onHide, onSave }) => {
  const [selectedShift, setSelectedShift] = useState<Shift | null>(reportData ? reportData.productionList.shift : null);
  const [selectedProduct, setSelectedProduct] = useState<GypsumBoard | null>(reportData ? (reportData.product as GypsumBoard) : null );
  const { shiftList } = ShiftList();
  const { gypsumBoardList } = GypsumBoardList();
  const [selectedCategory, setSelectedCategory] = useState<ProductCategoryMapEntry | null>(null);
  const [editCategoryShow, setEditCategoryShow] = useState(false);
  const [tableData, setTableData] = useState<ProductCategoryMapEntry[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [report, setReport] = useState<ReportData | null>(null);

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
      setTableData(Object.values(reportData.productCategories));
      setStartDate(reportData.productionList.productionStart);
      setEndDate(reportData.productionList.productionFinish);
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

  const handleEditCategory = (category: ProductCategoryMapEntry) => {
    setSelectedCategory(category);
    setEditCategoryShow(true);
  };

  const handleCategoryUpdate = (
    updatedCategory: ProductCategoryMapEntry
  ): void => {
    // Обновляем данные категории в таблице
    const updatedTableData = tableData.map((entry) =>
      entry.category.id === updatedCategory.category.id
        ? updatedCategory
        : entry
    );
    // Обновляем локальное состояние данных таблицы
    setTableData(updatedTableData);
    console.log("Данные в таблице обновлены");
    //ToDo: Обновить данные в ReportData.productCategories
  };

  const updateReportData = () => {
    if (report) {
      onSave(report);

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
            <Col className="col-3 bordered">
              <Form.Group controlId="id">
                <Form.Label>ID:</Form.Label>
                <Form.Control
                  type="text"
                  value={reportData.productionList.id}
                  readOnly
                />
              </Form.Group>
              <Form.Group>
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
              </Form.Group>  
              <Form.Group>
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
              </Form.Group>
              <Form.Group>
                <Form.Label>Дата производства</Form.Label>
                <DatePicker                
                showIcon                
                selected={
                    new Date(reportData.productionList.productionDate)
                   }
                  onChange={(date: Date | null) => { }}
                  dateFormat="yyyy-MM-dd"
                  readOnly={true}
                />
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
              <Table striped bordered hover size="sm" responsive>
                <thead>
                  <tr>
                    <th>Категория</th>
                    <th>Значение</th>
                    {/* <th>Действия</th> */}
                  </tr>
                </thead>
                <tbody>
                  {tableData && Object.values(tableData).length > 0 ? (
                    Object.values(tableData).map((entry) => (
                      <tr key={entry.category.id}>
                        <td>{entry.category.title}</td>
                        <td>
                          <Button
                            variant="secondary"
                            style={{ right: 0 }}
                            onClick={() => handleEditCategory(entry)}
                          >
                            <TiEdit />
                          </Button>{" "}
                          {entry.value}{" "}
                        </td>
                        {/* <td>
                            <Button variant="primary" onClick={() => handleEditCategory(entry)}><TiEdit /></Button>
                          </td> */}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3}>Нет данных для отображения</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Закрыть
        </Button>
        <Button variant="primary" onClick={() => {
          updateReportData();
          onHide();
        }}>
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
