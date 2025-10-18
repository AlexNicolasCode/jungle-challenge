import React, { useCallback, useState } from 'react';

import { taskApiClient } from '../../clients/tasks';
import { TaskPriorityEnum, TaskStatusEnum } from '../../shared/enums';
import { CommentEntity, FilterProps, TaskEntity, UserEntity } from '../../shared/types';
import { TasksContext } from './task.context';
import { TaskProviderProps } from './task.types';

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [page, setPage] = useState<number>(1);
  const [maxPage, setMaxPage] = useState<number>(1);
  const [commentsPage, setCommentPage] = useState<number>(1);
  const [tasks, setTasks] = useState<TaskEntity[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState<FilterProps>({});
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

  const loadTasks = useCallback(async (newQuery: FilterProps) => {
    if (loading) {
      return;
    }
    setLoading(true);
    try {
        updateWindowUrlParams(newQuery);
        if (newQuery.search && newQuery.search.length < 3) {
            return
        }
        const pageParam = newQuery == query ? page : 1;
        const response = await taskApiClient.get('', {
            params: {
            page: pageParam,
            size: 10,
            priority: newQuery.priority?.toString() === 'ALL' ? undefined : newQuery.priority,
            status: newQuery.status?.toString() === 'ALL' ?  undefined : newQuery.status,
            search: newQuery.search,
            },
        });
        const tasks: TaskEntity[] = response.data?.list ?? [];
        const totalPages: number = response.data?.totalPagess ?? 1;
        setQuery(query);
        setMaxPage(totalPages);
        setTasks(tasks);
        setError(undefined);
    } catch (error) {
        console.log(error);
    } finally {
        setLoading(false);
    }
  }, [page]);

  const updateWindowUrlParams = (newQuery: Record<string, string>) => {
        const url = new URL(window.location.href);
        const keys = Object.keys(newQuery);
        for (const key of keys) {
            const value = newQuery[key];
            if (!value || value === '') {

                url.searchParams.delete(key, value);
                continue;
            }
            url.searchParams.set(key, value);
        }
        window.history.pushState({}, '', url.toString());
  }

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

  const loadTaskById = async (taskId: string): Promise<TaskEntity | void> => {
    if (loading) {
      return;
    }
    setLoading(true);
    try {
        const response = await taskApiClient.get<TaskEntity>(`${taskId}`);
        setError(undefined);
        return response.data;
    } catch (err) {
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
    } catch (err) {
        console.error(err);
    } finally {
      setLoading(false);
      return []
    }
  };

  const createTask = async (task: {
      title: string;
      description?: string;
      deadline: string;
      priority: TaskPriorityEnum;
      status: TaskStatusEnum;
      users: UserEntity[];
    }) => {
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      await taskApiClient.post<TaskEntity>('', {
        title: task.title,
        deadline: task.deadline,
        description: task.description,
        priority: task.priority,
        status: task.status,
        users: task.users,
      });
      setPage(1);
      await loadTasks({});
      setError(undefined);
    } catch (err) {
        console.error(error);
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
    } catch (err) {
    }
  };

  const updateTask = async (taskId: string, task: {
      title: string;
      description?: string;
      deadline: string;
      priority: TaskPriorityEnum;
      status: TaskStatusEnum;
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
    } catch (err) {
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
    } catch (err) {
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
