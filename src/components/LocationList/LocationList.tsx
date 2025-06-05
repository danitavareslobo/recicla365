import React from 'react';
import LocationCard from '../LocationCard/LocationCard';
import Button from '../Button/Button';
import type { LocalColeta } from '../../context/CollectionPointsContext';
import './LocationList.css';

interface LocationListProps {
  locais: LocalColeta[];
  viewMode: 'cards' | 'table';
  onView: (local: LocalColeta) => void;
  onEdit: (local: LocalColeta) => void;
  onDelete: (local: LocalColeta) => void;
  loading?: boolean;
}

const LocationList: React.FC<LocationListProps> = ({
  locais,
  viewMode,
  onView,
  onEdit,
  onDelete,
  loading = false
}) => {
  const formatarData = (dataISO: string) => {
    return new Date(dataISO).toLocaleDateString('pt-BR');
  };

  const getStatusBadge = (ativo: boolean) => {
    return (
      <span className={`status-badge ${ativo ? 'status-badge--active' : 'status-badge--inactive'}`}>
        {ativo ? '✅ Ativo' : '❌ Inativo'}
      </span>
    );
  };

  const getTiposResiduosText = (tipos: string[]) => {
    if (tipos.length <= 3) {
      return tipos.join(', ');
    }
    return `${tipos.slice(0, 3).join(', ')} +${tipos.length - 3}`;
  };

  const getIconeResiduo = (tipo: string) => {
    const icones: Record<string, string> = {
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

  if (loading) {
    return (
      <div className="location-list location-list--loading">
        <div className="location-list__loading-items">
          {[1, 2, 3].map(i => (
            <div key={i} className="location-list__loading-item">
              <div className="loading-skeleton">
                <div className="skeleton-line skeleton-line--title"></div>
                <div className="skeleton-line skeleton-line--content"></div>
                <div className="skeleton-line skeleton-line--short"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (viewMode === 'cards') {
    return (
      <div className="location-list location-list--cards">
        <div className="location-cards-grid">
          {locais.map((local) => (
            <div key={local.id} className="location-card-wrapper">
              <LocationCard local={local} />
              
              <div className="location-card__actions">
                <Button
                  variant="view"
                  onClick={() => onView(local)}
                  size="small"
                  icon="👁️"
                  tooltip="Visualizar detalhes do local"
                >
                  Ver
                </Button>
                
                <Button
                  variant="edit"
                  onClick={() => onEdit(local)}
                  size="small"
                  icon="✏️"
                  tooltip="Editar informações do local"
                >
                  Editar
                </Button>
                
                <Button
                  variant="delete"
                  onClick={() => onDelete(local)}
                  size="small"
                  icon="🗑️"
                  tooltip="Excluir local permanentemente"
                  confirmMessage={`Tem certeza que deseja excluir o local "${local.nomeLocal}"?\n\nEsta ação não pode ser desfeita e removerá permanentemente:\n• Todas as informações do local\n• Histórico de cadastro\n• Configurações de tipos de resíduos`}
                >
                  Excluir
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="location-list location-list--table">
      <div className="location-table">
        <div className="location-table__header">
          <div className="location-table__header-cell location-table__header-cell--name">
            <span className="table-header-icon">🏷️</span>
            Local
          </div>
          <div className="location-table__header-cell location-table__header-cell--location">
            <span className="table-header-icon">📍</span>
            Localização
          </div>
          <div className="location-table__header-cell location-table__header-cell--types">
            <span className="table-header-icon">♻️</span>
            Tipos de Resíduos
          </div>
          <div className="location-table__header-cell location-table__header-cell--status">
            <span className="table-header-icon">📊</span>
            Status
          </div>
          <div className="location-table__header-cell location-table__header-cell--date">
            <span className="table-header-icon">📅</span>
            Data
          </div>
          <div className="location-table__header-cell location-table__header-cell--actions">
            <span className="table-header-icon">⚙️</span>
            Ações
          </div>
        </div>

        <div className="location-table__body">
          {locais.map((local, index) => (
            <div 
              key={local.id} 
              className={`location-table__row ${index % 2 === 0 ? 'even' : 'odd'}`}
            >
              <div className="location-table__cell location-table__cell--name">
                <div className="location-table__name">
                  <h4 className="location-table__title">{local.nomeLocal}</h4>
                  <p className="location-table__description">{local.descricaoLocal}</p>
                </div>
              </div>

              <div className="location-table__cell location-table__cell--location">
                <div className="location-table__address">
                  <p className="location-table__address-line">
                    <strong>{local.localizacao.logradouro}, {local.localizacao.numero}</strong>
                  </p>
                  <p className="location-table__address-line">
                    {local.localizacao.bairro}
                  </p>
                  <p className="location-table__address-line">
                    {local.localizacao.cidade}/{local.localizacao.estado}
                  </p>
                  <p className="location-table__address-line location-table__cep">
                    CEP: {local.localizacao.cep}
                  </p>
                </div>
              </div>

              <div className="location-table__cell location-table__cell--types">
                <div className="location-table__waste-types">
                  <div className="waste-types-chips">
                    {local.tiposResiduos.slice(0, 2).map((tipo) => (
                      <span key={tipo} className="waste-type-chip">
                        <span className="waste-type-chip__icon">{getIconeResiduo(tipo)}</span>
                        {tipo}
                      </span>
                    ))}
                    {local.tiposResiduos.length > 2 && (
                      <span className="waste-types-more">
                        +{local.tiposResiduos.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="location-table__cell location-table__cell--status">
                {getStatusBadge(local.ativo)}
              </div>

              <div className="location-table__cell location-table__cell--date">
                <span className="location-table__date">
                  {formatarData(local.dataCadastro)}
                </span>
              </div>

              <div className="location-table__cell location-table__cell--actions">
                <div className="location-table__actions">
                  <Button
                    variant="view"
                    onClick={() => onView(local)}
                    size="small"
                    icon="👁️"
                    tooltip="Visualizar detalhes"
                  >
                    Ver
                  </Button>
                  
                  <Button
                    variant="edit"
                    onClick={() => onEdit(local)}
                    size="small"
                    icon="✏️"
                    tooltip="Editar local"
                  >
                    Editar
                  </Button>
                  
                  <Button
                    variant="delete"
                    onClick={() => onDelete(local)}
                    size="small"
                    icon="🗑️"
                    tooltip="Excluir local"
                    confirmMessage={`Tem certeza que deseja excluir o local "${local.nomeLocal}"? Esta ação não pode ser desfeita.`}
                  >
                    Excluir
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LocationList;