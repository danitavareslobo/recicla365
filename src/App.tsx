import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProviders } from './AppProviders';
import { useAuth } from './context/index';
import Login from './pages/Login/Login';
import CadastroUsuario from './pages/CadastroUsuario/CadastroUsuario';
import Dashboard from './pages/Dashboard/Dashboard';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
            } 
        />
        
        <Route 
          path="/cadastro" 
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <CadastroUsuario />
            } 
        />

        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* <Route 
          path="/locais/cadastro" 
          element={
            <ProtectedRoute>
              <CadastroLocal />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/locais/editar/:id" 
          element={
            <ProtectedRoute>
              <CadastroLocal />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/locais" 
          element={
            <ProtectedRoute>
              <ListagemLocais />
            </ProtectedRoute>
          } 
        /> */}

        <Route 
          path="/" 
          element={
            <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
          } 
        />

        <Route 
          path="*" 
          element={
            <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
          } 
        />
      </Routes>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <AppProviders>
      <div className="App">
        <AppRoutes />
      </div>
    </AppProviders>
  );
};

export default App;