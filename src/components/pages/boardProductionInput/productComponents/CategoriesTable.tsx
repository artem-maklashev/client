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
    <Form>
      {categories.length > 0 ? (
        categories.map((entry) => (
          <Form.Group key={entry.category.id} className="row align-items-center mt-1" controlId={`category-${entry.category.id}`}>
            <Form.Label className="col-sm-8 col-form-label ">
              {entry.category.title}
              {entry.category.id === 6 && <span className="text-muted ms-2"></span>}
            </Form.Label>
            <div className="col-sm-4">
              <td className="p-0 align-middle">
                <Form.Control
                  type="number"
                  value={entry.value === 0 ? '' : entry.value} // Очищаем 0 для удобства ввода
                  placeholder={`${entry.category.title.toLowerCase()}`}
                  disabled={entry.category.id === 6}
                  onChange={(e) => {
                    const rawValue = e.target.value;
                    const value = rawValue === '' ? 0 : parseFloat(rawValue);

                    if (isNaN(value)) return;

                    const updatedEntry = new BoardProduction(
                      entry.id,
                      entry.productionList,
                      entry.product,
                      entry.category,
                      value
                    );

                    // Обязательно передаем обновленный объект в родительское состояние:
                    handleEditCategory(updatedEntry);
                  }}
                  className={`cell-input ${entry.category.id === 6 ? 'bg-transparent border-0' : ''}`}
                />
              </td>
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
