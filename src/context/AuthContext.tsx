import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Usuario, LoginData } from '../types';

interface AuthContextType {
  usuario: Usuario | null;
  login: (dados: LoginData) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  const usuariosIniciais: Usuario[] = [
    {
      id: '1',
      nome: 'João Silva',
      sexo: 'Masculino',
      cpf: '123.456.789-01',
      dataNascimento: '1990-05-15',
      email: 'joao@email.com',
      senha: '123456',
      endereco: {
        cep: '89202-070',
        logradouro: 'Rua XV de Novembro',
        numero: '100',
        bairro: 'Centro',
        cidade: 'Joinville',
        estado: 'SC'
      }
    },
    {
      id: '2',
      nome: 'Maria Santos',
      sexo: 'Feminino',
      cpf: '987.654.321-01',
      dataNascimento: '1985-08-22',
      email: 'maria@email.com',
      senha: '123456',
      endereco: {
        cep: '89204-250',
        logradouro: 'Rua Princesa Isabel',
        numero: '250',
        bairro: 'Bucarein',
        cidade: 'Joinville',
        estado: 'SC'
      }
    },
    {
      id: '3',
      nome: 'Carlos Eduardo',
      sexo: 'Masculino',
      cpf: '456.789.123-45',
      dataNascimento: '1992-12-10',
      email: 'carlos@email.com',
      senha: '123456',
      endereco: {
        cep: '89206-001',
        logradouro: 'Rua das Palmeiras',
        numero: '789',
        bairro: 'América',
        cidade: 'Joinville',
        estado: 'SC'
      }
    },
    {
      id: '4',
      nome: 'Ana Clara',
      sexo: 'Feminino',
      cpf: '789.123.456-78',
      dataNascimento: '1988-03-25',
      email: 'ana@email.com',
      senha: '123456',
      endereco: {
        cep: '89208-200',
        logradouro: 'Rua São José',
        numero: '456',
        bairro: 'Floresta',
        cidade: 'Joinville',
        estado: 'SC'
      }
    },
    {
      id: '5',
      nome: 'Roberto Machado',
      sexo: 'Masculino',
      cpf: '321.654.987-10',
      dataNascimento: '1975-11-08',
      email: 'roberto@email.com',
      senha: '123456',
      endereco: {
        cep: '89210-500',
        logradouro: 'Rua Blumenau',
        numero: '1234',
        bairro: 'Glória',
        cidade: 'Joinville',
        estado: 'SC'
      }
    }
  ];

  const carregarUsuarios = (): Usuario[] => {
    const usuarios = localStorage.getItem('usuarios');
    if (usuarios) {
      return JSON.parse(usuarios);
    }
    
    localStorage.setItem('usuarios', JSON.stringify(usuariosIniciais));
    return usuariosIniciais;
  };

  const login = (dados: LoginData): boolean => {
    const usuarios = carregarUsuarios();
    const usuarioEncontrado = usuarios.find(
      u => u.email === dados.email && u.senha === dados.senha
    );

    if (usuarioEncontrado) {
      setUsuario(usuarioEncontrado);
      localStorage.setItem('usuarioLogado', JSON.stringify(usuarioEncontrado));
      return true;
    }
    return false;
  };

  const logout = (): void => {
    setUsuario(null);
    localStorage.removeItem('usuarioLogado');
  };

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem('usuarioLogado');
    if (usuarioSalvo) {
      setUsuario(JSON.parse(usuarioSalvo));
    }
    carregarUsuarios();
  }, []);

  const contextValue: AuthContextType = {
    usuario,
    login,
    logout,
    isAuthenticated: !!usuario
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};