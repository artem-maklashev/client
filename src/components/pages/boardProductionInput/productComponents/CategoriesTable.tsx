import { Button, Form, Table } from "react-bootstrap";
import React from "react";
import BoardProduction from "../../../../model/production/BoardProduction";
import { TiEdit } from "react-icons/ti";

interface CategoriesTableProps {
  categories: BoardProduction[];
  handleEditCategory: (category: BoardProduction) => void;
}

const CategoriesTable: React.FC<CategoriesTableProps> = ({
  categories,
  handleEditCategory,
}) => {
  const handleInputChange = (id: number, newValue: string) => {
    // setData(prevData =>
    //   prevData.map(row =>
    //     row.id === id ? { ...row, value: newValue } : row
    //   )
    // );
    alert("Введено значение: " + newValue + " в категорию " + categories.find(cat => cat.category.id === id)?.category.title);
  };
  return (
    <Table striped bordered hover size="sm" variant="dark" className="modern-table" >
      <thead>
        <tr>
          <th>Вид производства</th>
          <th>Значение</th>
          {/* <th>Действия</th> */}
        </tr>
      </thead>
      <tbody>
        {categories.length > 0 ? (
          categories.map((entry) => (
            <tr key={entry.category.id}>
              <td>{entry.category.title}</td>
              <td>
                <Button
                  variant="secondary"
                  style={{ right: 0 }}
                  onClick={() => handleEditCategory(entry)}
                  disabled={entry.category.id === 6}
                >
                  <TiEdit />
                </Button>{" "}
                {entry.value}{" "}
                {/* <Form.Control
                  type="number"
                  value={entry.value}
                  onBlur={e => handleInputChange(entry.category.id, e.target.value)}
                  // onKeyDown={e => handleInputChange(entry.category.id, e.target.value)}
                  disabled={entry.category.id === 6}>
                </Form.Control> */}
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
  );
};
export default CategoriesTable;
