import React, { useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Loading from '../../components/Loading/Loading';
import FormField from '../../components/Form/FormField/FormField';
import { useAuth } from '../../context/AuthContext';
import './CadastroLocal.css';

const CadastroLocal: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { usuario } = useAuth();

  const [formData, setFormData] = useState({
    nomeLocal: '',
    descricaoLocal: '',
    identificadorUsuario: usuario?.id || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateBasicFields = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nomeLocal.trim()) {
      newErrors.nomeLocal = 'Nome do local é obrigatório';
    }

    if (!formData.descricaoLocal.trim()) {
      newErrors.descricaoLocal = 'Descrição do local é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
            <div className="form-section">
              <h2 className="form-section__title">Informações Básicas</h2>
              
              <FormField
                label="Nome do Local"
                name="nomeLocal"
                type="text"
                value={formData.nomeLocal}
                onChange={handleInputChange}
                placeholder="Ex: EcoPonto Centro"
                required
                error={!!errors.nomeLocal}
                maxLength={100}
              />
              {errors.nomeLocal && (
                <div className="error-message">{errors.nomeLocal}</div>
              )}

              <div className="form-group">
                <label htmlFor="descricaoLocal" className="form-label">
                  Descrição do Local <span className="required">*</span>
                </label>
                <textarea
                  id="descricaoLocal"
                  name="descricaoLocal"
                  value={formData.descricaoLocal}
                  onChange={handleInputChange}
                  placeholder="Descreva o local de coleta, horários de funcionamento, observações importantes..."
                  className={`form-textarea ${errors.descricaoLocal ? 'error' : ''}`}
                  rows={4}
                  maxLength={500}
                />
                {errors.descricaoLocal && (
                  <div className="error-message">{errors.descricaoLocal}</div>
                )}
                <div className="character-counter">
                  {formData.descricaoLocal.length}/500 caracteres
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="identificadorUsuario" className="form-label">
                  Responsável pelo Cadastro
                </label>
                <input
                  type="text"
                  id="identificadorUsuario"
                  name="identificadorUsuario"
                  value={usuario?.nome || 'Usuário não identificado'}
                  className="form-input readonly"
                  readOnly
                />
                <div className="form-hint">
                  Este local será vinculado ao seu usuário
                </div>
              </div>
            </div>

            <div className="cadastro-local__placeholder">
              Seções de endereço, tipos de resíduos e coordenadas serão implementadas nas próximas etapas
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CadastroLocal;