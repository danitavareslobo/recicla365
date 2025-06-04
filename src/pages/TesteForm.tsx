import React, { useState } from 'react';
import { Box, TextField } from '@mui/material';
import Navbar from '../components/Navbar/Navbar';
import FormContainer from '../components/Form/Form';

const TesteForm: React.FC = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    descricao: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!formData.nome || !formData.email) {
      setError('Por favor, preencha os campos obrigatórios');
      setLoading(false);
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccess('✅ Formulário enviado com sucesso!');
      console.log('Dados enviados:', formData);
    } catch (err) {
      setError('❌ Erro ao enviar formulário');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      nome: '',
      email: '',
      descricao: ''
    });
    setError('');
    setSuccess('');
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Navbar />
      
      <FormContainer
        title="🧪 Teste do Form Container"
        subtitle="Testando todos os recursos do formulário"
        onSubmit={handleSubmit}
        onReset={handleReset}
        loading={loading}
        error={error}
        success={success}
        submitText="Enviar Teste"
        resetText="Limpar Tudo"
        maxWidth="md"
      >
        <div className="form-row">
          <div className="form-col-8">
            <TextField
              required
              fullWidth
              label="Nome Completo"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Digite seu nome"
            />
          </div>
          <div className="form-col-4">
            <TextField
              required
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="seu@email.com"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-col-12">
            <TextField
              fullWidth
              label="Descrição"
              name="descricao"
              multiline
              rows={4}
              value={formData.descricao}
              onChange={handleChange}
              placeholder="Descreva algo interessante..."
            />
          </div>
        </div>

        <div className="form-section">
          <h3 className="form-section-title">
            📋 Seção de Exemplo
          </h3>
          <div className="form-row">
            <div className="form-col-6">
              <TextField
                fullWidth
                label="Campo 1"
                placeholder="Exemplo de campo"
                disabled
                value="Campo desabilitado"
              />
            </div>
            <div className="form-col-6">
              <TextField
                fullWidth
                label="Campo 2"
                placeholder="Outro exemplo"
                helperText="Este é um texto de ajuda"
              />
            </div>
          </div>
        </div>
      </FormContainer>
    </Box>
  );
};

export default TesteForm;