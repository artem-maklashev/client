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
      className="myCard mt-2 mb-2"
      onClick={onClick}
      style={{
        cursor: onClick ? "pointer" : "default",
        display: 'flex',
        flexDirection: 'column',
        justifyContent: labelAlign === 'left' ? 'flex-start' : labelAlign === 'center' ? 'center' : 'flex-end',
      }}
    >
      {/* Условие, чтобы label отображался только если он есть */}
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
            background: 'white',
            border: '1px solid #ccc',
            borderRadius: '12px',
            padding: '0 5px',
            fontWeight: '600',
            color: '#555',
          }}
        >
          {label}
        </div>
      )}
      <div
        className="myCard__value"
        style={{ color: valueColor }}
      >
        {value} {/* Отображаем любой React-элемент */}
      </div>
    </div>
  );
};

export default MyCard;
