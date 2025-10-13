import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useLoading, useTasks } from '../../hooks';
import { TaskPriorityEnum, TaskStatusEnum } from '../../shared/enums';

export const Route = createFileRoute('/tasks/create')({
  component: CreateTaskPage,
});

const createTaskSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  priority: z.enum(TaskPriorityEnum),
  status: z.enum(TaskStatusEnum),
  deadline: z.string().optional(),
});

type CreateTaskForm = z.infer<typeof createTaskSchema>;

function CreateTaskPage() {
  const { loading, renderLoading } = useLoading();
  const { createTask, loadTasks } = useTasks();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateTaskForm>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: '',
      priority: TaskPriorityEnum.LOW,
      status: TaskStatusEnum.TODO,
      deadline: '',
    },
  });

  const onSubmit = async (data: CreateTaskForm) => {
    try {
      await createTask({
          title: data.title,
          priority: data.priority,
          status: data.status,
          deadline: data.deadline
              ? new Date(data.deadline).toISOString()
              : new Date().toISOString(),
          users: [],
      });
      navigate({ to: '/' });
    } catch (err: any) {
      alert(err.message || 'Failed to create task');
    }
  };

  const renderPage = () => (
    <div className="min-h-screen bg-gray-100 p-6">
      <button
        onClick={() => navigate({ to: '/' })}
        className="mb-4 inline-flex items-center gap-2 text-sm text-gray-700 hover:text-black"
      >
        ← Back to Tasks
      </button>

      <div className="bg-white rounded-2xl shadow p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">Create New Task</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="font-medium text-gray-700">Title</label>
            <input
              {...register('title')}
              type="text"
              className={`mt-1 border rounded px-3 py-2 w-full ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="font-medium text-gray-700">Priority</label>
            <select
              {...register('priority')}
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
              {...register('status')}
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
              {...register('deadline')}
              type="datetime-local"
              className="mt-1 border border-gray-300 rounded px-3 py-2 w-full"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 col-span-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-xl"
          >
            {isSubmitting ? 'Creating...' : 'Create Task'}
          </button>
        </form>
      </div>
    </div>
  );

  return loading ? renderLoading('Creating task...') : renderPage();
}

export default CreateTaskPage;
