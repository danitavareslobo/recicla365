import React from 'react';
import Button from '../Button/Button';
import './EmptyState.css';

interface EmptyStateProps {
  type: 'no-data' | 'no-results' | 'error';
  title: string;
  description: string;
  icon?: string;
  actionButton?: {
    text: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'view' | 'edit' | 'delete';
  };
  secondaryButton?: {
    text: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'view' | 'edit' | 'delete';
  };
}

const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  title,
  description,
  icon,
  actionButton,
  secondaryButton
}) => {
  const getDefaultIcon = () => {
    const icons = {
      'no-data': '📍',
      'no-results': '🔍',
      'error': '⚠️'
    };
    return icons[type];
  };

  const displayIcon = icon || getDefaultIcon();

  return (
    <div className={`empty-state empty-state--${type}`}>
      <div className="empty-state__content">
        <div className="empty-state__icon">
          <span className="empty-state__icon-text">{displayIcon}</span>
        </div>
        
        <div className="empty-state__text">
          <h3 className="empty-state__title">{title}</h3>
          <p className="empty-state__description">{description}</p>
        </div>

        {(actionButton || secondaryButton) && (
          <div className="empty-state__actions">
            {actionButton && (
              <Button
                variant={actionButton.variant || 'primary'}
                onClick={actionButton.onClick}
                size="medium"
                icon="➕"
              >
                {actionButton.text}
              </Button>
            )}
            
            {secondaryButton && (
              <Button
                variant={secondaryButton.variant || 'secondary'}
                onClick={secondaryButton.onClick}
                size="medium"
                icon="🔄"
              >
                {secondaryButton.text}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmptyState;