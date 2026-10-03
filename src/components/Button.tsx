import React from 'react';
import './Button.css';

export type ButtonVariant = 'gold' | 'purple' | 'orange' | 'blue' | 'pink' | 'green' | 'red';
export type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  label: string;
  icon?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  icon,
  variant = 'gold',
  size = 'medium',
  onClick,
  disabled = false,
  className = '',
  children,
}) => {
  return (
    <button
      className={`btn btn-${variant} btn-${size} ${disabled ? 'btn-disabled' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
      title={label}
    >
      {icon && <div className="btn-icon">{icon}</div>}
      <span className="btn-label">{children || label}</span>
    </button>
  );
};
