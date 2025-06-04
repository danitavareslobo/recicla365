import React from 'react';
import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  FormHelperText, 
  Chip, 
  Box,
  Tooltip
} from '@mui/material';
import { Help } from '@mui/icons-material';
import './FormSelect.css';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  description?: string;
  icon?: React.ReactNode;
}

interface FormSelectProps {
  name: string;
  label: string;
  value: string | number | string[] | number[];
  onChange: (value: string | number | string[] | number[]) => void;
  options: SelectOption[];
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
  multiple?: boolean;
  placeholder?: string;
  tooltip?: string;
  fullWidth?: boolean;
  size?: 'small' | 'medium';
  variant?: 'outlined' | 'filled' | 'standard';
  validate?: (value: string | number | string[] | number[]) => string | undefined;
  showChips?: boolean;
  noOptionsText?: string;
}

const FormSelect: React.FC<FormSelectProps> = ({
  name,
  label,
  value,
  onChange,
  options,
  required = false,
  disabled = false,
  helperText,
  error = false,
  errorMessage,
  multiple = false,
  placeholder = 'Selecione...',
  tooltip,
  fullWidth = true,
  size = 'medium',
  variant = 'outlined',
  validate,
  showChips = true,
  noOptionsText = 'Nenhuma opção disponível'
}) => {
  const [localError, setLocalError] = React.useState<string>('');

  const handleChange = (newValue: string | number | string[] | number[]) => {
    if (validate) {
      const validationError = validate(newValue);
      setLocalError(validationError || '');
    } else {
      setLocalError('');
    }
    onChange(newValue);
  };

  const hasValue = () => {
    if (multiple) {
      return Array.isArray(value) && value.length > 0;
    }
    const stringValue = String(value);
    return stringValue !== '' && stringValue !== 'undefined' && stringValue !== 'null';
  };

  const renderValue = (selected: any) => {
    if (!multiple) {
      if (!selected) return '';
      const option = options.find(opt => opt.value === selected);
      return option ? option.label : selected;
    }

    if (!Array.isArray(selected) || selected.length === 0) {
      return '';
    }

    if (showChips && selected.length <= 2) {
      return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {selected.map((val) => {
            const option = options.find(opt => opt.value === val);
            return (
              <Chip
                key={val}
                label={option?.label || val}
                size="small"
                sx={{
                  backgroundColor: '#e8f5e8',
                  color: '#2e7d32',
                  height: '20px',
                  fontSize: '0.75rem',
                  maxWidth: '100px',
                  '& .MuiChip-label': {
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }
                }}
              />
            );
          })}
        </Box>
      );
    }

    if (selected.length > 2) {
      return `${selected.length} itens selecionados`;
    }

    return selected
      .map((val: any) => {
        const option = options.find(opt => opt.value === val);
        return option?.label || val;
      })
      .join(', ');
  };

  const getLabelWithTooltip = () => {
    if (!tooltip) return label;
    
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {label}
        <Tooltip title={tooltip} arrow>
          <Help sx={{ fontSize: '1rem', color: 'text.secondary' }} />
        </Tooltip>
      </Box>
    );
  };

  const getHelperText = () => {
    if (localError) return localError;
    if (errorMessage && error) return errorMessage;
    return helperText;
  };

  if (options.length === 0) {
    return (
      <FormControl 
        fullWidth={fullWidth} 
        size={size} 
        variant={variant}
        disabled={true}
        className="form-select-empty"
      >
        <InputLabel>{getLabelWithTooltip()}</InputLabel>
        <Select value="" disabled>
          <MenuItem value="" disabled>
            {noOptionsText}
          </MenuItem>
        </Select>
        {getHelperText() && (
          <FormHelperText>{getHelperText()}</FormHelperText>
        )}
      </FormControl>
    );
  }

  return (
    <FormControl 
      fullWidth={fullWidth} 
      size={size} 
      variant={variant}
      error={error || !!localError}
      disabled={disabled}
      required={required}
      className="form-select-control"
    >
      <InputLabel 
        shrink={hasValue()}
        sx={{
          backgroundColor: hasValue() ? 'white' : 'transparent',
          padding: hasValue() ? '0 4px' : '0',
          '&.MuiInputLabel-shrink': {
            transform: 'translate(14px, -9px) scale(0.75)',
          }
        }}
      >
        {getLabelWithTooltip()}
      </InputLabel>
      
      <Select
        name={name}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        multiple={multiple}
        displayEmpty
        renderValue={renderValue}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 300,
              borderRadius: '8px',
              marginTop: '8px'
            },
          },
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
          },
          transformOrigin: {
            vertical: 'top',
            horizontal: 'left',
          },
        }}
        sx={{
          '& .MuiSelect-select': {
            minHeight: '1.4375em',
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 0.5,
            paddingRight: '32px !important',
          }
        }}
      >
        {!hasValue() && (
          <MenuItem value="" disabled>
            <em style={{ color: '#999' }}>{placeholder}</em>
          </MenuItem>
        )}
        
        {options.map((option) => (
          <MenuItem
            key={option.value}
            value={option.value}
            disabled={option.disabled}
            sx={{
              padding: '8px 16px',
              '&:hover': {
                backgroundColor: 'rgba(46, 125, 50, 0.04)',
              },
              '&.Mui-selected': {
                backgroundColor: 'rgba(46, 125, 50, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(46, 125, 50, 0.15)',
                },
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 1 }}>
              {option.icon && (
                <Box sx={{ display: 'flex', alignItems: 'center', color: '#666' }}>
                  {option.icon}
                </Box>
              )}
              
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ fontWeight: 'inherit' }}>
                  {option.label}
                </Box>
                {option.description && (
                  <Box sx={{ 
                    fontSize: '0.75rem', 
                    color: 'text.secondary', 
                    mt: 0.25,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {option.description}
                  </Box>
                )}
              </Box>
            </Box>
          </MenuItem>
        ))}
      </Select>
      
      {getHelperText() && (
        <FormHelperText>{getHelperText()}</FormHelperText>
      )}
    </FormControl>
  );
};

export default FormSelect;