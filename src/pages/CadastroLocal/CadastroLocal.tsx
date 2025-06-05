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
    identificadorUsuario: usuario?.id || '',
    endereco: {
      cep: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: ''
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);

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

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      endereco: {
        ...prev.endereco,
        [name]: value
      }
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleCEPChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, ''); 
    
    setFormData(prev => ({
      ...prev,
      endereco: {
        ...prev.endereco,
        cep: e.target.value
      }
    }));

    if (cep.length === 8) {
      setIsLoadingAddress(true);
      
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const enderecoData = await response.json();
        
        if (enderecoData && !enderecoData.erro) {
          setFormData(prev => ({
            ...prev,
            endereco: {
              ...prev.endereco,
              logradouro: enderecoData.logradouro || '',
              bairro: enderecoData.bairro || '',
              cidade: enderecoData.localidade || '',
              estado: enderecoData.uf || ''
            }
          }));
          
          const newErrors = { ...errors };
          ['logradouro', 'bairro', 'cidade', 'estado'].forEach(field => {
            if (newErrors[field]) {
              delete newErrors[field];
            }
          });
          setErrors(newErrors);
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
      } finally {
        setIsLoadingAddress(false);
      }
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

    if (!formData.endereco.cep.trim()) {
      newErrors.cep = 'CEP é obrigatório';
    }

    if (!formData.endereco.logradouro.trim()) {
      newErrors.logradouro = 'Logradouro é obrigatório';
    }

    if (!formData.endereco.numero.trim()) {
      newErrors.numero = 'Número é obrigatório';
    }

    if (!formData.endereco.bairro.trim()) {
      newErrors.bairro = 'Bairro é obrigatório';
    }

    if (!formData.endereco.cidade.trim()) {
      newErrors.cidade = 'Cidade é obrigatória';
    }

    if (!formData.endereco.estado.trim()) {
      newErrors.estado = 'Estado é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="cadastro-local-page">
      <Navbar />
      
      {(isLoading || isLoadingAddress) && (
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

            <div className="form-section">
              <h2 className="form-section__title">Localização</h2>
              
              <FormField
                label="CEP"
                name="cep"
                type="text"
                value={formData.endereco.cep}
                onChange={handleCEPChange}
                placeholder="00000-000"
                required
                error={!!errors.cep}
                maxLength={9}
              />
              {errors.cep && (
                <div className="error-message">{errors.cep}</div>
              )}

              <div className="address-row">
                <div className="address-field-large">
                  <FormField
                    label="Logradouro"
                    name="logradouro"
                    type="text"
                    value={formData.endereco.logradouro}
                    onChange={handleAddressChange}
                    placeholder="Rua, Avenida, etc."
                    required
                    error={!!errors.logradouro}
                  />
                  {errors.logradouro && (
                    <div className="error-message">{errors.logradouro}</div>
                  )}
                </div>

                <div className="address-field-small">
                  <FormField
                    label="Número"
                    name="numero"
                    type="text"
                    value={formData.endereco.numero}
                    onChange={handleAddressChange}
                    placeholder="123"
                    required
                    error={!!errors.numero}
                  />
                  {errors.numero && (
                    <div className="error-message">{errors.numero}</div>
                  )}
                </div>
              </div>

              <FormField
                label="Complemento"
                name="complemento"
                type="text"
                value={formData.endereco.complemento}
                onChange={handleAddressChange}
                placeholder="Sala, Apartamento, etc. (opcional)"
                error={!!errors.complemento}
              />

              <div className="address-row">
                <div className="address-field-large">
                  <FormField
                    label="Bairro"
                    name="bairro"
                    type="text"
                    value={formData.endereco.bairro}
                    onChange={handleAddressChange}
                    placeholder="Nome do bairro"
                    required
                    error={!!errors.bairro}
                  />
                  {errors.bairro && (
                    <div className="error-message">{errors.bairro}</div>
                  )}
                </div>

                <div className="address-field-small">
                  <FormField
                    label="Estado"
                    name="estado"
                    type="text"
                    value={formData.endereco.estado}
                    onChange={handleAddressChange}
                    placeholder="SC"
                    required
                    error={!!errors.estado}
                    maxLength={2}
                  />
                  {errors.estado && (
                    <div className="error-message">{errors.estado}</div>
                  )}
                </div>
              </div>

              <FormField
                label="Cidade"
                name="cidade"
                type="text"
                value={formData.endereco.cidade}
                onChange={handleAddressChange}
                placeholder="Nome da cidade"
                required
                error={!!errors.cidade}
              />
              {errors.cidade && (
                <div className="error-message">{errors.cidade}</div>
              )}
            </div>

            <div className="cadastro-local__placeholder">
              Seções de tipos de resíduos e coordenadas serão implementadas nas próximas etapas
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CadastroLocal;