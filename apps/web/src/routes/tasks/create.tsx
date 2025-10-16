import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { BackToHome } from '@/components';
import { Input } from '@/components/ui/input';
import { useTasks, useUser } from '../../hooks';
import { TaskPriorityEnum, TaskStatusEnum } from '../../shared/enums';

export const Route = createFileRoute('/tasks/create')({
  component: CreateTaskPage,
});

const createTaskSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  priority: z.nativeEnum(TaskPriorityEnum),
  status: z.nativeEnum(TaskStatusEnum),
  deadline: z.string().optional(),
  responsibles: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    }),
  ),
});

type CreateTaskForm = z.infer<typeof createTaskSchema>;

function CreateTaskPage() {
  const { loadUsers, users, loading: userLoading, handleNextPage } = useUser();
  const { loading, createTask } = useTasks();
  const navigate = useNavigate();
  const scrollRef = useRef<number>(0);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateTaskForm>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: '',
      priority: TaskPriorityEnum.LOW,
      status: TaskStatusEnum.TODO,
      deadline: '',
      responsibles: [],
    },
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const onSubmit = async (task: CreateTaskForm) => {
    try {
      const deadline = task.deadline
        ? new Date(task.deadline).toISOString()
        : new Date().toISOString();
      await createTask({
        title: task.title,
        priority: task.priority,
        status: task.status,
        deadline,
        users: task.responsibles,
      });
      navigate({ to: '/' });
    } catch (err: any) {
      alert(err.message || 'Failed to create task');
    }
  };

  const renderLoading = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-pulse">
      <div className="col-span-2">
        <div className="h-5 w-20 bg-gray-200 rounded shimmer mb-2"></div>
        <div className="h-10 w-full rounded shimmer"></div>
      </div>
      <div>
        <div className="h-5 w-24 bg-gray-200 rounded shimmer mb-2"></div>
        <div className="h-10 w-full rounded shimmer"></div>
      </div>
      <div>
        <div className="h-5 w-24 bg-gray-200 rounded shimmer mb-2"></div>
        <div className="h-10 w-full rounded shimmer"></div>
      </div>
      <div className="col-span-2">
        <div className="h-5 w-24 bg-gray-200 rounded shimmer mb-2"></div>
        <div className="h-10 w-full rounded shimmer"></div>
      </div>
      <div className="col-span-2">
        <div className="h-10 w-full rounded-xl shimmer"></div>
      </div>
    </div>
  );

  const renderUserMultiSelect = () => {
    if (userLoading) {
      return (
        <div>
          <div className="h-5 w-24 bg-gray-200 rounded shimmer mb-2"></div>
          <div className="h-10 w-full rounded shimmer"></div>
        </div>
      );
    }

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        scrollRef.current = scrollTop;
        if (scrollTop + clientHeight >= scrollHeight - 20) {
            handleNextPage();
        }
    };

    return (
      <div className="col-span-2">
        <label className="font-medium text-gray-700 mb-2 block">
          Responsible Users
        </label>
        <Controller
          name="responsibles"
          control={control}
          render={({ field }) => (
            <div
                className="flex flex-col gap-2 border rounded-lg p-3 bg-white max-h-48 overflow-y-auto"
                onScroll={handleScroll}
            >
              {users.map((user) => {
                const isChecked = field.value.some((u) => u.id === user.id);
                return (
                  <label
                    key={user.id}
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        if (e.target.checked) {
                          field.onChange([...field.value, user]);
                        } else {
                          field.onChange(
                            field.value.filter((u) => u.id !== user.id)
                          );
                        }
                      }}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-800">{user.name}</span>
                  </label>
                );
              })}
            </div>
          )}
        />
        {errors.responsibles && (
          <p className="text-red-500 text-sm mt-1">
            {errors.responsibles.message}
          </p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Select one or more users responsible for this task.
        </p>
      </div>
    );
  };

  const renderPage = () => (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
    >
      <div className="col-span-2">
        <label className="font-medium text-gray-700">Title</label>
        <Input {...register('title')} type="text" />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
        )}
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
        <Input {...register('deadline')} type="datetime-local" />
      </div>

      {renderUserMultiSelect()}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 col-span-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-xl"
      >
        {isSubmitting ? 'Creating...' : 'Create Task'}
      </button>
    </form>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <BackToHome />
      {loading ? renderLoading() : renderPage()}
    </div>
  );
}

export default CreateTaskPage;
