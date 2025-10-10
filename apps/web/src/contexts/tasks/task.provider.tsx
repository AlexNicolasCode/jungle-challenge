import React, { useCallback, useState } from 'react';

import { TasksContext } from './task.context';
import { TaskProviderProps, Task } from './task.types';
import { taskApiClient } from '../../clients/tasks';
import { useAuth } from '../../hooks';

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const { refreshToken } = useAuth();
  const [page, setPage] = useState<number>(1);
  const [maxPage, setMaxPage] = useState<number>(1);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const retry = async (statusCode: number, callback: () => void) => {
    const isAuthenticatedError = statusCode === 401;
    if (!isAuthenticatedError) {
      return;
    }
    const { success } = await refreshToken();
    if (!success) {
      setError('Internal Error');
      return;
    }
    return callback();
  }

  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await taskApiClient.get('', {
        params: {
          page: page,
          size: 10,
        }
      });
      const tasks: Task[] = response.data?.list ?? [];
      const totalPages: number = response.data?.totalPagess ?? 1;
      setMaxPage(totalPages);
      setTasks(tasks);
      setError(undefined);
    } catch (err: any) {
      retry(err.response?.data?.statusCode, loadTasks);
    } finally {
      setLoading(false);
    }
  }, [page]);

  const handleNextPage = () => {
    const nextPage = page+1;
    if (
      nextPage < 1 ||
      nextPage > maxPage
    ) {
      return;
    }
    setPage(nextPage);
  }

  const loadTaskById = async (taskId: string) => {
    setLoading(true);
    try {
      const response = await taskApiClient.get<Task>(`${taskId}`);
      setError(undefined);
      return response.data;
    } catch (err: any) {
      retry(err.response?.data?.statusCode, () => loadTaskById(taskId));
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (data: Omit<Task, 'id'>) => {
    setLoading(true);
    try {
      const response = await taskApiClient.post<Task>('', data);
      setTasks((prev) => [...prev, response.data]);
      setError(undefined);
      return response.data;
    } catch (err: any) {
      retry(err.response?.data?.statusCode, () => createTask(data));
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (taskId: string, data: Partial<Omit<Task, 'id'>>) => {
    setLoading(true);
    try {
      const response = await taskApiClient.put<Task>(`${taskId}`, data);
      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? response.data : task))
      );
      setError(undefined);
      return response.data;
    } catch (err: any) {
      retry(err.response?.data?.statusCode, () => updateTask(taskId, data));
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (taskId: string) => {
    setLoading(true);
    try {
      await taskApiClient.delete(`${taskId}`);
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
      setError(undefined);
    } catch (err: any) {
      retry(err.response?.data?.statusCode, () => deleteTask(taskId));
    } finally {
      setLoading(false);
    }
  };

  return (
    <TasksContext.Provider
      value={{
        tasks,
        loading,
        error,
        loadTasks,
        loadTaskById,
        createTask,
        updateTask,
        deleteTask,
        handleNextPage,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};
