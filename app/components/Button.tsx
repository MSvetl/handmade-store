import React from 'react';

/**
 * Интерфейс пропсов для компонента Button
 * @property {() => void} onClick - Обработчик клика по кнопке
 * @property {React.ReactNode} children - Содержимое кнопки
 * @property {boolean} disabled - Флаг отключения кнопки
 * @property {string} className - Дополнительные CSS классы
 */
interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

/**
 * Переиспользуемый компонент кнопки
 * 
 * @component
 * @example
 * ```tsx
 * <Button 
 *   onClick={() => console.log('clicked')}
 *   disabled={false}
 *   className="custom-class"
 * >
 *   Click me
 * </Button>
 * ```
 */
const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  disabled = false,
  className = '',
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
};

export default Button; 