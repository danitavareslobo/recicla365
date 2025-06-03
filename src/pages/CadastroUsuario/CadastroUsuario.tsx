import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Box,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
  Alert
} from '@mui/material';
import {
  Person,
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  CalendarToday,
  ContactPage,
  Home,
  ArrowBack,
  Nature
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import type { Usuario } from '../../types';
import './CadastroUsuario.css';
import { buscarCep } from '../../services/viaCep';

const CadastroUsuario: React.FC = () => {
  const navigate = useNavigate();
  const { cadastrarUsuario } = useAuth();

  const [formData, setFormData] = useState({
    nome: '',
    sexo: '' as 'Masculino' | 'Feminino' | 'Outro' | '',
    cpf: '',
    dataNascimento: '',
    email: '',
    senha: '',
    confirmarSenha: '',
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

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('endereco.')) {
      const enderecoField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        endereco: {
          ...prev.endereco,
          [enderecoField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    setError('');
    setSuccess('');
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      sexo: value as 'Masculino' | 'Feminino' | 'Outro'
    }));
    setError('');
    setSuccess('');
  };

  const formatCpf = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCpf(e.target.value);
    setFormData(prev => ({ ...prev, cpf: formatted }));
    setError('');
    setSuccess('');
  };

  const formatCep = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{3})\d+?$/, '$1');
  };

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const cep = e.target.value.replace(/\D/g, '');
  const cepFormatado = formatCep(cep);
  
  setFormData(prev => ({
    ...prev,
    endereco: {
      ...prev.endereco,
      cep: cepFormatado
    }
  }));
  
  setCepError('');
  setError('');
  setSuccess('');
  
  if (cep.length === 8) {
    setCepLoading(true);
    
    try {
      const dadosCep = await buscarCep(cep);
      
      if (dadosCep) {
        setFormData(prev => ({
          ...prev,
          endereco: {
            ...prev.endereco,
            cep: cepFormatado,
            logradouro: dadosCep.logradouro,
            bairro: dadosCep.bairro,
            cidade: dadosCep.localidade,
            estado: dadosCep.uf,
            complemento: prev.endereco.complemento 
          }
        }));
        
        setSuccess('✅ CEP encontrado! Dados preenchidos automaticamente.');
        
        setTimeout(() => {
          setSuccess('');
        }, 3000);
        
      } else {
        setCepError('CEP não encontrado. Verifique e tente novamente.');
        setFormData(prev => ({
          ...prev,
          endereco: {
            ...prev.endereco,
            cep: cepFormatado,
            logradouro: '',
            bairro: '',
            cidade: '',
            estado: ''
          }
        }));
      }
    } catch (error) {
      setCepError('Erro ao buscar CEP. Tente novamente.');
      console.error('Erro na busca do CEP:', error);
    } finally {
      setCepLoading(false);
    }
  } else {
    if (cep.length < 8) {
      setFormData(prev => ({
        ...prev,
        endereco: {
          ...prev.endereco,
          cep: cepFormatado,
          logradouro: '',
          bairro: '',
          cidade: '',
          estado: ''
        }
      }));
    }
  }
};

  const validateForm = (): boolean => {
    if (!formData.nome.trim()) {
      setError('Nome é obrigatório');
      return false;
    }

    if (!formData.sexo) {
      setError('Sexo é obrigatório');
      return false;
    }

    if (!formData.cpf) {
      setError('CPF é obrigatório');
      return false;
    }

    const cpfNumeros = formData.cpf.replace(/\D/g, '');
    if (cpfNumeros.length !== 11) {
      setError('CPF deve ter 11 dígitos');
      return false;
    }

    if (!formData.dataNascimento) {
      setError('Data de nascimento é obrigatória');
      return false;
    }

    const hoje = new Date();
    const nascimento = new Date(formData.dataNascimento);
    const idade = hoje.getFullYear() - nascimento.getFullYear();
    if (idade < 16) {
      setError('Você deve ter pelo menos 16 anos');
      return false;
    }

    if (!formData.email.trim()) {
      setError('Email é obrigatório');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Email inválido');
      return false;
    }

    if (!formData.senha) {
      setError('Senha é obrigatória');
      return false;
    }

    if (formData.senha.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return false;
    }

    if (formData.senha !== formData.confirmarSenha) {
      setError('As senhas não coincidem');
      return false;
    }

    if (!formData.endereco.cep) {
      setError('CEP é obrigatório');
      return false;
    }

    const cepNumeros = formData.endereco.cep.replace(/\D/g, '');
    if (cepNumeros.length !== 8) {
      setError('CEP deve ter 8 dígitos');
      return false;
    }

    if (!formData.endereco.logradouro.trim()) {
      setError('Logradouro é obrigatório');
      return false;
    }

    if (!formData.endereco.numero.trim()) {
      setError('Número é obrigatório');
      return false;
    }

    if (!formData.endereco.bairro.trim()) {
      setError('Bairro é obrigatório');
      return false;
    }

    if (!formData.endereco.cidade.trim()) {
      setError('Cidade é obrigatória');
      return false;
    }

    if (!formData.endereco.estado.trim()) {
      setError('Estado é obrigatório');
      return false;
    }

    if (formData.endereco.estado.length !== 2) {
      setError('Estado deve ter 2 caracteres (ex: SC)');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    const novoUsuario = {
      nome: formData.nome.trim(),
      sexo: formData.sexo,
      cpf: formData.cpf,
      dataNascimento: formData.dataNascimento,
      email: formData.email.trim().toLowerCase(),
      senha: formData.senha,
      endereco: {
        cep: formData.endereco.cep,
        logradouro: formData.endereco.logradouro.trim(),
        numero: formData.endereco.numero.trim(),
        complemento: formData.endereco.complemento.trim(),
        bairro: formData.endereco.bairro.trim(),
        cidade: formData.endereco.cidade.trim(),
        estado: formData.endereco.estado.toUpperCase()
      }
    } as Omit<Usuario, 'id'>;

    const sucesso = cadastrarUsuario(novoUsuario);
    
    if (sucesso) {
      setSuccess('✅ Usuário cadastrado com sucesso! Redirecionando para o login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      setError('❌ CPF ou email já cadastrado. Tente com dados diferentes.');
    }
    
    setLoading(false);
  };

  return (
    <Container component="main" maxWidth="md">
      <Box className="cadastro-container">
        <Paper elevation={8} className="cadastro-paper">
          <Box className="cadastro-header">
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate('/login')}
              className="back-button"
            >
              Voltar
            </Button>
            <Box className="logo-section">
              <Nature className="cadastro-logo" />
              <Typography component="h1" variant="h4" className="cadastro-title">
                Recicla365
              </Typography>
            </Box>
          </Box>

          <Typography component="h2" variant="h5" className="cadastro-subtitle">
            Criar nova conta
          </Typography>

          <Box component="form" onSubmit={handleSubmit} className="cadastro-form">
            
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}

            <div className="form-grid">
              <div className="primeira-linha">
                <TextField
                  required
                  fullWidth
                  label="Nome completo"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person />
                      </InputAdornment>
                    ),
                  }}
                />
                <FormControl fullWidth required>
                  <InputLabel>Sexo</InputLabel>
                  <Select
                    value={formData.sexo}
                    label="Sexo"
                    onChange={(e) => handleSelectChange(e.target.value)}
                  >
                    <MenuItem value="Masculino">Masculino</MenuItem>
                    <MenuItem value="Feminino">Feminino</MenuItem>
                    <MenuItem value="Outro">Outro</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="form-row">
                <div className="form-col-6">
                  <TextField
                    required
                    fullWidth
                    label="CPF"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleCpfChange}
                    inputProps={{ maxLength: 14 }}
                    placeholder="000.000.000-00"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <ContactPage />
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>
                <div className="form-col-6">
                  <TextField
                    required
                    fullWidth
                    label="Data de Nascimento"
                    name="dataNascimento"
                    type="date"
                    value={formData.dataNascimento}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarToday />
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-col-12">
                  <TextField
                    required
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="seu@email.com"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email />
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-col-6">
                  <TextField
                    required
                    fullWidth
                    label="Senha"
                    name="senha"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.senha}
                    onChange={handleChange}
                    placeholder="Mínimo 6 caracteres"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>
                <div className="form-col-6">
                  <TextField
                    required
                    fullWidth
                    label="Confirmar Senha"
                    name="confirmarSenha"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmarSenha}
                    onChange={handleChange}
                    placeholder="Digite a senha novamente"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            edge="end"
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>
              </div>

              <div className="endereco-section">
                <Typography variant="h6" className="endereco-title">
                  📍 Endereço
                </Typography>
              </div>

              <div className="form-row">
                <div className="form-col-3">
                  <TextField
                    required
                    fullWidth
                    label="CEP"
                    name="endereco.cep"
                    value={formData.endereco.cep}
                    onChange={handleCepChange}
                    inputProps={{ maxLength: 9 }}
                    placeholder="00000-000"
                    helperText={
                      cepLoading 
                        ? '🔍 Buscando CEP...' 
                        : cepError 
                          ? cepError 
                          : 'Digite o CEP para preencher automaticamente'
                    }
                    error={!!cepError}
                    disabled={cepLoading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Home />
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>
                <div className="form-col-7">
                  <TextField
                    required
                    fullWidth
                    label="Logradouro"
                    name="endereco.logradouro"
                    value={formData.endereco.logradouro}
                    onChange={handleChange}
                    placeholder="Rua, Avenida, etc."
                    helperText={formData.endereco.logradouro && !cepError ? '✅ Preenchido automaticamente' : ''}
                    InputProps={{
                      style: {
                        backgroundColor: formData.endereco.logradouro && !cepError ? 'rgba(76, 175, 80, 0.1)' : undefined
                      }
                    }}
                  />
                </div>
                <div className="form-col-2">
                  <TextField
                    required
                    fullWidth
                    label="Número"
                    name="endereco.numero"
                    value={formData.endereco.numero}
                    onChange={handleChange}
                    placeholder="123"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-col-3"> 
                  <TextField
                    fullWidth
                    label="Complemento"
                    name="endereco.complemento"
                    value={formData.endereco.complemento}
                    onChange={handleChange}
                    placeholder="Apto, Bloco, etc."
                  />
                </div>
                <div className="form-col-4"> 
                  <TextField
                    required
                    fullWidth
                    label="Bairro"
                    name="endereco.bairro"
                    value={formData.endereco.bairro}
                    onChange={handleChange}
                    placeholder="Nome do bairro"
                    helperText={formData.endereco.bairro && !cepError ? '✅ Preenchido automaticamente' : ''}
                    InputProps={{
                      style: {
                        backgroundColor: formData.endereco.bairro && !cepError ? 'rgba(76, 175, 80, 0.1)' : undefined
                      }
                    }}
                  />
                </div>
                <div className="form-col-3"> 
                  <TextField
                    required
                    fullWidth
                    label="Cidade"
                    name="endereco.cidade"
                    value={formData.endereco.cidade}
                    onChange={handleChange}
                    placeholder="Nome da cidade"
                    helperText={formData.endereco.cidade && !cepError ? '✅ Preenchido automaticamente' : ''}
                    InputProps={{
                      style: {
                        backgroundColor: formData.endereco.cidade && !cepError ? 'rgba(76, 175, 80, 0.1)' : undefined
                      }
                    }}
                  />
                </div>
                <div className="form-col-2"> 
                  <TextField
                    required
                    fullWidth
                    label="Estado (UF)"
                    name="endereco.estado"
                    value={formData.endereco.estado}
                    onChange={handleChange}
                    inputProps={{ maxLength: 2 }}
                    placeholder="SC"
                    helperText={formData.endereco.estado && !cepError ? '✅ Automático' : ''}
                    InputProps={{
                      style: {
                        backgroundColor: formData.endereco.estado && !cepError ? 'rgba(76, 175, 80, 0.1)' : undefined
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              className="cadastro-button"
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? 'Cadastrando...' : 'Criar Conta'}
            </Button>

            <Box className="form-info">
              <Typography variant="body2" color="text.secondary" align="center">
                📝 <strong>Dica:</strong> Todos os campos marcados com * são obrigatórios
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default CadastroUsuario;