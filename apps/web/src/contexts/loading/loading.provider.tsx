import React, { useEffect, useState } from 'react';

import { Loading } from '../../components';
import { useTasks } from '../../hooks';
import { LoadingContext } from './loading.context';
import { LoadingProviderProps } from './loading.types';

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  const { loading: taskLoading } = useTasks();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (taskLoading) {
      setLoading(true);
      return;
    }
    setLoading(false);
  }, [taskLoading])

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
