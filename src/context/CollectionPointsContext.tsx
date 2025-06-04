import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export type TipoResiduo = 'Vidro' | 'Metal' | 'Papel' | 'Plástico' | 'Orgânico' | 'Baterias' | 'Eletrônicos' | 'Óleo';

export interface LocalColeta {
  id: string;
  nomeLocal: string;
  descricaoLocal: string;
  identificadorUsuario: string; 
  localizacao: {
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    latitude?: number;
    longitude?: number;
  };
  tiposResiduos: TipoResiduo[];
  dataCadastro: string;
  ativo: boolean;
}

interface CollectionPointsContextType {
  locaisColeta: LocalColeta[];
  loading: boolean;
  criarLocalColeta: (localData: Omit<LocalColeta, 'id' | 'dataCadastro'>) => Promise<boolean>;
  editarLocalColeta: (id: string, localData: Partial<LocalColeta>) => Promise<boolean>;
  excluirLocalColeta: (id: string) => Promise<boolean>;
  buscarLocalPorId: (id: string) => LocalColeta | undefined;
  buscarLocaisPorUsuario: (userId: string) => LocalColeta[];
  buscarLocaisPorTipoResiduo: (tipo: TipoResiduo) => LocalColeta[];
  getEstatisticas: () => {
    totalLocais: number;
    locaisAtivos: number;
    tiposResiduosMaisComuns: Array<{ tipo: TipoResiduo; quantidade: number }>;
  };
}

const CollectionPointsContext = createContext<CollectionPointsContextType | undefined>(undefined);

export const CollectionPointsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locaisColeta, setLocaisColeta] = useState<LocalColeta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLocaisFromStorage();
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('recicla365_locaisColeta', JSON.stringify(locaisColeta));
    }
  }, [locaisColeta, loading]);

  const loadLocaisFromStorage = () => {
    try {
      const savedLocais = localStorage.getItem('recicla365_locaisColeta');
      if (savedLocais) {
        setLocaisColeta(JSON.parse(savedLocais));
      } else {
        const initialLocais = createInitialLocais();
        setLocaisColeta(initialLocais);
      }
    } catch (error) {
      console.error('Erro ao carregar locais de coleta:', error);
      const initialLocais = createInitialLocais();
      setLocaisColeta(initialLocais);
    }
  };

  const createInitialLocais = (): LocalColeta[] => {
    return [
      {
        id: 'local_1',
        nomeLocal: 'EcoPonto Centro',
        descricaoLocal: 'Ponto de coleta no centro da cidade, aceita diversos tipos de materiais recicláveis.',
        identificadorUsuario: '1', 
        localizacao: {
          cep: '89201-400',
          logradouro: 'Rua do Príncipe',
          numero: '150',
          bairro: 'Centro',
          cidade: 'Joinville',
          estado: 'SC',
          latitude: -26.3045,
          longitude: -48.8487
        },
        tiposResiduos: ['Papel', 'Plástico', 'Metal', 'Vidro'],
        dataCadastro: '2024-01-15T09:00:00Z',
        ativo: true
      },
      {
        id: 'local_2',
        nomeLocal: 'Coleta Sustentável Bucarein',
        descricaoLocal: 'Especializado em eletrônicos e baterias, funcionamento 24h.',
        identificadorUsuario: '2', 
        localizacao: {
          cep: '89202-200',
          logradouro: 'Avenida Juscelino Kubitschek',
          numero: '2500',
          bairro: 'Bucarein',
          cidade: 'Joinville',
          estado: 'SC',
          latitude: -26.2866,
          longitude: -48.8420
        },
        tiposResiduos: ['Eletrônicos', 'Baterias', 'Metal'],
        dataCadastro: '2024-02-01T14:30:00Z',
        ativo: true
      },
      {
        id: 'local_3',
        nomeLocal: 'Reciclagem Verde América',
        descricaoLocal: 'Foco em materiais orgânicos e compostagem comunitária.',
        identificadorUsuario: '3', 
        localizacao: {
          cep: '89204-100',
          logradouro: 'Rua Albano Schmidt',
          numero: '1200',
          bairro: 'América',
          cidade: 'Joinville',
          estado: 'SC',
          latitude: -26.3156,
          longitude: -48.8600
        },
        tiposResiduos: ['Orgânico', 'Papel'],
        dataCadastro: '2024-02-10T11:15:00Z',
        ativo: true
      }
    ];
  };

  const generateLocalId = (): string => {
    return `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const criarLocalColeta = async (localData: Omit<LocalColeta, 'id' | 'dataCadastro'>): Promise<boolean> => {
    try {
      const novoLocal: LocalColeta = {
        ...localData,
        id: generateLocalId(),
        dataCadastro: new Date().toISOString(),
      };

      setLocaisColeta(prev => [...prev, novoLocal]);
      return true;
    } catch (error) {
      console.error('Erro ao criar local de coleta:', error);
      return false;
    }
  };

  const editarLocalColeta = async (id: string, localData: Partial<LocalColeta>): Promise<boolean> => {
    try {
      setLocaisColeta(prev => 
        prev.map(local => 
          local.id === id 
            ? { ...local, ...localData }
            : local
        )
      );
      return true;
    } catch (error) {
      console.error('Erro ao editar local de coleta:', error);
      return false;
    }
  };

  const excluirLocalColeta = async (id: string): Promise<boolean> => {
    try {
      setLocaisColeta(prev => prev.filter(local => local.id !== id));
      return true;
    } catch (error) {
      console.error('Erro ao excluir local de coleta:', error);
      return false;
    }
  };

  const buscarLocalPorId = (id: string): LocalColeta | undefined => {
    return locaisColeta.find(local => local.id === id);
  };

  const buscarLocaisPorUsuario = (userId: string): LocalColeta[] => {
    return locaisColeta.filter(local => local.identificadorUsuario === userId);
  };

  const buscarLocaisPorTipoResiduo = (tipo: TipoResiduo): LocalColeta[] => {
    return locaisColeta.filter(local => 
      local.ativo && local.tiposResiduos.includes(tipo)
    );
  };

  const getEstatisticas = () => {
    const totalLocais = locaisColeta.length;
    const locaisAtivos = locaisColeta.filter(local => local.ativo).length;
    
    const contadorTipos: Record<TipoResiduo, number> = {
      'Vidro': 0,
      'Metal': 0,
      'Papel': 0,
      'Plástico': 0,
      'Orgânico': 0,
      'Baterias': 0,
      'Eletrônicos': 0,
      'Óleo': 0
    };

    locaisColeta.forEach(local => {
      if (local.ativo) {
        local.tiposResiduos.forEach(tipo => {
          contadorTipos[tipo]++;
        });
      }
    });

    const tiposResiduosMaisComuns = Object.entries(contadorTipos)
      .map(([tipo, quantidade]) => ({ tipo: tipo as TipoResiduo, quantidade }))
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, 5);

    return {
      totalLocais,
      locaisAtivos,
      tiposResiduosMaisComuns
    };
  };

  const value: CollectionPointsContextType = {
    locaisColeta,
    loading,
    criarLocalColeta,
    editarLocalColeta,
    excluirLocalColeta,
    buscarLocalPorId,
    buscarLocaisPorUsuario,
    buscarLocaisPorTipoResiduo,
    getEstatisticas
  };

  return (
    <CollectionPointsContext.Provider value={value}>
      {children}
    </CollectionPointsContext.Provider>
  );
};

export const useCollectionPoints = (): CollectionPointsContextType => {
  const context = useContext(CollectionPointsContext);
  if (context === undefined) {
    throw new Error('useCollectionPoints deve ser usado dentro de um CollectionPointsProvider');
  }
  return context;
};