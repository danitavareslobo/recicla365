import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import './Dashboard.css';

const Dashboard: React.FC = () => {
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
              <div className="dashboard__placeholder">
                Cards de status serão implementados na próxima etapa
              </div>
            </div>
          </section>

          <section className="dashboard__locations-section">
            <h2 className="dashboard__section-title">Locais de Coleta</h2>
            <div className="dashboard__locations-list">
              <div className="dashboard__placeholder">
                Lista de locais de coleta será implementada posteriormente
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;