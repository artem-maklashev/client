import React from "react"
import { Col, Container, Row, Table } from "react-bootstrap"

import BoardProduction from "../../../model/production/BoardProduction"

interface ProductionListTableProps {
  boardProductions: BoardProduction[];
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
                  <tr key={item.id}>
                    <td>
                      <span>{item.id}</span>
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
                      {item.gypsumBoard.tradeMark.name} тип{" "}
                      {item.gypsumBoard.boardType.name}-
                      {item.gypsumBoard.edge.name}{" "}
                      {item.gypsumBoard.thickness.value}-
                      {item.gypsumBoard.width.value}-
                      {item.gypsumBoard.length.value}
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