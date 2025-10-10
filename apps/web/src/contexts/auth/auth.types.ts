import { ReactNode } from "react";

export interface Tokens {
  accessToken: string;
  refreshToken: string;
  expireIn?: number;
  expireAt?: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  tokens?: Tokens;
  loading: boolean;
  login: (data: { email: string; password: string }) => Promise<{ success: boolean; error?: any }>;
  registerUser: (data: { name: string; email: string; password: string }) => Promise<{ success: boolean; error?: any }>;
  logout: () => void;
  refreshToken: () => Promise<{ success: boolean; error?: any }>;
}

export interface AuthProviderProps {
  children: ReactNode;
}
