import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import Navbar from '../../components/Navbar/Navbar';

const Dashboard: React.FC = () => {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ pt: 4, pb: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
            Dashboard - Recicla365
          </Typography>
        </Box>
        
        <Typography>
          Dashboard em construção...
        </Typography>
      </Container>
    </Box>
  );
};

export default Dashboard;