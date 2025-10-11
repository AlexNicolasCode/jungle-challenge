import React, { useCallback, useState } from 'react';

import { taskApiClient } from '../../clients/tasks';
import { useAuth } from '../../hooks';
import { TaskPriorityEnum, TaskStatusEnum } from '../../shared/enums';
import { CommentEntity, TaskEntity, UserEntity } from '../../shared/types';
import { TasksContext } from './task.context';
import { TaskProviderProps } from './task.types';

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const { loadTokens, refreshToken } = useAuth();
  const [page, setPage] = useState<number>(1);
  const [maxPage, setMaxPage] = useState<number>(1);
  const [commentsPage, setCommentPage] = useState<number>(1);
  const [tasks, setTasks] = useState<TaskEntity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const sortedTasks = React.useMemo(() => {
    const priorityOrder: Record<TaskPriorityEnum, number> = {
      [TaskPriorityEnum.URGENT]: 0,
      [TaskPriorityEnum.HIGH]: 1,
      [TaskPriorityEnum.MEDIUM]: 2,
      [TaskPriorityEnum.LOW]: 3,
    };

    const statusOrder: Record<TaskStatusEnum, number> = {
      [TaskStatusEnum.TODO]: 0,
      [TaskStatusEnum.IN_PROGRESS]: 1,
      [TaskStatusEnum.REVIEW]: 2,
      [TaskStatusEnum.DONE]: 3,
    };

    return [...tasks].sort((a: TaskEntity, b: TaskEntity) => {
      const priorityA = priorityOrder[a.priority as TaskPriorityEnum];
      const priorityB = priorityOrder[a.priority as TaskPriorityEnum];
      const statusA = statusOrder[a.status as TaskStatusEnum];
      const statusB = statusOrder[b.status as TaskStatusEnum];
      const priorityDiff = priorityA - priorityB;
      if (priorityDiff !== 0) return priorityDiff;
      return statusA - statusB;
    });
  }, [tasks]);

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
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      const response = await taskApiClient.get('', {
        params: {
          page: page,
          size: 10,
        },
      });
      const tasks: TaskEntity[] = response.data?.list ?? [];
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
    if (loading) {
      return;
    }
    setLoading(true);
    try {
        const response = await taskApiClient.get<TaskEntity>(`${taskId}`);
        setError(undefined);
        return response.data;
    } catch (err: any) {
        retry(err.response?.data?.statusCode, () => loadTaskById(taskId));
    } finally {
        setLoading(false);
    }
  };

  const loadCommentsByTaskId = async (taskId: string): Promise<CommentEntity[]> => {
    if (loading) {
      return [];
    }
    setLoading(true);
    try {
        const response = await taskApiClient.get(`${taskId}/comments`, {
            params: {
                page: commentsPage,
                size: 10,
            },
        });
        const comments: CommentEntity[] = response.data?.list ?? [];
        const totalPages: number = response.data?.totalPagess ?? 1;
        setCommentPage(totalPages);
        setError(undefined);
        return comments;
    } catch (err: any) {
        retry(err.response?.data?.statusCode, () => loadTaskById(taskId));
    } finally {
        setLoading(false);
    }
  };

  const createTask = async (task: {
      title: string;
      description?: string;
      deadline: string;
      priority: TaskPriorityEnum;
      status: TaskStatusEnum;
      createdAt: Date;
      updatedAt: Date;
      users: UserEntity[];
    }) => {
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      const response = await taskApiClient.post<TaskEntity>('', {
        title: task.title,
        deadline: task.deadline,
        priority: task.priority,
        status: task.status,
        users: [],
      });
      const taskId: string = response.data.id;
      setTasks((prev) => [...prev, { id: taskId, ...task }]);
      setError(undefined);
    } catch (err: any) {
      retry(err.response?.data?.statusCode, () => createTask(task));
    } finally {
      setLoading(false);
    }
  };

  const createCommentByTaskId = async ({
    taskId,
    content,
  }: {
    taskId: string;
    content: string;
  }) => {
    try {
      await taskApiClient.post<void>(`${taskId}/comments`, {
        content,
      });
      setError(undefined);
    } catch (err: any) {
      retry(err.response?.data?.statusCode, () => createTask(task));
    }
  };

  const updateTask = async (taskId: string, task: {
      title: string;
      description?: string;
      deadline: string;
      priority: TaskPriorityEnum;
      status: TaskStatusEnum;
      createdAt: Date;
      updatedAt: Date;
      users: UserEntity[];
    }) => {
    if (loading) {
      return;
    }
    setLoading(true);
    try {
       await taskApiClient.put<void>(`${taskId}`, {
        title: task.title,
        deadline: task.deadline,
        priority: task.priority,
        status: task.status,
      });
      setTasks((prev) =>
        prev.map((task) => ({
          ...task,
          updatedAt: new Date(),
        }))
      );
      setError(undefined);
    } catch (err: any) {
      retry(err.response?.data?.statusCode, () => updateTask(taskId, data));
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (taskId: string) => {
    if (loading) {
      return;
    }
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
        tasks: sortedTasks,
        loading,
        error,
        loadTasks,
        loadTaskById,
        createTask,
        updateTask,
        deleteTask,
        handleNextPage,
        loadCommentsByTaskId,
        createCommentByTaskId,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};
