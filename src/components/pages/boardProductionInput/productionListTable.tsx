import React, { useState } from "react"
import { Button, Col, Container, Row, Table } from "react-bootstrap"
import ReportData from "../../../model/ReportData";
import GypsumBoard from "../../../model/gypsumBoard/GypsumBoard";
import ReportModalPage from "./ReportModalPage";
import { TiEdit } from "react-icons/ti";


interface ProductionListTableProps {
  boardProductions: ReportData[];
}

const ProductionListTable: React.FC<ProductionListTableProps> = ({ boardProductions }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ReportData | null >(null);
  const handleClick = (event: React.MouseEvent<HTMLElement>, item: ReportData) => {
    // Implement your editing logic here
    //  (e.g., open a modal, navigate to an edit page)
    console.log(event);
    console.log("Selected for editing:", item.productionList.id); // Example log for now

    // Call the provided callback function if available
    // onEditProductionList?.(item);
    
    setShowModal(true);
    setSelectedItem(item);
    
  }
    return (
      <Container>
        <Row>
          <Col className="col-8">
            <Table striped bordered hover size="sm" variant="light" table-auto>
              <thead className="table-dark">
                <tr>
                  <th className="text-center">ID</th>
                  <th className="text-center">Дата начала работы</th>
                  <th className="text-center">Дата окончания работы</th>
                  <th className="text-center">Дата производства</th>
                  <th className="text-center">Смена</th>
                  <th className="text-center">Вид продукции</th>
                  <th className="text-center">Наименование</th>
                  <th> </th>
                </tr>
              </thead>
              <tbody>
                {boardProductions.map((item) => {
                  return (
                    <tr key={item.productionList.id}>
                      <td>
                        <span>{item.productionList.id}</span>
                      </td>
                      <td>
                        <span>
                          {new Date(
                            item.productionList.productionStart
                          ).toLocaleString()}
                        </span>
                      </td>
                      <td>
                        <span>
                          {new Date(
                            item.productionList.productionFinish
                          ).toLocaleString()}
                        </span>
                      </td>
                      <td>
                        <span>
                          {new Date(
                            item.productionList.productionDate
                          ).toLocaleDateString()}
                        </span>
                      </td>
                      <td>{item.productionList.shift.name}</td>
                      <td>{item.productionList.type.name}</td>
                      <td>
                        {item.product.tradeMark.name} тип{" "}
                        {((item.product) as GypsumBoard).boardType.name}-
                        {((item.product) as GypsumBoard).edge.name}{" "}
                        {((item.product) as GypsumBoard).thickness.value}-
                        {((item.product) as GypsumBoard).width.value}-
                        {((item.product) as GypsumBoard).length.value}
                      </td>
                      <td><Button variant='secondary' onClick={(evt) => handleClick(evt, item)}><TiEdit /></Button></td>
                    </tr>
                    
                  );
                })}
              </tbody>
            </Table>
          </Col>
        </Row>
        <ReportModalPage show={showModal} reportData={selectedItem} onHide={() => setShowModal(false)} />
      </Container>
      
    );
}
export default ProductionListTable;