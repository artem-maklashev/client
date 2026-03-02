import { Alert, Button, Form, Table } from "react-bootstrap";
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
  // const handleInputChange = (id: number, newValue: string) => {
  //   setData(prevData =>
  //     prevData.map(row =>
  //       row.id === id ? { ...row, value: newValue } : row
  //     )
  //   );
  //   // alert("Введено значение: " + newValue + " в категорию " + categories.find(cat => cat.category.id === id)?.category.title);
  // };
  return (
    <Form className='mb-4'>
      {categories.length > 0 ? (
        categories.map((entry) => (
          <Form.Group key={entry.category.id} className="row align-items-center mt-1" controlId={`category-${entry.category.id}`}>
            <Form.Label className="col-sm-8 col-form-label fw-bold">
              {entry.category.title}
              {entry.category.id === 6 && <span className="text-muted ms-2"></span>}
            </Form.Label>
            <div className="col-sm-4">
              <Form.Control
                type="number"
                value={entry.value}
                placeholder={`Введите значение для ${entry.category.title.toLowerCase()}`}
                onChange={(e) => {
                  const value = e.target.value === '' ? 0 : parseFloat(e.target.value) || entry.value;
                  const updatedEntry = new BoardProduction(
                    entry.id,
                    entry.productionList,
                    entry.product,
                    entry.category,
                    value
                  );
                  handleEditCategory(updatedEntry);
                }}
                disabled={entry.category.id === 6}
                className={entry.category.id !== 6 ? "border-light bg-light" : ""}
              />
            </div>
          </Form.Group>
        ))
      ) : (
        <Alert variant="info">Нет данных для отображения</Alert>
      )}
    </Form>
  );
};
export default CategoriesTable;
