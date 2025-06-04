import React, { createContext, useContext } from 'react';

export const STORAGE_KEYS = {
  USUARIOS: 'usuarios',
  USUARIO_LOGADO: 'usuarioLogado',
  LOCAIS_COLETA: 'recicla365_locaisColeta',
  CONFIGURACOES: 'recicla365_configuracoes',
  ESTATISTICAS: 'recicla365_estatisticas'
} as const;

interface AppConfiguracoes {
  tema: 'claro' | 'escuro';
  notificacoes: boolean;
  idioma: string;
}

interface LocalStorageContextType {
  getItem: <T>(key: string, defaultValue?: T) => T | null;
  setItem: <T>(key: string, value: T) => boolean;
  removeItem: (key: string) => boolean;
  clearAll: () => boolean;
  
  salvarUsuarios: (usuarios: any[]) => boolean;
  carregarUsuarios: () => any[];
  salvarUsuarioLogado: (usuario: any) => boolean;
  carregarUsuarioLogado: () => any | null;
  removerUsuarioLogado: () => boolean;
  
  salvarLocaisColeta: (locais: any[]) => boolean;
  carregarLocaisColeta: () => any[];
  
  salvarConfiguracoes: (config: AppConfiguracoes) => boolean;
  carregarConfiguracoes: () => AppConfiguracoes;
  
  getStorageSize: () => string;
  isStorageAvailable: () => boolean;
  exportarDados: () => string;
  importarDados: (jsonData: string) => boolean;
}

const LocalStorageContext = createContext<LocalStorageContextType | undefined>(undefined);

export const LocalStorageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  
  const isStorageAvailable = (): boolean => {
    try {
      const test = '__test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  };

  const getItem = <T,>(key: string, defaultValue?: T): T | null => {
    if (!isStorageAvailable()) {
      console.warn('localStorage não está disponível');
      return defaultValue || null;
    }

    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return defaultValue || null;
      }
      return JSON.parse(item);
    } catch (error) {
      console.error(`Erro ao buscar item '${key}':`, error);
      return defaultValue || null;
    }
  };

  const setItem = <T,>(key: string, value: T): boolean => {
    if (!isStorageAvailable()) {
      console.warn('localStorage não está disponível');
      return false;
    }

    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Erro ao salvar item '${key}':`, error);
      return false;
    }
  };

  const removeItem = (key: string): boolean => {
    if (!isStorageAvailable()) {
      console.warn('localStorage não está disponível');
      return false;
    }

    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Erro ao remover item '${key}':`, error);
      return false;
    }
  };

  const clearAll = (): boolean => {
    if (!isStorageAvailable()) {
      return false;
    }

    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      return true;
    } catch (error) {
      console.error('Erro ao limpar localStorage:', error);
      return false;
    }
  };

  const salvarUsuarios = (usuarios: any[]): boolean => {
    return setItem(STORAGE_KEYS.USUARIOS, usuarios);
  };

  const carregarUsuarios = (): any[] => {
    return getItem(STORAGE_KEYS.USUARIOS, [] as any[]) || [];
  };

  const salvarUsuarioLogado = (usuario: any): boolean => {
    return setItem(STORAGE_KEYS.USUARIO_LOGADO, usuario);
  };

  const carregarUsuarioLogado = (): any | null => {
    return getItem(STORAGE_KEYS.USUARIO_LOGADO);
  };

  const removerUsuarioLogado = (): boolean => {
    return removeItem(STORAGE_KEYS.USUARIO_LOGADO);
  };

  const salvarLocaisColeta = (locais: any[]): boolean => {
    return setItem(STORAGE_KEYS.LOCAIS_COLETA, locais);
  };

  const carregarLocaisColeta = (): any[] => {
    return getItem(STORAGE_KEYS.LOCAIS_COLETA, [] as any[]) || [];
  };

  const salvarConfiguracoes = (config: AppConfiguracoes): boolean => {
    return setItem(STORAGE_KEYS.CONFIGURACOES, config);
  };

  const carregarConfiguracoes = (): AppConfiguracoes => {
    return getItem(STORAGE_KEYS.CONFIGURACOES, {
      tema: 'claro' as const,
      notificacoes: true,
      idioma: 'pt-BR'
    } as AppConfiguracoes) || {
      tema: 'claro' as const,
      notificacoes: true,
      idioma: 'pt-BR'
    };
  };

  const getStorageSize = (): string => {
    if (!isStorageAvailable()) {
      return '0 KB';
    }

    let total = 0;
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }

    const sizeInKB = (total / 1024).toFixed(2);
    return `${sizeInKB} KB`;
  };

  const exportarDados = (): string => {
    try {
      const dados = {
        usuarios: carregarUsuarios(),
        usuarioLogado: carregarUsuarioLogado(),
        locaisColeta: carregarLocaisColeta(),
        configuracoes: carregarConfiguracoes(),
        dataExportacao: new Date().toISOString(),
        versao: '1.0.0'
      };

      return JSON.stringify(dados, null, 2);
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      return '';
    }
  };

  const importarDados = (jsonData: string): boolean => {
    try {
      const dados = JSON.parse(jsonData);
      
      if (!dados.versao) {
        throw new Error('Arquivo de dados inválido');
      }

      if (dados.usuarios) salvarUsuarios(dados.usuarios);
      if (dados.locaisColeta) salvarLocaisColeta(dados.locaisColeta);
      if (dados.configuracoes) salvarConfiguracoes(dados.configuracoes);

      return true;
    } catch (error) {
      console.error('Erro ao importar dados:', error);
      return false;
    }
  };

  const value: LocalStorageContextType = {
    getItem,
    setItem,
    removeItem,
    clearAll,
    salvarUsuarios,
    carregarUsuarios,
    salvarUsuarioLogado,
    carregarUsuarioLogado,
    removerUsuarioLogado,
    salvarLocaisColeta,
    carregarLocaisColeta,
    salvarConfiguracoes,
    carregarConfiguracoes,
    getStorageSize,
    isStorageAvailable,
    exportarDados,
    importarDados
  };

  return (
    <LocalStorageContext.Provider value={value}>
      {children}
    </LocalStorageContext.Provider>
  );
};

export const useLocalStorage = (): LocalStorageContextType => {
  const context = useContext(LocalStorageContext);
  if (context === undefined) {
    throw new Error('useLocalStorage deve ser usado dentro de um LocalStorageProvider');
  }
  return context;
};