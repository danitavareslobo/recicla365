import React, { useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Loading from '../../components/Loading/Loading';
import './CadastroLocal.css';

const CadastroLocal: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="cadastro-local-page">
      <Navbar />
      
      {isLoading && (
        <div className="cadastro-local__loading">
          <Loading />
        </div>
      )}

      <div className="cadastro-local">
        <div className="cadastro-local__header">
          <h1 className="cadastro-local__title">Cadastro de Local de Coleta</h1>
          <p className="cadastro-local__subtitle">
            Cadastre um novo ponto de coleta de resíduos recicláveis
          </p>
        </div>

        <div className="cadastro-local__content">
          <form className="cadastro-local__form">
            <div className="cadastro-local__placeholder">
              Formulário de cadastro será implementado na próxima etapa
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CadastroLocal;