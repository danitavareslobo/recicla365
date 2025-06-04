import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import './App.css';

import Login from './pages/Login/Login';
import CadastroUsuario from './pages/CadastroUsuario/CadastroUsuario';
import Dashboard from './pages/Dashboard/Dashboard';
import TesteForm from './pages/TesteForm';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro-usuario" element={<CadastroUsuario />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/teste-form" element={<TesteForm />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;