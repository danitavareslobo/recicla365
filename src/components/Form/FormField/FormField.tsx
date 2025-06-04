import React from 'react';
import { TextField, InputAdornment, IconButton, Tooltip } from '@mui/material';
import { Visibility, VisibilityOff, Help } from '@mui/icons-material';
import './FormField.css';

interface FormFieldProps {
  name: string;
  label: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'date' | 'time';
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  multiline?: boolean;
  rows?: number;
  min?: number;
  max?: number;
  maxLength?: number;
  pattern?: string;
  showCharCount?: boolean;
  tooltip?: string;
  fullWidth?: boolean;
  size?: 'small' | 'medium';
  variant?: 'outlined' | 'filled' | 'standard';
  validate?: (value: string) => string | undefined;
}

const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  disabled = false,
  placeholder,
  helperText,
  error = false,
  errorMessage,
  startIcon,
  endIcon,
  multiline = false,
  rows = 4,
  min,
  max,
  maxLength,
  pattern,
  showCharCount = false,
  tooltip,
  fullWidth = true,
  size = 'medium',
  variant = 'outlined',
  validate
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [localError, setLocalError] = React.useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    if (validate) {
      const validationError = validate(newValue);
      setLocalError(validationError || '');
    } else {
      setLocalError('');
    }

    onChange(e);
  };

  const inputProps: any = {
    maxLength,
    pattern,
    min,
    max
  };

  const InputProps: any = {};

  if (startIcon) {
    InputProps.startAdornment = (
      <InputAdornment position="start">
        {startIcon}
      </InputAdornment>
    );
  }

  if (type === 'password') {
    InputProps.endAdornment = (
      <InputAdornment position="end">
        <IconButton
          aria-label="toggle password visibility"
          onClick={() => setShowPassword(!showPassword)}
          edge="end"
        >
          {showPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </InputAdornment>
    );
  } else if (endIcon) {
    InputProps.endAdornment = (
      <InputAdornment position="end">
        {endIcon}
      </InputAdornment>
    );
  }

  const getHelperText = () => {
    if (localError) return localError;
    if (errorMessage && error) return errorMessage;
    
    let helper = helperText || '';
    
    if (showCharCount && maxLength) {
      const count = String(value).length;
      const countText = `${count}/${maxLength}`;
      helper = helper ? `${helper} (${countText})` : countText;
    }
    
    return helper;
  };

  const getLabelWithTooltip = () => {
    if (!tooltip) return label;
    
    return (
      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {label}
        <Tooltip title={tooltip} arrow>
          <Help sx={{ fontSize: '1rem', color: 'text.secondary' }} />
        </Tooltip>
      </span>
    );
  };

  return (
    <TextField
      name={name}
      label={getLabelWithTooltip()}
      value={value}
      onChange={handleChange}
      type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
      required={required}
      disabled={disabled}
      placeholder={placeholder}
      helperText={getHelperText()}
      error={error || !!localError}
      multiline={multiline}
      rows={multiline ? rows : undefined}
      fullWidth={fullWidth}
      size={size}
      variant={variant}
      inputProps={inputProps}
      InputProps={InputProps}
      className={`form-field ${error || localError ? 'error' : ''} ${disabled ? 'disabled' : ''}`}
    />
  );
};

export default FormField;