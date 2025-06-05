import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Loading from '../../components/Loading/Loading';
import FormField from '../../components/Form/FormField/FormField';
import FormSelect from '../../components/Form/FormSelect/FormSelect';
import Button from '../../components/Button/Button';
import EmptyState from '../../components/EmptyState/EmptyState';
import { useCollectionPoints } from '../../context/CollectionPointsContext';
import type { TipoResiduo } from '../../context/CollectionPointsContext';
import './ListagemLocais.css';

const ListagemLocais: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { locaisColeta } = useCollectionPoints();
  const navigate = useNavigate();

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

  const handleAddNew = () => {
    navigate('/cadastro-local');
  };

  const hasActiveFilters = searchTerm || selectedTipoResiduo || selectedStatus;

  return (
    <div className="listagem-locais-page">
      <Navbar />
      
      {isLoading && (
        <div className="listagem-locais__loading">
          <Loading 
            text="Carregando locais..." 
            fullScreen={false}
            withLogo={false}
          />
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
              
              {hasActiveFilters && (
                <Button 
                  variant="secondary"
                  onClick={handleClearFilters}
                  size="small"
                  icon="✖️"
                  tooltip="Remover todos os filtros aplicados"
                >
                  Limpar filtros
                </Button>
              )}
            </div>
          </div>

          {locaisColeta.length > 0 && (
            <div className="listagem-locais__list-header">
              <div className="list-header__info">
                <h3 className="list-header__title">
                  {locaisFiltrados.length === locaisColeta.length 
                    ? `Todos os locais (${locaisColeta.length})`
                    : `Resultados filtrados (${locaisFiltrados.length} de ${locaisColeta.length})`
                  }
                </h3>
              </div>
              
              <div className="list-header__actions">
                <Button
                  variant="primary"
                  onClick={handleAddNew}
                  size="medium"
                  icon="➕"
                  tooltip="Cadastrar novo local de coleta"
                >
                  Adicionar Local
                </Button>
              </div>
            </div>
          )}

          <div className="listagem-locais__list">
            {locaisColeta.length === 0 ? (
              <EmptyState
                type="no-data"
                title="Nenhum local cadastrado"
                description="Ainda não há locais de coleta cadastrados na plataforma. Comece adicionando o primeiro local para começar a gerenciar os pontos de coleta de resíduos."
                actionButton={{
                  text: "Cadastrar Primeiro Local",
                  onClick: handleAddNew,
                  variant: "primary"
                }}
              />
            ) : 
            locaisFiltrados.length === 0 ? (
              <EmptyState
                type="no-results"
                title="Nenhum resultado encontrado"
                description={hasActiveFilters 
                  ? "Não encontramos locais que correspondam aos filtros aplicados. Tente ajustar os critérios de busca ou remover alguns filtros."
                  : "Nenhum local encontrado."
                }
                actionButton={{
                  text: "Limpar Filtros",
                  onClick: handleClearFilters,
                  variant: "secondary"
                }}
                secondaryButton={{
                  text: "Cadastrar Novo Local",
                  onClick: handleAddNew,
                  variant: "primary"
                }}
              />
            ) : 
            (
              <div className="listagem-locais__results">
                <div className="results-preview">
                  <div className="results-preview__header">
                    <h4 className="results-preview__title">
                      📍 Locais encontrados ({locaisFiltrados.length})
                    </h4>
                    <p className="results-preview__subtitle">
                      Lista completa com cards e ações será implementada nas próximas etapas
                    </p>
                  </div>
                  
                  <div className="results-preview__list">
                    {locaisFiltrados.slice(0, 5).map((local) => (
                      <div key={local.id} className="result-preview-item">
                        <div className="result-preview-item__header">
                          <h5 className="result-preview-item__name">{local.nomeLocal}</h5>
                          <span className={`result-preview-item__status ${local.ativo ? 'active' : 'inactive'}`}>
                            {local.ativo ? '✅ Ativo' : '❌ Inativo'}
                          </span>
                        </div>
                        
                        <div className="result-preview-item__info">
                          <p className="result-preview-item__address">
                            📍 {local.localizacao.logradouro}, {local.localizacao.numero} - {local.localizacao.bairro}
                          </p>
                          <p className="result-preview-item__city">
                            {local.localizacao.cidade}/{local.localizacao.estado}
                          </p>
                          <p className="result-preview-item__types">
                            ♻️ {local.tiposResiduos.slice(0, 3).join(', ')}
                            {local.tiposResiduos.length > 3 && ` +${local.tiposResiduos.length - 3}`}
                          </p>
                        </div>

                        <div className="result-preview-item__actions">
                          <Button
                            variant="view"
                            onClick={() => alert(`👁️ Visualizar: ${local.nomeLocal}`)}
                            size="small"
                            tooltip="Visualizar detalhes"
                          >
                            Ver
                          </Button>
                          
                          <Button
                            variant="edit"
                            onClick={() => alert(`✏️ Editar: ${local.nomeLocal}`)}
                            size="small"
                            tooltip="Editar local"
                          >
                            Editar
                          </Button>
                          
                          <Button
                            variant="delete"
                            onClick={() => alert(`🗑️ Excluir: ${local.nomeLocal}`)}
                            size="small"
                            tooltip="Excluir local"
                            confirmMessage={`Tem certeza que deseja excluir o local "${local.nomeLocal}"? Esta ação não pode ser desfeita.`}
                          >
                            Excluir
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    {locaisFiltrados.length > 5 && (
                      <div className="results-preview__more">
                        <p>... e mais {locaisFiltrados.length - 5} locais</p>
                        <Button
                          variant="secondary"
                          onClick={() => alert('Lista completa será implementada em breve!')}
                          size="small"
                        >
                          Ver todos os {locaisFiltrados.length} locais
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListagemLocais;