import { AxiosResponse } from 'axios';
import { useMemo, useState } from 'react';

import { authApiClient } from '../../clients/auth';
import { AuthContext } from './auth.context';
import { AuthProviderProps, Tokens } from './auth.types';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [tokens, setTokens] = useState<Tokens | null>(JSON.parse(localStorage.getItem('tokens')));

  const isAuthenticated = useMemo(() => !!tokens, [tokens]);

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

  return (
    <AuthContext.Provider value={{ isAuthenticated, tokens, login, registerUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
