import { ReactNode } from "react";

export type Tokens = {
  accessToken: string;
  refreshToken: string;
  expireIn?: number;
  expireAt?: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  tokens: Tokens | null;
  login: (data: { email: string; password: string }) => Promise<{ success: boolean; error?: any }>;
  registerUser: (data: { name: string; email: string; password: string }) => Promise<{ success: boolean; error?: any }>;
  logout: () => void;
}

export type AuthProviderProps = {
  children: ReactNode;
}
