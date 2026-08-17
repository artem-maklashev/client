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
    <Form className="d-flex flex-column gap-2 bg-light " >
      {categories && categories.length > 0 ? (
        categories.map((entry) => {
          const isHighlighted = entry.category.id === 6; // Неопределенное качество / расчетное поле

          return (
            <Form.Group
              key={entry.category.id}
              controlId={`category-${entry.category.id}`}
              className={`d-flex align-items-center justify-content-between p-2 rounded-2 transition-all ${
                isHighlighted
                  ? 'bg-warning bg-opacity-10 border border-warning shadow-sm'
                  : 'bg-white border border-light-subtle'
              }`}
            >
              {/* Название категории слева */}
              <Form.Label
                className={`mb-0 small fw-medium text-truncate pe-2 ${
                  isHighlighted ? 'text-secondary' : 'text-dark fw-semibold'
                }`}
                style={{ cursor: 'pointer' }}
              >
                {entry.category.title}
              </Form.Label>

              {/* Поле ввода справа */}
              <Form.Control
                type="number"
                step="any"
                size="sm"
                value={entry.value === 0 ? '' : entry.value}
                placeholder={isHighlighted ? '—' : '0.00'}
                disabled={isHighlighted}
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

                  handleEditCategory(updatedEntry);
                }}
                className={`text-end fw-semibold ${
                  isHighlighted
                    ? 'bg-warning text-secondary disabled border-warning'
                    : 'bg-white text-dark'
                }`}
                style={{
                  width: '130px',
                  minWidth: '110px'
                }}
              />
            </Form.Group>
          );
        })
      ) : (
        <Alert variant="info" className="py-2 small mb-0 text-center">
          Нет данных для отображения
        </Alert>
      )}
    </Form>
  );
};
export default CategoriesTable;
