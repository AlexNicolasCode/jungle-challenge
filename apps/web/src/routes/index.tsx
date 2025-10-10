import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useCallback, useState } from 'react';
import { useTasks } from '../hooks';
import { TaskStatusEnum } from '../shared/enums';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  const navigate = useNavigate();
  const { tasks, loading, error, loadTasks, handleNextPage } = useTasks();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    if (loading) {
      return;
    }
    loadTasks();
  }, []);

  const handleScroll = useCallback(() => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    const shouldRenderNextPage = scrollTop + clientHeight >= scrollHeight - 10 && !loading;
    if (!shouldRenderNextPage) return;
    handleNextPage();
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

  return (
    <div className="min-h-screen bg-gray-100 p-6 relative">
      {loading && <p>Loading tasks...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {tasks.length === 0 && !loading && (
        <p className="text-gray-600">No tasks available.</p>
      )}

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
              {task.description && (
                <p className="text-gray-600">{task.description}</p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`px-2 py-1 rounded text-sm ${
                  task.status
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {task.status}
              </span>

              <div className="relative">
                <button
                  onClick={() => toggleMenu(task.id)}
                  className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
                >
                  Options
                </button>

                {openMenuId === task.id && (
                  <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-md z-10">
                    <button
                      onClick={() => handleViewDetails(task.id)}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Details
                    </button>
                  </div>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HomePage;
