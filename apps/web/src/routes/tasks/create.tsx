import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useRef } from 'react';

import { useTasks } from '../../hooks';
import { TaskPriorityEnum, TaskStatusEnum } from '../../shared/enums';
import { TaskEntity } from '../../shared/types';

export const Route = createFileRoute('/tasks/create')({
  component: CreateTaskPage,
});

function CreateTaskPage() {
  const { createTask } = useTasks();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<TaskPriorityEnum>(TaskPriorityEnum.LOW);
  const [status, setStatus] = useState<TaskStatusEnum>(TaskStatusEnum.TODO);
  const [deadline, setDeadline] = useState('');
  const [loading, setLoading] = useState(false);

  const titleInputRef = useRef<HTMLInputElement>(null);

  const handleCreate = async () => {
    if (!title.trim()) return alert('Title is required');
    try {
      setLoading(true);
      const newTask = {
        title,
        priority,
        status,
        deadline: deadline ? new Date(deadline).toISOString() : new Date().toISOString(),
        users: [],
      };
      await createTask(newTask);
      navigate({ to: '/' });
    } catch (err: any) {
      alert(err.message || 'Failed to create task');
    } finally {
      setLoading(false);
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

      <div className="bg-white rounded-2xl shadow p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">Create New Task</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="font-medium text-gray-700">Title</label>
            <input
              ref={titleInputRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 border border-gray-300 rounded px-3 py-2 w-full"
            />
          </div>

          <div>
            <label className="font-medium text-gray-700">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriorityEnum)}
              className="mt-1 border border-gray-300 rounded px-3 py-2 w-full"
            >
              {Object.values(TaskPriorityEnum).map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-medium text-gray-700">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatusEnum)}
              className="mt-1 border border-gray-300 rounded px-3 py-2 w-full"
            >
              {Object.values(TaskStatusEnum).map((s) => (
                <option key={s} value={s}>
                  {s.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-2">
            <label className="font-medium text-gray-700">Deadline</label>
            <input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="mt-1 border border-gray-300 rounded px-3 py-2 w-full"
            />
          </div>
        </div>

        <button
          onClick={handleCreate}
          disabled={loading}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-xl"
        >
          {loading ? 'Creating...' : 'Create Task'}
        </button>
      </div>
    </div>
  );
}

export default CreateTaskPage;
