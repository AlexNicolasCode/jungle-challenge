import React, { useEffect, useState } from 'react';

import { LoadingContext } from './loading.context';
import { LoadingProviderProps } from './loading.types';
import { useAuth, useTasks } from '../../hooks';
import { Loading } from '../../components';

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  const { loading: authLoading } = useAuth();
  const { loading: taskLoading } = useTasks();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (authLoading || taskLoading) {
      setLoading(true);
      return;
    }
    setLoading(false);
  }, [taskLoading, authLoading])

  const renderLoading = (message?: string) => {
    return <Loading message={message} />
  }

  return (
    <LoadingContext.Provider
      value={{ loading, renderLoading }}
    >
      {children}
    </LoadingContext.Provider>
  );
};
