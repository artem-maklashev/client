import React from "react"
import { Col, Container, Row, Table } from "react-bootstrap"
import ReportData from "../../../model/ReportData";
import GypsumBoard from "../../../model/gypsumBoard/GypsumBoard";

interface ProductionListTableProps {
  boardProductions: ReportData[];
}

const ProductionListTable: React.FC<ProductionListTableProps> = ({ boardProductions }) => {
    return (
      <Container>
        <Row>
          <Col className="col-6">
            <Table striped bordered hover size="sm" variant="light">
              <thead className="table-dark">
                <tr>
                  <th className="text-center">ID</th>
                  <th className="text-center">Дата начала работы</th>
                  <th className="text-center">Дата окончания работы</th>
                  <th className="text-center">Дата производства</th>
                  <th className="text-center">Смена</th>
                  <th className="text-center">Вид продукции</th>
                  <th className="text-center">Наименование</th>
                </tr>
              </thead>
              <tbody>
                {boardProductions.map((item) => (
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
                        <td>{item.productionList.type.name }</td>
                    <td>
                      {item.product.tradeMark.name} тип{" "}
                      {((item.product) as GypsumBoard).boardType.name}-
                      {((item.product) as GypsumBoard).edge.name}{" "}
                      {((item.product) as GypsumBoard).thickness.value}-
                      {((item.product) as GypsumBoard).width.value}-
                      {((item.product) as GypsumBoard).length.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    );
}
export default ProductionListTable;