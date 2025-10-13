import { Button } from '@/components/ui/button';
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { useCallback, useEffect, useState } from 'react';
import { useLoading, useTasks } from '../hooks';
import { TaskPriorityEnum, TaskStatusEnum } from '../shared/enums';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  const query: {
    status?: TaskStatusEnum;
    priority?: TaskPriorityEnum;
    search?: string;
  } = useSearch({ from: '/' });
  const navigate = useNavigate();
  const { loading } = useLoading();
  const { tasks, error, loadTasks, handleNextPage } = useTasks();
  const [openMenuId, setOpenMenuId] = useState<string | undefined>();
  const [filters, setFilters] = useState<{
    status?: TaskStatusEnum;
    priority?: TaskPriorityEnum;
    search?: string;
  }>({
    status: query?.status,
    priority: query?.priority,
    search: query?.search,
  });

  useEffect(() => {
    const handler = setTimeout(() => {
    if (!loading) loadTasks(filters);
    }, 1000);
    return () => clearTimeout(handler);
  }, [filters]);

  const handleScroll = useCallback(() => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    const shouldRenderNextPage = scrollTop + clientHeight >= scrollHeight - 10 && !loading;
    if (shouldRenderNextPage) handleNextPage();
  }, [loading, handleNextPage]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const toggleMenu = (taskId: string) => {
    setOpenMenuId((prev) => (prev === taskId ? null : taskId));
  };

  const handleViewDetails = (taskId: string) => {
    navigate({ to: `/tasks/${taskId}` });
  };

  const handleFilterChange = (key: 'status' | 'priority' | 'search', value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === '' ? undefined : (value as any),
    }));
  };

  const getStatusColor = (status: TaskStatusEnum) => {
    switch (status) {
      case TaskStatusEnum.TODO:
        return 'bg-gray-100 text-gray-800';
      case TaskStatusEnum.IN_PROGRESS:
        return 'bg-blue-100 text-blue-800';
      case TaskStatusEnum.REVIEW:
        return 'bg-yellow-100 text-yellow-800';
      case TaskStatusEnum.DONE:
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 relative">
      <div className="flex flex-wrap gap-4 mb-6 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium mb-1">Search</label>
          <input
            type="text"
            placeholder="Search tasks..."
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={filters.search ?? ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            className="border border-gray-300 rounded px-3 py-2"
            value={filters.status ?? ''}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">All</option>
            {Object.values(TaskStatusEnum).map((status) => (
              <option key={status} value={status}>
                {status.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Priority</label>
          <select
            className="border border-gray-300 rounded px-3 py-2"
            value={filters.priority ?? ''}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
          >
            <option value="">All</option>
            {Object.values(TaskPriorityEnum).map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <p className="text-red-500">Error: {error}</p>}

      {loading && (
        <ul className="space-y-4 animate-pulse">
          {Array.from({ length: 5 }).map((_, idx) => (
            <li
              key={idx}
              className="bg-white p-4 rounded shadow flex justify-between items-center"
            >
              <div className="flex-1">
                <div className="h-5 bg-gray-200 rounded w-1/2 mb-2 shimmer" />
                <div className="h-4 bg-gray-200 rounded w-3/4 shimmer" />
              </div>
              <div className="h-6 w-20 bg-gray-200 rounded shimmer" />
            </li>
          ))}
        </ul>
      )}

      {!loading && tasks.length === 0 && <p className="text-gray-600">No tasks available.</p>}

      {!loading && (
        <ul className="space-y-4">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="relative bg-white p-4 rounded shadow flex justify-between items-center"
            >
              <div>
                <h2
                  className={`text-lg font-semibold ${
                    task.status === TaskStatusEnum.DONE ? 'line-through text-gray-500' : ''
                  }`}
                >
                  {task.title}
                </h2>
                {task.description && <p className="text-gray-600">{task.description}</p>}
              </div>

              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded text-sm ${getStatusColor(task.status)}`}>
                  {task.status.replace('_', ' ')}
                </span>

                <div className="relative">
                  <Button
                    onClick={() => handleViewDetails(task.id)}
                    className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
                  >
                    Details
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default HomePage;
