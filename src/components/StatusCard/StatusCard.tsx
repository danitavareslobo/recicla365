import React from 'react';
import './StatusCard.css';

interface StatusCardProps {
  title: string;
  value: number;
  icon: string;
  color: 'green' | 'blue' | 'orange' | 'purple';
  description?: string;
}

const StatusCard: React.FC<StatusCardProps> = ({
  title,
  value,
  icon,
  color,
  description
}) => {
  return (
    <div className={`status-card status-card--${color}`}>
      <div className="status-card__header">
        <div className="status-card__icon">
          <span className="status-card__icon-text">{icon}</span>
        </div>
        <div className="status-card__info">
          <h3 className="status-card__title">{title}</h3>
          {description && (
            <p className="status-card__description">{description}</p>
          )}
        </div>
      </div>
      
      <div className="status-card__value">
        <span className="status-card__number">{value.toLocaleString()}</span>
      </div>
      
      <div className="status-card__footer">
        <div className="status-card__indicator">
          <span className="status-card__indicator-dot"></span>
          <span className="status-card__indicator-text">Ativo</span>
        </div>
      </div>
    </div>
  );
};

export default StatusCard;