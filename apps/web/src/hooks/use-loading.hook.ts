import { useContext } from "react";

import { LoadingContext, LoadingContextType } from "../contexts";

export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext);
  if (!context) throw new Error('useTasks must be used within a TaskProvider');
  return context;
};