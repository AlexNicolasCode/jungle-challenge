import { ReactNode } from "react";

export interface LoadingContextType {
  loading: boolean;
  renderLoading: (message?: string) => void;
}

export type LoadingProviderProps = {
  children: ReactNode;
}
