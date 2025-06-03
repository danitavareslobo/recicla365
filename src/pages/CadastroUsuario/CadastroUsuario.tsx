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
  IconButton
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
import './CadastroUsuario.css';

const CadastroUsuario: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: '',
    sexo: '',
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
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      sexo: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Formulário enviado! (funcionalidade será implementada depois)');
    console.log('Dados do formulário:', formData);
  };

  return (
    <Container component="main" maxWidth="md">
      <Box className="cadastro-container">
        <Paper elevation={8} className="cadastro-paper">
          {/* Header */}
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
            
            <div className="form-grid">
              
              <div className="form-row">
                <div className="form-col-8">
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
                </div>
                <div className="form-col-4">
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
              </div>

              <div className="form-row">
                <div className="form-col-6">
                  <TextField
                    required
                    fullWidth
                    label="CPF"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleChange}
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
                    onChange={handleChange}
                    placeholder="00000-000"
                    helperText="Apenas números"
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
                    fullWidth
                    label="Logradouro"
                    name="endereco.logradouro"
                    value={formData.endereco.logradouro}
                    onChange={handleChange}
                    placeholder="Rua, Avenida, etc."
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
                <div className="form-col-4">
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
                    fullWidth
                    label="Bairro"
                    name="endereco.bairro"
                    value={formData.endereco.bairro}
                    onChange={handleChange}
                    placeholder="Nome do bairro"
                  />
                </div>
                <div className="form-col-3">
                  <TextField
                    fullWidth
                    label="Cidade"
                    name="endereco.cidade"
                    value={formData.endereco.cidade}
                    onChange={handleChange}
                    placeholder="Nome da cidade"
                  />
                </div>
                <div className="form-col-1">
                  <TextField
                    fullWidth
                    label="UF"
                    name="endereco.estado"
                    value={formData.endereco.estado}
                    onChange={handleChange}
                    placeholder="SC"
                  />
                </div>
              </div>

            </div>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              className="cadastro-button"
              sx={{ mt: 3, mb: 2 }}
            >
              Criar Conta
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