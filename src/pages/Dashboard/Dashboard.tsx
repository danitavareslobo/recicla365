import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import Navbar from '../../components/Navbar/Navbar';
import Loading from '../../components/Loading/Loading';

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <Loading 
          fullScreen 
          withLogo 
          text="Carregando Dashboard..." 
          variant="pulse"
        />
      </>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ pt: 4, pb: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
            Dashboard - Recicla365
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 4 }}>
          <Loading inline size="small" variant="dots" />
          <Loading inline size="medium" variant="spinner" />
          <Loading inline size="large" variant="pulse" color="success" />
          <Loading inline variant="skeleton" />
        </Box>

        <Button 
          onClick={() => setLoading(true)} 
          variant="contained"
          sx={{ backgroundColor: '#2e7d32' }}
        >
          Testar Loading Novamente
        </Button>
      </Container>
    </Box>
  );
};

export default Dashboard;