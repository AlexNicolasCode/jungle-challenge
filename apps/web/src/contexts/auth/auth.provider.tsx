import { AxiosResponse } from 'axios';
import { useEffect, useMemo, useState } from 'react';

import { authApiClient } from '../../clients/auth';
import { AuthContext } from './auth.context';
import { AuthProviderProps, Tokens } from './auth.types';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [tokens, setTokens] = useState<Tokens | null>(JSON.parse(localStorage.getItem('tokens')));
  const [loading, setLoading] = useState(false);

  const isAuthenticated = useMemo(() => !!tokens, [tokens]);

  useEffect(() => {
    refreshToken();
  }, []);

  const registerUser = async (data: { name: string; email: string; password: string }) => {
    try {
      const response: AxiosResponse<Tokens> = await authApiClient.post('/register', data);
      setTokens(response.data);
      localStorage.setItem('tokens', JSON.stringify(response.data));
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.response?.data || error.message };
    }
  };

  const login = async (data: { email: string; password: string }) => {
    try {
      const response: AxiosResponse<Tokens> = await authApiClient.post('/login', data);
      setTokens(response.data);
      localStorage.setItem('tokens', JSON.stringify(response.data));
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.response?.data || error.message };
    }
  };

  const logout = () => {
    setTokens(null);
    localStorage.removeItem('tokens');
  };

  const refreshToken = async () => {
    if (!tokens?.refreshToken) return { success: false, error: 'No refresh token' };
    try {
      const response: AxiosResponse<Tokens> = await authApiClient.post('/refresh', { refreshToken: tokens.refreshToken });
      setTokens(response.data);
      localStorage.setItem('tokens', JSON.stringify(response.data));
      return { success: true };
    } catch (error: any) {
      logout();
      return { success: false, error: error.response?.data || error.message };
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, tokens, loading, login, registerUser, logout, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};
