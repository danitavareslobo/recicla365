import React from 'react';
import { Box, Paper, Typography, Button, Alert } from '@mui/material';
import { Save, Clear } from '@mui/icons-material';
import './Form.css';

interface FormContainerProps {
  title?: string;
  subtitle?: string;
  onSubmit: (e: React.FormEvent) => void;
  onReset?: () => void;
  loading?: boolean;
  error?: string;
  success?: string;
  submitText?: string;
  resetText?: string;
  showReset?: boolean;
  disabled?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
  transparent?: boolean;
  children: React.ReactNode;
}

const FormContainer: React.FC<FormContainerProps> = ({
  title,
  subtitle,
  onSubmit,
  onReset,
  loading = false,
  error,
  success,
  submitText = 'Salvar',
  resetText = 'Limpar',
  showReset = true,
  disabled = false,
  maxWidth = 'md',
  transparent = false,
  children
}) => {
  const getMaxWidth = () => {
    switch (maxWidth) {
      case 'sm': return '600px';
      case 'lg': return '900px';
      case 'xl': return '1200px';
      default: return '800px';
    }
  };

  return (
    <Box className="form-container">
      <Paper 
        elevation={transparent ? 0 : 4}
        className={`form-paper ${transparent ? 'transparent' : ''}`}
        sx={{ maxWidth: getMaxWidth() }}
      >
        {(title || subtitle) && (
          <Box className="form-header">
            {title && (
              <Typography variant="h4" component="h1" className="form-title">
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography variant="subtitle1" className="form-subtitle">
                {subtitle}
              </Typography>
            )}
          </Box>
        )}

        {error && (
          <Alert severity="error" className="form-alert">
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" className="form-alert">
            {success}
          </Alert>
        )}

        <Box 
          component="form" 
          onSubmit={onSubmit}
          className="form-content"
        >
          <Box className="form-fields">
            {children}
          </Box>

          <Box className="form-actions">
            {showReset && onReset && (
              <Button
                type="button"
                variant="outlined"
                startIcon={<Clear />}
                onClick={onReset}
                disabled={loading}
                className="form-reset-button"
              >
                {resetText}
              </Button>
            )}

            <Button
              type="submit"
              variant="contained"
              startIcon={<Save />}
              disabled={disabled || loading}
              className="form-submit-button"
            >
              {loading ? 'Salvando...' : submitText}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default FormContainer;