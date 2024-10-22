import React, { createContext, useContext } from 'react';
import { QueryClient } from '@tanstack/react-query';

export const QueryClientContext = createContext<QueryClient | undefined>(undefined);

export const useQueryClientContext = () => {
  const context = useContext(QueryClientContext);
  if (!context) {
    throw new Error('useQueryClientContext must be used within QueryClientContextProvider');
  }
  return context;
};

interface QueryClientContextProviderProps {
  queryClient: QueryClient;
  children: React.ReactNode;
}

export const QueryClientContextProviderContext = ({ queryClient, children }: QueryClientContextProviderProps) => {
  return (
    <QueryClientContext.Provider value={queryClient}>
      {children}
    </QueryClientContext.Provider>
  );
};