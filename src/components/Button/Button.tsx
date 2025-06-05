import React from 'react';
import './Button.css';

interface ButtonProps {
  variant: 'view' | 'edit' | 'delete' | 'primary' | 'secondary';
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  size?: 'small' | 'medium' | 'large';
  icon?: string;
  children: React.ReactNode;
  tooltip?: string;
  confirmMessage?: string; 
}

const Button: React.FC<ButtonProps> = ({
  variant,
  onClick,
  disabled = false,
  loading = false,
  size = 'medium',
  icon,
  children,
  tooltip,
  confirmMessage
}) => {
  const handleClick = () => {
    if (disabled || loading) return;
    
    if (confirmMessage) {
      const confirmed = window.confirm(confirmMessage);
      if (!confirmed) return;
    }
    
    onClick();
  };

  const getVariantClasses = () => {
    const variants = {
      view: 'action-button--view',
      edit: 'action-button--edit', 
      delete: 'action-button--delete',
      primary: 'action-button--primary',
      secondary: 'action-button--secondary'
    };
    return variants[variant];
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || loading}
      className={`action-button ${getVariantClasses()} action-button--${size} ${disabled ? 'disabled' : ''} ${loading ? 'loading' : ''}`}
      title={tooltip}
    >
      {loading ? (
        <span className="action-button__loading">⏳</span>
      ) : (
        <>
          {icon && <span className="action-button__icon">{icon}</span>}
          <span className="action-button__text">{children}</span>
        </>
      )}
    </button>
  );
};

export default Button;