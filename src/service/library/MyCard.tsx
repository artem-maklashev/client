import React from "react";

interface CardProps {
  label?: string;
  value: React.ReactNode;
  valueColor?: string;
  labelFontSize?: string;
  labelAlign?: 'left' | 'center' | 'right';
  labelPosition?: {
    top?: string | number;
    left?: string | number;
    right?: string | number;
    bottom?: string | number;
  };
  labelVariant?: 'floating' | 'inline' | 'top';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  withBorder?: boolean;
  className?: string;
  onClick?: () => void;
}

const MyCard: React.FC<CardProps> = ({
  label,
  value,
  valueColor,
  onClick,
  labelFontSize = '12px',
  labelAlign = 'left',
  labelPosition,
  labelVariant = 'floating',
  size = 'md',
  variant = 'default',
  withBorder = false,
  className = '',
  ...props
}) => {
  // Размеры карточки
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { padding: '12px 16px', minHeight: '80px' };
      case 'lg':
        return { padding: '24px 20px', minHeight: '120px' };
      default:
        return { padding: '16px 18px', minHeight: '100px' };
    }
  };

  // Варианты стилей карточки
  const getVariantStyles = () => {
    const baseStyles = {
      background: 'linear-gradient(145deg, #ffffff, #f8fafc)',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.03)',
      borderRadius: '12px',
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyles,
          border: withBorder ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid rgba(0, 0, 0, 0.06)',
          background: 'linear-gradient(145deg, #f0f4ff, #e8eefe)',
        };
      case 'success':
        return {
          ...baseStyles,
          border: withBorder ? '1px solid rgba(34, 197, 94, 0.2)' : '1px solid rgba(0, 0, 0, 0.06)',
          background: 'linear-gradient(145deg, #f0fdf4, #e8fce8)',
        };
      case 'warning':
        return {
          ...baseStyles,
          border: withBorder ? '1px solid rgba(251, 191, 36, 0.2)' : '1px solid rgba(0, 0, 0, 0.06)',
          background: 'linear-gradient(145deg, #fffbeb, #fefce8)',
        };
      case 'danger':
        return {
          ...baseStyles,
          border: withBorder ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid rgba(0, 0, 0, 0.06)',
          background: 'linear-gradient(145deg, #fef2f2, #fdeeee)',
        };
      default:
        return {
          ...baseStyles,
          border: withBorder ? '1px solid rgba(0, 0, 0, 0.08)' : '1px solid rgba(0, 0, 0, 0.06)',
        };
    }
  };

  // Позиция лейбла по умолчанию в зависимости от варианта
  const getDefaultLabelPosition = () => {
    if (labelPosition) return labelPosition;
    
    switch (labelVariant) {
      case 'inline':
        return { top: '8px', left: '16px' };
      case 'top':
        return { top: '0px', left: '0px' };
      default: // floating
        return { top: '-10px', left: '16px' };
    }
  };

  const labelPositionStyles = getDefaultLabelPosition();

  // Стили для разных вариантов лейбла
  const getLabelVariantStyles = () => {
    switch (labelVariant) {
      case 'inline':
        return {
          position: 'static' as const,
          transform: 'none',
          marginBottom: '8px',
          display: 'inline-block',
        };
      case 'top':
        return {
          position: 'static' as const,
          transform: 'none',
          width: '100%',
          marginBottom: '12px',
          padding: '8px 12px',
          background: 'rgba(0, 0, 0, 0.03)',
          borderRadius: '8px',
        };
      default: // floating
        return {
          position: 'absolute' as const,
          top: labelPositionStyles.top,
          left: labelPositionStyles.left,
          right: labelPositionStyles.right,
          bottom: labelPositionStyles.bottom,
        };
    }
  };

  return (
    <div
      className={`myCard ${className}`}
      onClick={onClick}
      style={{
        cursor: onClick ? "pointer" : "default",
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        width: '100%',
        transition: 'all 0.2s ease-in-out',
        ...getSizeStyles(),
        ...getVariantStyles(),
        ...(onClick && {
          cursor: 'pointer',
          ':hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08), 0 8px 24px rgba(0, 0, 0, 0.06)',
          }
        }),
      }}
      {...props}
    >
      {label && (
        <div
          className="myCard__label"
          style={{
            fontSize: labelFontSize,
            textAlign: labelAlign,
            border: '1px solid rgba(0, 0, 0, 0.08)',
            ...getLabelVariantStyles(),
          }}
        >
          {label}
        </div>
      )}
      
      <div
        className="myCard__value"
        style={{
          color: valueColor || '#1e293b',
          textAlign: 'center',
          fontWeight: 600,
          fontSize: size === 'sm' ? '18px' : size === 'lg' ? '28px' : '22px',
          lineHeight: 1.3,
          marginTop: label && labelVariant === 'floating' ? '16px' : '0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '32px',
        }}
      >
        {value}
      </div>
    </div>
  );
};

export default MyCard;