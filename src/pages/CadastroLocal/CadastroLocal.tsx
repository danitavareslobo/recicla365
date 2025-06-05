import React, { useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Loading from '../../components/Loading/Loading';
import FormField from '../../components/Form/FormField/FormField';
import { useAuth } from '../../context/AuthContext';
import type { LocalColeta, TipoResiduo } from '../../context/CollectionPointsContext';
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
    },
    tiposResiduos: [] as TipoResiduo[],
    coordenadas: {
      latitude: '',
      longitude: ''
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const tiposResiduosOptions = [
    { value: 'Vidro', label: 'Vidro' },
    { value: 'Metal', label: 'Metal' },
    { value: 'Papel', label: 'Papel' },
    { value: 'Plástico', label: 'Plástico' },
    { value: 'Orgânico', label: 'Orgânico' },
    { value: 'Baterias', label: 'Baterias' },
    { value: 'Eletrônicos', label: 'Eletrônicos' },
    { value: 'Óleo', label: 'Óleo' }
  ];

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

  const handleCoordinatesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    const sanitizedValue = value.replace(/[^0-9.,-]/g, '');
    
    setFormData(prev => ({
      ...prev,
      coordenadas: {
        ...prev.coordenadas,
        [name]: sanitizedValue
      }
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocalização não é suportada neste navegador.');
      return;
    }

    setIsLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        setFormData(prev => ({
          ...prev,
          coordenadas: {
            latitude: latitude.toFixed(6),
            longitude: longitude.toFixed(6)
          }
        }));

        const newErrors = { ...errors };
        delete newErrors.latitude;
        delete newErrors.longitude;
        setErrors(newErrors);

        setIsLoadingLocation(false);
      },
      (error) => {
        console.error('Erro ao obter localização:', error);
        let errorMessage = 'Erro ao obter localização atual.';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Permissão de localização negada.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Localização não disponível.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Timeout ao obter localização.';
            break;
        }
        
        alert(errorMessage);
        setIsLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const handleTiposResiduosChange = (selectedValues: string[]) => {
    setFormData(prev => ({
      ...prev,
      tiposResiduos: selectedValues as TipoResiduo[]
    }));

    if (selectedValues.length > 0 && errors.tiposResiduos) {
      setErrors(prev => ({
        ...prev,
        tiposResiduos: ''
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

    if (formData.tiposResiduos.length === 0) {
      newErrors.tiposResiduos = 'Selecione pelo menos um tipo de resíduo';
    }

    if (formData.coordenadas.latitude && isNaN(Number(formData.coordenadas.latitude))) {
      newErrors.latitude = 'Latitude deve ser um número válido';
    }

    if (formData.coordenadas.longitude && isNaN(Number(formData.coordenadas.longitude))) {
      newErrors.longitude = 'Longitude deve ser um número válido';
    }

    const lat = Number(formData.coordenadas.latitude);
    const lng = Number(formData.coordenadas.longitude);

    if (formData.coordenadas.latitude && (lat < -90 || lat > 90)) {
      newErrors.latitude = 'Latitude deve estar entre -90 e 90';
    }

    if (formData.coordenadas.longitude && (lng < -180 || lng > 180)) {
      newErrors.longitude = 'Longitude deve estar entre -180 e 180';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="cadastro-local-page">
      <Navbar />
      
      {(isLoading || isLoadingAddress || isLoadingLocation) && (
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

            <div className="form-section">
              <h2 className="form-section__title">Tipos de Resíduos Aceitos</h2>
              <p className="form-section__description">
                Selecione os tipos de materiais recicláveis que este local aceita:
              </p>
              
              <div className="waste-types-grid">
                {tiposResiduosOptions.map((tipo) => (
                  <div key={tipo.value} className="waste-type-option">
                    <label className="waste-type-label">
                      <input
                        type="checkbox"
                        value={tipo.value}
                        checked={formData.tiposResiduos.includes(tipo.value as TipoResiduo)}
                        onChange={(e) => {
                          const value = e.target.value as TipoResiduo;
                          const isChecked = e.target.checked;
                          
                          setFormData(prev => ({
                            ...prev,
                            tiposResiduos: isChecked
                              ? [...prev.tiposResiduos, value]
                              : prev.tiposResiduos.filter(t => t !== value)
                          }));
                          
                          if (isChecked && errors.tiposResiduos) {
                            setErrors(prev => ({
                              ...prev,
                              tiposResiduos: ''
                            }));
                          }
                        }}
                        className="waste-type-checkbox"
                      />
                      <span className="waste-type-icon">
                        {tipo.value === 'Vidro' && '🥃'}
                        {tipo.value === 'Metal' && '⚙️'}
                        {tipo.value === 'Papel' && '📄'}
                        {tipo.value === 'Plástico' && '♻️'}
                        {tipo.value === 'Orgânico' && '🌱'}
                        {tipo.value === 'Baterias' && '🔋'}
                        {tipo.value === 'Eletrônicos' && '💻'}
                        {tipo.value === 'Óleo' && '🛢️'}
                      </span>
                      <span className="waste-type-text">{tipo.label}</span>
                    </label>
                  </div>
                ))}
              </div>
              
              {errors.tiposResiduos && (
                <div className="error-message">{errors.tiposResiduos}</div>
              )}
              
              <div className="selected-count">
                {formData.tiposResiduos.length > 0 && (
                  <p className="form-hint">
                    ✅ {formData.tiposResiduos.length} tipo{formData.tiposResiduos.length > 1 ? 's' : ''} selecionado{formData.tiposResiduos.length > 1 ? 's' : ''}
                  </p>
                )}
              </div>
            </div>

            <div className="form-section">
              <h2 className="form-section__title">Coordenadas Geográficas</h2>
              <p className="form-section__description">
                Adicione as coordenadas para localização precisa no mapa (opcional):
              </p>

              <div className="coordinates-container">
                <div className="coordinates-row">
                  <div className="coordinate-field">
                    <FormField
                      label="Latitude"
                      name="latitude"
                      type="text"
                      value={formData.coordenadas.latitude}
                      onChange={handleCoordinatesChange}
                      placeholder="-26.3045"
                      error={!!errors.latitude}
                    />
                    {errors.latitude && (
                      <div className="error-message">{errors.latitude}</div>
                    )}
                  </div>

                  <div className="coordinate-field">
                    <FormField
                      label="Longitude"
                      name="longitude"
                      type="text"
                      value={formData.coordenadas.longitude}
                      onChange={handleCoordinatesChange}
                      placeholder="-48.8487"
                      error={!!errors.longitude}
                    />
                    {errors.longitude && (
                      <div className="error-message">{errors.longitude}</div>
                    )}
                  </div>
                </div>

                <div className="location-actions">
                  <button
                    type="button"
                    onClick={handleGetCurrentLocation}
                    disabled={isLoadingLocation}
                    className="location-button"
                  >
                    {isLoadingLocation ? (
                      <>⏳ Obtendo localização...</>
                    ) : (
                      <>📍 Usar minha localização atual</>
                    )}
                  </button>
                  
                  <div className="coordinates-info">
                    <small className="form-hint">
                      💡 Dica: Use o botão acima para obter automaticamente sua localização atual, 
                      ou pesquise as coordenadas no Google Maps.
                    </small>
                  </div>
                </div>

                {(formData.coordenadas.latitude && formData.coordenadas.longitude) && (
                  <div className="coordinates-preview">
                    <p className="coordinates-display">
                      🌐 Coordenadas: {formData.coordenadas.latitude}, {formData.coordenadas.longitude}
                    </p>
                    <a
                      href={`https://www.google.com/maps?q=${formData.coordenadas.latitude},${formData.coordenadas.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="maps-link"
                    >
                      🗺️ Ver no Google Maps
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="cadastro-local__placeholder">
              Botões de ação (salvar/cancelar) serão implementados na próxima etapa
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CadastroLocal;