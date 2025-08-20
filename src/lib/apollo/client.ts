'use client';

import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:8000/graphql/',
});

const authLink = setContext((_, { headers }) => {
  // Get the authentication token from local storage if it exists
  let token = '';
  let organizationSlug = '';
  
  // Only access localStorage in browser environment
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token') || '';
    organizationSlug = localStorage.getItem('organization_slug') || '';
  }
  
  // Return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
      'X-Organization-Slug': organizationSlug,
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          projects: {
            merge: (existing = [], incoming) => {
              return [...existing, ...incoming];
            },
          },
          tasks: {
            merge: (existing = [], incoming) => {
              return [...existing, ...incoming];
            },
          },
          taskComments: {
            merge: (existing = [], incoming) => {
              return [...existing, ...incoming];
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});

export { client };