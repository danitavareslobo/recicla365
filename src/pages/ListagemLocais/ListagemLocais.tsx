import React, { useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Loading from '../../components/Loading/Loading';
import { useCollectionPoints } from '../../context/CollectionPointsContext';
import './ListagemLocais.css';

const ListagemLocais: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { locaisColeta } = useCollectionPoints();

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
            <div className="listagem-locais__placeholder">
              Filtros e busca serão implementados na próxima etapa
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