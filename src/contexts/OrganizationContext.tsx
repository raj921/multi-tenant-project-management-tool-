'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';

interface Organization {
  id: string;
  name: string;
  slug: string;
  contactEmail: string;
  createdAt: string;
  owner: {
    id: string;
    username: string;
    email: string;
  };
}

interface OrganizationState {
  currentOrganization: Organization | null;
  organizations: Organization[];
  loading: boolean;
  error: string | null;
}

type OrganizationAction =
  | { type: 'SET_LOADING' }
  | { type: 'SET_ORGANIZATIONS'; payload: Organization[] }
  | { type: 'SET_CURRENT_ORGANIZATION'; payload: Organization | null }
  | { type: 'ADD_ORGANIZATION'; payload: Organization }
  | { type: 'UPDATE_ORGANIZATION'; payload: Organization }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' };

const initialState: OrganizationState = {
  currentOrganization: null,
  organizations: [],
  loading: false,
  error: null,
};

const organizationReducer = (state: OrganizationState, action: OrganizationAction): OrganizationState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: true, error: null };
    case 'SET_ORGANIZATIONS':
      return { ...state, organizations: action.payload, loading: false };
    case 'SET_CURRENT_ORGANIZATION':
      return { ...state, currentOrganization: action.payload, loading: false };
    case 'ADD_ORGANIZATION':
      return { ...state, organizations: [...state.organizations, action.payload], loading: false };
    case 'UPDATE_ORGANIZATION':
      return {
        ...state,
        organizations: state.organizations.map(org =>
          org.id === action.payload.id ? action.payload : org
        ),
        currentOrganization: state.currentOrganization?.id === action.payload.id ? action.payload : state.currentOrganization,
        loading: false
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

interface OrganizationContextType {
  state: OrganizationState;
  dispatch: React.Dispatch<OrganizationAction>;
  setCurrentOrganization: (organization: Organization | null) => void;
  setOrganizations: (organizations: Organization[]) => void;
  addOrganization: (organization: Organization) => void;
  updateOrganization: (organization: Organization) => void;
  setLoading: () => void;
  setError: (error: string) => void;
  clearError: () => void;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export const useOrganization = () => {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  return context;
};

interface OrganizationProviderProps {
  children: React.ReactNode;
}

export const OrganizationProvider: React.FC<OrganizationProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(organizationReducer, {
    ...initialState,
    // Initialize with mock data for demonstration
    organizations: [
      {
        id: '1',
        name: 'Acme Corp',
        slug: 'acme-corp',
        contactEmail: 'contact@acme.com',
        createdAt: '2024-01-01',
        owner: {
          id: '1',
          username: 'john_doe',
          email: 'john@example.com',
        },
      },
      {
        id: '2',
        name: 'Tech Startup',
        slug: 'tech-startup',
        contactEmail: 'hello@tech.com',
        createdAt: '2024-01-15',
        owner: {
          id: '1',
          username: 'john_doe',
          email: 'john@example.com',
        },
      },
    ],
    currentOrganization: {
      id: '1',
      name: 'Acme Corp',
      slug: 'acme-corp',
      contactEmail: 'contact@acme.com',
      createdAt: '2024-01-01',
      owner: {
        id: '1',
        username: 'john_doe',
        email: 'john@example.com',
      },
    },
  });

  // Load organization from localStorage on mount
  useEffect(() => {
    // Only access localStorage in browser environment
    if (typeof window !== 'undefined') {
      const savedOrgSlug = localStorage.getItem('organizationSlug');
      if (savedOrgSlug) {
        // You might want to fetch the full organization data here
        // For now, we'll just set it from the organizations list if available
        const org = state.organizations.find(o => o.slug === savedOrgSlug);
        if (org) {
          dispatch({ type: 'SET_CURRENT_ORGANIZATION', payload: org });
        }
      }
    }
  }, [state.organizations]);

  const setCurrentOrganization = (organization: Organization | null) => {
    dispatch({ type: 'SET_CURRENT_ORGANIZATION', payload: organization });
    if (organization) {
      // Only access localStorage in browser environment
      if (typeof window !== 'undefined') {
        localStorage.setItem('organizationSlug', organization.slug);
      }
    } else {
      // Only access localStorage in browser environment
      if (typeof window !== 'undefined') {
        localStorage.removeItem('organizationSlug');
      }
    }
  };

  const setOrganizations = (organizations: Organization[]) => {
    dispatch({ type: 'SET_ORGANIZATIONS', payload: organizations });
  };

  const addOrganization = (organization: Organization) => {
    dispatch({ type: 'ADD_ORGANIZATION', payload: organization });
  };

  const updateOrganization = (organization: Organization) => {
    dispatch({ type: 'UPDATE_ORGANIZATION', payload: organization });
  };

  const setLoading = () => {
    dispatch({ type: 'SET_LOADING' });
  };

  const setError = (error: string) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: OrganizationContextType = {
    state,
    dispatch,
    setCurrentOrganization,
    setOrganizations,
    addOrganization,
    updateOrganization,
    setLoading,
    setError,
    clearError,
  };

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  );
};