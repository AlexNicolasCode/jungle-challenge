import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useCallback } from 'react';

import { useTasks } from '../hooks';
import { TaskStatusEnum } from '../shared/enums';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  const { tasks, loading, error, loadTasks, handleNextPage } = useTasks();

  useEffect(() => {
    loadTasks();
  }, []);

  const handleScroll = useCallback(() => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    const shouldRenderNextPage = scrollTop + clientHeight >= scrollHeight - 10 && !loading;
    if (!shouldRenderNextPage) {
      return;
    }
    handleNextPage();
  }, [loading, handleNextPage]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {loading && <p>Loading tasks...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {tasks.length === 0 && !loading && (
        <p className="text-gray-600">No tasks available.</p>
      )}

      <ul className="space-y-4">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="bg-white p-4 rounded shadow flex justify-between items-center"
          >
            <div>
              <h2
                className={`text-lg font-semibold ${
                  task.status === TaskStatusEnum.DONE ? 'line-through text-gray-500' : ''
                }`}
              >
                {task.title}
              </h2>
            </div>
            <span
              className={`px-2 py-1 rounded ${
                task.status
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {task.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HomePage;
