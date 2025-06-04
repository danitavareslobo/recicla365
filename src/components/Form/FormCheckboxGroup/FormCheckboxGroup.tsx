import React from 'react';
import { 
  FormControl, 
  FormGroup, 
  FormControlLabel, 
  Checkbox, 
  FormLabel, 
  FormHelperText,
  Box,
  Tooltip
} from '@mui/material';
import { Help } from '@mui/icons-material';
import './FormCheckboxGroup.css';

export interface CheckboxOption {
  value: string;
  label: string;
  disabled?: boolean;
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
}

export interface FormCheckboxGroupProps {
  name: string;
  label: string;
  options: CheckboxOption[];
  value?: string[];
  onChange?: (selectedValues: string[]) => void;
  error?: boolean;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  row?: boolean;
  tooltip?: string;
  maxSelection?: number;
  minSelection?: number;
  selectAllOption?: boolean;
}

const FormCheckboxGroup: React.FC<FormCheckboxGroupProps> = ({
  name,
  label,
  options,
  value = [],
  onChange,
  error = false,
  helperText,
  required = false,
  disabled = false,
  row = false,
  tooltip,
  maxSelection,
  minSelection,
  selectAllOption = false
}) => {
  
  const handleCheckboxChange = (optionValue: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!onChange) return;

    const isChecked = event.target.checked;
    let newValues: string[];

    if (isChecked) {
      if (maxSelection && value.length >= maxSelection) {
        return; 
      }
      newValues = [...value, optionValue];
    } else {
      newValues = value.filter(val => val !== optionValue);
    }

    onChange(newValues);
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!onChange) return;

    if (event.target.checked) {
      const allValues = options
        .filter(option => !option.disabled)
        .map(option => option.value);
      onChange(allValues);
    } else {
      onChange([]);
    }
  };

  const allSelected = options
    .filter(option => !option.disabled)
    .every(option => value.includes(option.value));

  const someSelected = value.length > 0 && !allSelected;

  const renderLabel = () => {
    const labelElement = (
      <FormLabel 
        component="legend" 
        required={required}
        error={error}
        className="form-checkbox-label"
      >
        {label}
      </FormLabel>
    );

    if (tooltip) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {labelElement}
          <Tooltip title={tooltip} arrow>
            <Help sx={{ fontSize: '1rem', color: 'text.secondary' }} />
          </Tooltip>
        </Box>
      );
    }

    return labelElement;
  };

  const canSelectMore = !maxSelection || value.length < maxSelection;

  return (
    <FormControl 
      component="fieldset" 
      error={error}
      disabled={disabled}
      className={`form-checkbox-group ${error ? 'error' : ''}`}
    >
      {renderLabel()}
      
      <FormGroup row={row} className="checkbox-group">
        {selectAllOption && options.length > 2 && (
          <FormControlLabel
            control={
              <Checkbox
                checked={allSelected}
                indeterminate={someSelected}
                onChange={handleSelectAll}
                disabled={disabled}
                color="primary"
                className="select-all-checkbox"
              />
            }
            label="Selecionar todos"
            className="select-all-option"
          />
        )}
        
        {options.map((option) => {
          const isChecked = value.includes(option.value);
          const isDisabled = disabled || option.disabled || (!isChecked && !canSelectMore);
          
          return (
            <FormControlLabel
              key={option.value}
              control={
                <Checkbox
                  checked={isChecked}
                  onChange={handleCheckboxChange(option.value)}
                  disabled={isDisabled}
                  color={option.color || 'primary'}
                  name={`${name}-${option.value}`}
                  value={option.value}
                />
              }
              label={option.label}
              className={`checkbox-option ${isDisabled ? 'disabled' : ''}`}
            />
          );
        })}
      </FormGroup>

      {helperText && (
        <FormHelperText className="helper-text">
          {helperText}
        </FormHelperText>
      )}

      {(maxSelection || minSelection) && (
        <FormHelperText className="selection-counter">
          Selecionados: {value.length}
          {maxSelection && ` / ${maxSelection}`}
          {minSelection && value.length < minSelection && (
            <span className="min-warning"> (mín: {minSelection})</span>
          )}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default FormCheckboxGroup;