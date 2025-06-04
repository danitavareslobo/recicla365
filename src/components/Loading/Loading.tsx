import React from 'react';
import { Box, CircularProgress, Typography, Backdrop } from '@mui/material';
import { Nature } from '@mui/icons-material';
import './Loading.css';

interface LoadingProps {
  variant?: 'spinner' | 'dots' | 'pulse' | 'skeleton';
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
 text?: string;
  fullScreen?: boolean;
  inline?: boolean;
  withLogo?: boolean;
  backgroundColor?: string;
  transparent?: boolean;
}

const Loading: React.FC<LoadingProps> = ({
  variant = 'spinner',
  size = 'medium',
  color = 'primary',
  text,
  fullScreen = false,
  inline = false,
  withLogo = false,
  backgroundColor,
  transparent = false
}) => {
  const getSizeConfig = () => {
    switch (size) {
      case 'small':
        return { spinner: 24, text: '0.875rem', logo: '1.5rem' };
      case 'large':
        return { spinner: 60, text: '1.25rem', logo: '3rem' };
      default:
        return { spinner: 40, text: '1rem', logo: '2rem' };
    }
  };

  const sizeConfig = getSizeConfig();

  const getColorValue = () => {
    switch (color) {
      case 'primary': return '#2e7d32';
      case 'secondary': return '#388e3c';
      case 'success': return '#4caf50';
      case 'error': return '#f44336';
      case 'warning': return '#ff9800';
      case 'info': return '#2196f3';
      default: return '#2e7d32';
    }
  };

  const colorValue = getColorValue();

  const renderLoadingVariant = () => {
    switch (variant) {
      case 'dots':
        return (
          <Box className="loading-dots">
            <Box className="loading-dot" sx={{ backgroundColor: colorValue }} />
            <Box className="loading-dot" sx={{ backgroundColor: colorValue }} />
            <Box className="loading-dot" sx={{ backgroundColor: colorValue }} />
          </Box>
        );

      case 'pulse':
        return (
          <Box className="loading-pulse">
            <Box 
              className="loading-pulse-circle"
              sx={{ 
                backgroundColor: colorValue,
                width: sizeConfig.spinner,
                height: sizeConfig.spinner
              }}
            />
          </Box>
        );

      case 'skeleton':
        return (
          <Box className="loading-skeleton">
            <Box className="skeleton-line skeleton-line-1" />
            <Box className="skeleton-line skeleton-line-2" />
            <Box className="skeleton-line skeleton-line-3" />
          </Box>
        );

      default: 
        return (
          <CircularProgress
            size={sizeConfig.spinner}
            sx={{ color: colorValue }}
            className="loading-spinner"
          />
        );
    }
  };

  const loadingContent = (
    <Box 
      className={`loading-content ${variant} ${size}`}
      sx={{ backgroundColor: backgroundColor || 'transparent' }}
    >
      {withLogo && (
        <Box className="loading-logo" sx={{ mb: 2 }}>
          <Nature 
            sx={{ 
              fontSize: sizeConfig.logo, 
              color: colorValue,
              filter: 'drop-shadow(0 2px 4px rgba(46, 125, 50, 0.3))'
            }} 
          />
          <Typography 
            variant="h6" 
            className="loading-brand"
            sx={{ 
              color: colorValue, 
              fontSize: sizeConfig.text,
              fontWeight: 'bold',
              textShadow: '0 1px 2px rgba(46, 125, 50, 0.3)'
            }}
          >
            Recicla365
          </Typography>
        </Box>
      )}

      <Box className="loading-animation">
        {renderLoadingVariant()}
      </Box>

      {text && (
        <Typography 
          className="loading-text"
          sx={{ 
            color: colorValue,
            fontSize: sizeConfig.text,
            mt: withLogo ? 1 : 2
          }}
        >
          {text}
        </Typography>
      )}
    </Box>
  );

  if (inline) {
    return loadingContent;
  }

  if (fullScreen) {
    return (
      <Backdrop
        open={true}
        className={`loading-backdrop ${transparent ? 'transparent' : ''}`}
        sx={{ 
          zIndex: 9999,
          backgroundColor: transparent 
            ? 'rgba(255, 255, 255, 0.7)' 
            : 'rgba(255, 255, 255, 0.9)'
        }}
      >
        {loadingContent}
      </Backdrop>
    );
  }

  return (
    <Box className="loading-container">
      {loadingContent}
    </Box>
  );
};

export default Loading;