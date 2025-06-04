import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { CollectionPointsProvider } from './context/CollectionPointsContext';
import { LocalStorageProvider } from './context/LocalStorageContext';

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <LocalStorageProvider>
      <AuthProvider>
        <CollectionPointsProvider>
          {children}
        </CollectionPointsProvider>
      </AuthProvider>
    </LocalStorageProvider>
  );
};