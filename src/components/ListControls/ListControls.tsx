import React from 'react';
import FormSelect from '../Form/FormSelect/FormSelect';
import Button from '../Button/Button';
import './ListControls.css';

interface ListControlsProps {
  totalItems: number;
  filteredItems: number;
  viewMode: 'cards' | 'table';
  onViewModeChange: (mode: 'cards' | 'table') => void;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  onAddNew?: () => void;
  loading?: boolean;
}

const ListControls: React.FC<ListControlsProps> = ({
  totalItems,
  filteredItems,
  viewMode,
  onViewModeChange,
  sortBy,
  sortOrder,
  onSortChange,
  onAddNew,
  loading = false
}) => {
  const sortOptions = [
    { value: 'nomeLocal-asc', label: 'Nome (A-Z)' },
    { value: 'nomeLocal-desc', label: 'Nome (Z-A)' },
    { value: 'dataCadastro-desc', label: 'Mais recentes' },
    { value: 'dataCadastro-asc', label: 'Mais antigos' },
    { value: 'cidade-asc', label: 'Cidade (A-Z)' },
    { value: 'cidade-desc', label: 'Cidade (Z-A)' },
    { value: 'status-desc', label: 'Status (Ativos primeiro)' },
    { value: 'status-asc', label: 'Status (Inativos primeiro)' }
  ];

  const handleSortChange = (value: string | number | string[] | number[]) => {
    const sortValue = String(value);
    const [field, order] = sortValue.split('-');
    onSortChange(field, order as 'asc' | 'desc');
  };

  const getCurrentSortValue = () => {
    return `${sortBy}-${sortOrder}`;
  };

  const getItemsText = () => {
    if (filteredItems === totalItems) {
      return `${totalItems} ${totalItems === 1 ? 'item' : 'itens'}`;
    }
    return `${filteredItems} de ${totalItems} ${totalItems === 1 ? 'item' : 'itens'}`;
  };

  return (
    <div className="list-controls">
      <div className="list-controls__info">
        <div className="list-controls__count">
          <span className="list-controls__count-icon">📊</span>
          <span className="list-controls__count-text">
            {getItemsText()}
          </span>
          {filteredItems !== totalItems && (
            <span className="list-controls__filtered-badge">Filtrado</span>
          )}
        </div>
      </div>

      <div className="list-controls__actions">
        <div className="list-controls__sort">
          <FormSelect
            name="sort"
            label=""
            value={getCurrentSortValue()}
            onChange={handleSortChange}
            options={sortOptions}
            size="small"
            placeholder="Ordenar por..."
            disabled={loading}
            tooltip="Escolha como ordenar a lista"
          />
        </div>

        <div className="list-controls__view-mode">
          <button
            type="button"
            onClick={() => onViewModeChange('cards')}
            disabled={loading}
            className={`view-mode-button ${viewMode === 'cards' ? 'active' : ''}`}
            title="Visualização em cards"
          >
            <span className="view-mode-icon">⊞</span>
            <span className="view-mode-label">Cards</span>
          </button>
          
          <button
            type="button"
            onClick={() => onViewModeChange('table')}
            disabled={loading}
            className={`view-mode-button ${viewMode === 'table' ? 'active' : ''}`}
            title="Visualização em tabela"
          >
            <span className="view-mode-icon">☰</span>
            <span className="view-mode-label">Tabela</span>
          </button>
        </div>

        {onAddNew && (
          <div className="list-controls__add">
            <Button
              variant="primary"
              onClick={onAddNew}
              size="medium"
              icon="➕"
              disabled={loading}
              tooltip="Adicionar novo item"
            >
              Adicionar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListControls;