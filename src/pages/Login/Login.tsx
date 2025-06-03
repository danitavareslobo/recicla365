import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Divider,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Nature  
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.email || !formData.senha) {
      setError('Por favor, preencha todos os campos');
      setLoading(false);
      return;
    }

    const sucesso = login(formData);
    
    if (sucesso) {
      navigate('/dashboard');
    } else {
      setError('Email ou senha incorretos');
    }
    
    setLoading(false);
  };

  const handleCadastroClick = () => {
    navigate('/cadastro-usuario');
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box className="login-container">
        <Paper elevation={8} className="login-paper">
          <Box className="login-header">
            <Nature className="login-logo" />
            <Typography component="h1" variant="h4" className="login-title">
              Recicla365
            </Typography>
          </Box>

          <Typography component="h2" variant="h5" className="login-subtitle">
            Faça seu login
          </Typography>

          <Box component="form" onSubmit={handleSubmit} className="login-form">
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <TextField
              className="input-field"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              className="input-field"
              required
              fullWidth
              name="senha"
              label="Senha"
              type={showPassword ? 'text' : 'password'}
              id="senha"
              autoComplete="current-password"
              value={formData.senha}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              className="login-button"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>

            <Divider className="login-divider">ou</Divider>

            <Button
              fullWidth
              variant="outlined"
              onClick={handleCadastroClick}
              className="register-button"
            >
              Criar nova conta
            </Button>
          </Box>

          <Box className="test-credentials">
            <Typography className="test-credentials-text" align="center">
              <strong>Credenciais para teste:</strong><br />
              📧 joao@email.com / maria@email.com<br />
              🔑 Senha: 123456
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;