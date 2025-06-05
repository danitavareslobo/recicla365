import React from 'react';
import type { LocalColeta, TipoResiduo } from '../../context/CollectionPointsContext';
import './LocationCard.css';

interface LocationCardProps {
  local: LocalColeta;
}

const LocationCard: React.FC<LocationCardProps> = ({ local }) => {
  const formatarData = (dataISO: string) => {
    return new Date(dataISO).toLocaleDateString('pt-BR');
  };

  const getIconeResiduo = (tipo: TipoResiduo) => {
    const icones = {
      'Vidro': '🥃',
      'Metal': '⚙️',
      'Papel': '📄',
      'Plástico': '♻️',
      'Orgânico': '🌱',
      'Baterias': '🔋',
      'Eletrônicos': '💻',
      'Óleo': '🛢️'
    };
    return icones[tipo] || '♻️';
  };

  const getCorResiduo = (tipo: TipoResiduo) => {
    const cores = {
      'Vidro': '#3498db',
      'Metal': '#95a5a6',
      'Papel': '#2ecc71',
      'Plástico': '#e74c3c',
      'Orgânico': '#27ae60',
      'Baterias': '#f39c12',
      'Eletrônicos': '#9b59b6',
      'Óleo': '#34495e'
    };
    return cores[tipo] || '#7f8c8d';
  };

  return (
    <div className="location-card">
      <div className="location-card__header">
        <div className="location-card__title-section">
          <h3 className="location-card__title">{local.nomeLocal}</h3>
          <div className="location-card__status">
            <span className={`location-card__status-badge ${local.ativo ? 'active' : 'inactive'}`}>
              {local.ativo ? 'Ativo' : 'Inativo'}
            </span>
          </div>
        </div>
        <p className="location-card__description">{local.descricaoLocal}</p>
      </div>

      <div className="location-card__content">
        <div className="location-card__location">
          <div className="location-card__location-icon">📍</div>
          <div className="location-card__location-info">
            <p className="location-card__address">
              {local.localizacao.logradouro}, {local.localizacao.numero}
            </p>
            <p className="location-card__neighborhood">
              {local.localizacao.bairro} - {local.localizacao.cidade}/{local.localizacao.estado}
            </p>
            <p className="location-card__cep">CEP: {local.localizacao.cep}</p>
          </div>
        </div>

        <div className="location-card__waste-types">
          <h4 className="location-card__waste-title">Tipos de Resíduos Aceitos:</h4>
          <div className="location-card__waste-list">
            {local.tiposResiduos.map((tipo, index) => (
              <span
                key={index}
                className="location-card__waste-chip"
                style={{ backgroundColor: getCorResiduo(tipo) }}
              >
                <span className="location-card__waste-icon">{getIconeResiduo(tipo)}</span>
                {tipo}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="location-card__footer">
        <div className="location-card__date">
          <span className="location-card__date-label">Cadastrado em:</span>
          <span className="location-card__date-value">{formatarData(local.dataCadastro)}</span>
        </div>
        {local.localizacao.latitude && local.localizacao.longitude && (
          <div className="location-card__coordinates">
            <span className="location-card__coordinates-icon">🌐</span>
            <span className="location-card__coordinates-text">
              {local.localizacao.latitude.toFixed(4)}, {local.localizacao.longitude.toFixed(4)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationCard;