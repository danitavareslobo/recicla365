import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import StatusCard from '../../components/StatusCard/StatusCard';
import Loading from '../../components/Loading/Loading';
import { useAuth } from '../../context/AuthContext';
import { useCollectionPoints } from '../../context/CollectionPointsContext';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const auth = useAuth();
  const collectionPoints = useCollectionPoints();
  
  const carregarUsuarios = () => {
    const usuarios = localStorage.getItem('usuarios');
    return usuarios ? JSON.parse(usuarios) : [];
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsLoading(false);
    };

    loadDashboardData();
  }, []);

  const totalUsers = carregarUsuarios().length;
  const totalCollectionPoints = collectionPoints.locaisColeta.length;

  if (isLoading) {
    return (
      <div className="dashboard-page">
        <Navbar />
        <div className="dashboard">
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <Navbar />
      <div className="dashboard">
        <div className="dashboard__header">
          <h1 className="dashboard__title">Dashboard</h1>
          <p className="dashboard__subtitle">
            Visão geral dos locais de coleta de resíduos cadastrados
          </p>
        </div>

        <div className="dashboard__content">
          <section className="dashboard__status-section">
            <h2 className="dashboard__section-title">Status da Plataforma</h2>
            <div className="dashboard__status-cards">
              <StatusCard
                title="Usuários Ativos"
                value={totalUsers}
                icon="👥"
                color="blue"
                description="Total de usuários cadastrados na plataforma"
              />
              <StatusCard
                title="Locais de Coleta"
                value={totalCollectionPoints}
                icon="📍"
                color="green"
                description="Pontos de coleta registrados"
              />
            </div>
          </section>

          <section className="dashboard__locations-section">
            <h2 className="dashboard__section-title">Locais de Coleta</h2>
            <div className="dashboard__locations-list">
              <div className="dashboard__placeholder">
                Lista de locais de coleta será implementada na próxima etapa
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;