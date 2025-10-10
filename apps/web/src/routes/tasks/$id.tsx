import { createFileRoute, useParams, useNavigate } from '@tanstack/react-router';
import { useEffect, useState, useRef } from 'react';

import { useTasks } from '../../hooks';
import { TaskEntity } from '../../shared/types';
import { TaskStatusEnum, TaskPriorityEnum } from '../../shared/enums';

export const Route = createFileRoute('/tasks/$id')({
  component: TaskDetailsPage,
});

function TaskDetailsPage() {
  const { id } = useParams({ from: '/tasks/$id' });
  const { loadTaskById, updateTask } = useTasks();
  const navigate = useNavigate();

  const [task, setTask] = useState<TaskEntity | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchTask = async () => {
      if (loading) return;
      try {
        setLoading(true);
        const fetched = await loadTaskById(id);
        if (!fetched) {
          alert('Task not found');
          return;
        }
        setTask(fetched);
      } catch (err: any) {
        setError(err.message || 'Failed to load task');
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  const handleStatusChange = async (newStatus: TaskStatusEnum) => {
    if (!task) return;
    try {
      setUpdating(true);
      await updateTask(task.id, {
        title: task.title,
        deadline: task.deadline,
        priority: task.priority,
        status: newStatus,
      });
      setTask({ ...task, status: newStatus });
    } catch {
      alert('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const handlePriorityChange = async (newPriority: TaskPriorityEnum) => {
    if (!task) return;
    try {
      setUpdating(true);
      await updateTask(task.id, {
        title: task.title,
        deadline: task.deadline,
        priority: newPriority,
        status: task.status,
      });
      setTask({ ...task, priority: newPriority });
    } catch {
      alert('Failed to update priority');
    } finally {
      setUpdating(false);
    }
  };

  const handleTitleUpdate = async () => {
    if (!task || !titleInputRef.current?.value.trim()) return;
    const newTitle = titleInputRef.current.value;
    try {
      setUpdating(true);
      await updateTask(task.id, {
        title: newTitle,
        deadline: task.deadline,
        priority: task.priority,
        status: task.status,
      });
      setTask({ ...task, title: newTitle });
      setIsEditMode(false);
    } catch {
      alert('Failed to update title');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="p-6 text-gray-600 animate-pulse">Loading task details...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;
  if (!task) return <div className="p-6 text-gray-600">Task not found.</div>;

  const getStatusColor = (status: TaskStatusEnum) => {
    switch (status) {
      case TaskStatusEnum.DONE:
        return 'bg-green-100 text-green-800';
      case TaskStatusEnum.IN_PROGRESS:
        return 'bg-yellow-100 text-yellow-800';
      case TaskStatusEnum.REVIEW:
        return 'bg-blue-100 text-blue-800';
      case TaskStatusEnum.TODO:
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <button
        onClick={() => navigate({ to: '/' })}
        className="mb-4 inline-flex items-center gap-2 text-sm text-gray-700 hover:text-black"
      >
        ← Back to Tasks
      </button>

      <div className="bg-white rounded-2xl shadow p-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            {isEditMode ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  defaultValue={task.title}
                  ref={titleInputRef}
                  className="border border-gray-300 rounded px-2 py-1 text-lg font-medium"
                  disabled={!isEditMode}
                />
                <button
                  onClick={handleTitleUpdate}
                  disabled={updating}
                  className="text-green-600 hover:text-green-800 text-sm font-medium"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditMode(false)}
                  className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <h1 className="text-2xl font-semibold text-gray-900">{task.title}</h1>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}
            >
              {task.status.replace('_', ' ')}
            </span>
            <button
              onClick={() => setIsEditMode((prev) => !prev)}
              className="text-gray-500 hover:text-gray-700 text-sm font-medium"
            >
              {isEditMode ? 'Disable Edit' : 'Enable Edit'}
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
          <div>
            <p className="font-medium">Priority</p>
            <select
              value={task.priority}
              onChange={(e) => handlePriorityChange(e.target.value as TaskPriorityEnum)}
              disabled={!isEditMode || updating}
              className="mt-1 border border-gray-300 rounded px-3 py-2 w-full bg-white"
            >
              {Object.values(TaskPriorityEnum).map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </div>

          <div>
            <p className="font-medium">Status</p>
            <select
              value={task.status}
              onChange={(e) => handleStatusChange(e.target.value as TaskStatusEnum)}
              disabled={!isEditMode || updating}
              className="mt-1 border border-gray-300 rounded px-3 py-2 w-full bg-white"
            >
              {Object.values(TaskStatusEnum).map((status) => (
                <option key={status} value={status}>
                  {status.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <p className="font-medium">Deadline</p>
            <p className="text-gray-600">{new Date(task.deadline).toLocaleString()}</p>
          </div>
          <div>
            <p className="font-medium">Created At</p>
            <p className="text-gray-600">{new Date(task.createdAt).toLocaleString()}</p>
          </div>
          <div>
            <p className="font-medium">Last Update</p>
            <p className="text-gray-600">{new Date(task.updatedAt).toLocaleString()}</p>
          </div>
        </div>

        <div className="mt-8">
          <p className="font-medium text-gray-800 mb-2">Assigned Users</p>
          {task.users && task.users.length > 0 ? (
            <ul className="space-y-2">
              {task.users.map((user) => (
                <li
                  key={user.id}
                  className="border border-gray-100 rounded-lg p-3 bg-gray-50 text-gray-800"
                >
                  {user.name}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No users assigned</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskDetailsPage;
