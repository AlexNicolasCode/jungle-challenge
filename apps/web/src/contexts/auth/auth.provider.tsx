import { AxiosResponse } from 'axios';
import { useEffect, useMemo, useState } from 'react';

import { authApiClient } from '../../clients/auth';
import { AuthContext } from './auth.context';
import { AuthProviderProps, Tokens } from './auth.types';
import { getTokens } from '@/shared/utils';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [tokens, setTokens] = useState<Tokens | undefined>(getTokens());

  const isAuthenticated = useMemo(() => !!tokens, [tokens]);

  useEffect(() => {
    function handleStorageChange(event: CustomEvent) {
        setTokens(event.detail);
    };
    window.addEventListener('storage', handleStorageChange as EventListener);
    return () => {
      window.removeEventListener('storage', handleStorageChange as EventListener);
    };
  }, [])

  const registerUser = async (form: { name: string; email: string; password: string }) => {
    try {
      const response: AxiosResponse<Tokens> = await authApiClient.post('/register', form);
      setTokens(response.data);
      localStorage.setItem('tokens', JSON.stringify(response.data));
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.response?.data || error.message };
    }
  };

  const login = async (form: { email: string; password: string }) => {
    try {
      const response: AxiosResponse<Tokens> = await authApiClient.post('/login', form);
      setTokens(response.data);
      localStorage.setItem('tokens', JSON.stringify(response.data));
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.response?.data || error.message };
    }
  };

  const logout = () => {
    setTokens(undefined);
    localStorage.removeItem('tokens');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, tokens, login, registerUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
