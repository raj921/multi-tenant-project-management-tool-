'use client';

import { ApolloProvider as ApolloClientProvider } from '@apollo/client';
import { client } from './client';

interface ApolloProviderProps {
  children: React.ReactNode;
}

export function ApolloProvider({ children }: ApolloProviderProps) {
  return <ApolloClientProvider client={client}>{children}</ApolloClientProvider>;
}