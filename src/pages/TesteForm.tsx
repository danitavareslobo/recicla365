import React, { useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
import { Person, Email, Lock, Phone } from '@mui/icons-material';
import Navbar from '../components/Navbar/Navbar';
import FormField from '../components/Form/FormField/FormField';
import FormContainer from '../components/Form/Form';

const Dashboard: React.FC = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    telefone: '',
    descricao: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setSuccess('✅ FormField funcionando perfeitamente!');
      setLoading(false);
    }, 1500);
  };

  const handleReset = () => {
    setFormData({
      nome: '',
      email: '',
      senha: '',
      telefone: '',
      descricao: ''
    });
    setSuccess('');
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      return 'Email inválido';
    }
    return undefined;
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Navbar />
      
      <FormContainer
        title="🧪 Teste FormField Component"
        subtitle="Testando campos reutilizáveis com validação"
        onSubmit={handleSubmit}
        onReset={handleReset}
        loading={loading}
        success={success}
      >
        <div className="form-row">
          <div className="form-col-6">
            <FormField
              name="nome"
              label="Nome Completo"
              value={formData.nome}
              onChange={handleChange}
              required
              startIcon={<Person />}
              placeholder="Digite seu nome"
              tooltip="Nome que aparecerá no sistema"
              maxLength={50}
              showCharCount
            />
          </div>
          <div className="form-col-6">
            <FormField
              name="email"
              label="Email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              required
              startIcon={<Email />}
              placeholder="seu@email.com"
              validate={validateEmail}
              helperText="Será usado para login"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-col-6">
            <FormField
              name="senha"
              label="Senha"
              value={formData.senha}
              onChange={handleChange}
              type="password"
              required
              startIcon={<Lock />}
              placeholder="Mínimo 6 caracteres"
              helperText="Use números e letras"
            />
          </div>
          <div className="form-col-6">
            <FormField
              name="telefone"
              label="Telefone"
              value={formData.telefone}
              onChange={handleChange}
              type="tel"
              startIcon={<Phone />}
              placeholder="(47) 99999-9999"
              pattern="[0-9\s\(\)\-]+"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-col-12">
            <FormField
              name="descricao"
              label="Descrição"
              value={formData.descricao}
              onChange={handleChange}
              multiline
              rows={3}
              placeholder="Conte um pouco sobre você..."
              maxLength={200}
              showCharCount
              helperText="Descrição opcional"
            />
          </div>
        </div>
      </FormContainer>
    </Box>
  );
};

export default Dashboard;