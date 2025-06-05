import React, { useState, useMemo } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Loading from '../../components/Loading/Loading';
import FormField from '../../components/Form/FormField/FormField';
import FormSelect from '../../components/Form/FormSelect/FormSelect';
import { useCollectionPoints } from '../../context/CollectionPointsContext';
import type { TipoResiduo } from '../../context/CollectionPointsContext';
import './ListagemLocais.css';

const ListagemLocais: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { locaisColeta } = useCollectionPoints();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTipoResiduo, setSelectedTipoResiduo] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  const tiposResiduosOptions = [
    { value: '', label: 'Todos os tipos' },
    { value: 'Vidro', label: 'Vidro' },
    { value: 'Metal', label: 'Metal' },
    { value: 'Papel', label: 'Papel' },
    { value: 'Plástico', label: 'Plástico' },
    { value: 'Orgânico', label: 'Orgânico' },
    { value: 'Baterias', label: 'Baterias' },
    { value: 'Eletrônicos', label: 'Eletrônicos' },
    { value: 'Óleo', label: 'Óleo' }
  ];

  const statusOptions = [
    { value: '', label: 'Todos os status' },
    { value: 'ativo', label: 'Apenas ativos' },
    { value: 'inativo', label: 'Apenas inativos' }
  ];

  const locaisFiltrados = useMemo(() => {
    return locaisColeta.filter(local => {
      const matchesSearch = searchTerm === '' || 
        local.nomeLocal.toLowerCase().includes(searchTerm.toLowerCase()) ||
        local.localizacao.logradouro.toLowerCase().includes(searchTerm.toLowerCase()) ||
        local.localizacao.bairro.toLowerCase().includes(searchTerm.toLowerCase()) ||
        local.localizacao.cidade.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesTipoResiduo = selectedTipoResiduo === '' ||
        local.tiposResiduos.includes(selectedTipoResiduo as TipoResiduo);

      const matchesStatus = selectedStatus === '' ||
        (selectedStatus === 'ativo' && local.ativo) ||
        (selectedStatus === 'inativo' && !local.ativo);

      return matchesSearch && matchesTipoResiduo && matchesStatus;
    });
  }, [locaisColeta, searchTerm, selectedTipoResiduo, selectedStatus]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedTipoResiduo('');
    setSelectedStatus('');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleTipoResiduoChange = (value: string | number | string[] | number[]) => {
    setSelectedTipoResiduo(String(value));
  };

  const handleStatusChange = (value: string | number | string[] | number[]) => {
    setSelectedStatus(String(value));
  };

  return (
    <div className="listagem-locais-page">
      <Navbar />
      
      {isLoading && (
        <div className="listagem-locais__loading">
          <Loading />
        </div>
      )}

      <div className="listagem-locais">
        <div className="listagem-locais__header">
          <h1 className="listagem-locais__title">Locais de Coleta</h1>
          <p className="listagem-locais__subtitle">
            Gerencie todos os pontos de coleta cadastrados na plataforma
          </p>
        </div>

        <div className="listagem-locais__content">
          <div className="listagem-locais__filters">
            <h2 className="filters__title">Filtros e Busca</h2>
            
            <div className="filters__row">
              <div className="filters__search">
                <FormField
                  label="Buscar por nome ou endereço"
                  name="search"
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Digite o nome do local ou endereço..."
                />
              </div>

              <div className="filters__select">
                <FormSelect
                  label="Tipo de Resíduo"
                  name="tipoResiduo"
                  value={selectedTipoResiduo}
                  onChange={handleTipoResiduoChange}
                  options={tiposResiduosOptions}
                />
              </div>

              <div className="filters__select">
                <FormSelect
                  label="Status"
                  name="status"
                  value={selectedStatus}
                  onChange={handleStatusChange}
                  options={statusOptions}
                />
              </div>
            </div>

            <div className="filters__info">
              <div className="filters__results">
                📍 {locaisFiltrados.length} {locaisFiltrados.length === 1 ? 'local encontrado' : 'locais encontrados'}
                {locaisFiltrados.length !== locaisColeta.length && (
                  <span className="filters__total"> de {locaisColeta.length} total</span>
                )}
              </div>
              
              {(searchTerm || selectedTipoResiduo || selectedStatus) && (
                <button 
                  type="button"
                  onClick={handleClearFilters}
                  className="filters__clear-btn"
                >
                  ✖️ Limpar filtros
                </button>
              )}
            </div>
          </div>

          <div className="listagem-locais__list">
            <div className="listagem-locais__placeholder">
              Lista de locais com botões de ação será implementada em etapas posteriores
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListagemLocais;