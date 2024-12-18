import React from "react";

interface CardProps {
  label?: string; // Метка теперь необязательна
  value: React.ReactNode; // Поддержка строк, чисел и JSX
  valueColor?: string;
  labelFontSize?: string;
  labelAlign?: 'left' | 'center' | 'right'; // Позиция label
  labelPosition?: {
    top?: string | number;  // Расположение сверху
    left?: string | number; // Расположение слева
    right?: string | number; // Расположение справа
    bottom?: string | number; // Расположение снизу
  };
  onClick?: () => void;
}

const MyCard: React.FC<CardProps> = ({
  label,
  value,
  valueColor,
  onClick,
  labelFontSize = '12px',
  labelAlign = 'left',
  labelPosition = { top: '-10px', left: '10px' }, // Значения по умолчанию
}) => {
  return (
    <div
      className="myCard mt-2 mb-3"
      onClick={onClick}
      style={{
        cursor: onClick ? "pointer" : "default",
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative', // Для правильного позиционирования label
        padding: '10px 10px 10px', // Обеспечиваем отступы для карточки
        width: '100%', // Ширина карточки должна быть 100% от родителя
        background: 'linear-gradient(to bottom right, #f5f5f5, #e0e0e0)',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px', // Скругленные углы

      }}
    >

      {/* Условие, чтобы label отображался только если он есть */}
      {/* <div className="icon"></div> */}
      {label && (
        <div
          className="myCard__label"
          style={{
            fontSize: labelFontSize,
            textAlign: labelAlign,
            position: 'absolute',
            top: labelPosition.top,  // Используем значение top
            left: labelPosition.left, // Используем значение left
            right: labelPosition.right, // Используем значение right, если нужно
            bottom: labelPosition.bottom, // Используем значение bottom, если нужно
            // background: 'white',
            // border: '1px solid #ccc',
            // borderRadius: '12px',
            // padding: '0 5px',
            // fontWeight: '600',
            // color: '#555',
            // zIndex: 10, // Чтобы метка была поверх других элементов
            whiteSpace: 'nowrap', // Запрещает перенос строки и обрезание
            maxWidth: '90%', // Устанавливаем максимальную ширину метки в 90% от контейнера
            overflow: 'hidden', // Прячет переполнение
            textOverflow: 'ellipsis', // Добавляет многоточие, если текст не помещается
          }}
        >
          {label}
          <div className="icon"></div>
        </div>
      )}
      <div
        className="myCard__value"
        style={{
          color: valueColor,
          // marginTop: '5px', // Добавляем отступ сверху для контента, если есть метка
          textAlign: 'center', // Центрируем значение
        }}
      >
        {value} {/* Отображаем любой React-элемент */}
      </div>
    </div>
  );
};

export default MyCard;
