import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';

import { BackToHome } from '@/components';
import { useTasks } from '../../../hooks';
import { TaskPriorityEnum, TaskStatusEnum } from '../../../shared/enums';
import { TaskEntity } from '../../../shared/types';
import { TaskComments, TaskDetails, TaskEditMode } from './-components';

const editTaskSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  priority: z.enum(TaskPriorityEnum),
  status: z.enum(TaskStatusEnum),
});
type EditTaskForm = z.infer<typeof editTaskSchema>;

export const Route = createFileRoute('/tasks/$id/')({
  component: TaskDetailsPage,
});

export function TaskDetailsPage() {
  const { id } = useParams({ from: '/tasks/$id/' });
  const { loadTaskById, updateTask } = useTasks();
  const navigate = useNavigate();

  const [task, setTask] = useState<TaskEntity | undefined>();
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [updating, setUpdating] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(editTaskSchema),
  });

  useEffect(() => {
    fetchTask();
    }, [id]);

    const fetchTask = async () => {
        try {
            const fetchedTask = await loadTaskById(id);
            if (!fetchedTask) {
                navigate({ to: '/' });
                return;
            }
            setTask(fetchedTask);
            reset({
                title: fetchedTask.title,
                priority: fetchedTask.priority,
                status: fetchedTask.status,
            });
        } catch (err) {
            navigate({ to: '/' });
        } finally {
            setLoading(false);
        }
    };

  const onSubmit = async (data: EditTaskForm) => {
    if (!task) return;
    try {
      setUpdating(true);
      const updatedTask = { ...task, ...data };
      await updateTask(task.id, {
        title: data.title,
        deadline: task.deadline,
        priority: data.priority,
        status: data.status,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
        users: [],
      });
      setTask(updatedTask);
      setIsEditMode(false);
    } catch (err) {
      alert(err.message || 'Failed to update task');
    } finally {
      setUpdating(false);
    }
  };

  const renderLoading = () => {
    return (
        <div className="min-h-screen bg-gray-100 p-6 animate-pulse">
        <BackToHome />
        <div className="bg-white rounded-2xl shadow p-6">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            </div>
            <div className="h-6 bg-gray-200 rounded w-1/4 mt-8 mb-4"></div>
            <div className="space-y-3">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            </div>
        </div>
        </div>
    );
  }

  const renderEditMode = () => {
    if (!task) {
        return;
    }
    return (
        <div className="bg-white rounded-2xl shadow p-6">
            <TaskEditMode
                isEditMode={isEditMode}
                updating={updating}
                register={register}
                handleSubmit={handleSubmit}
                onSubmit={onSubmit}
                errors={errors}
                isSubmitting={isSubmitting}
                taskTitle={task.title}
                setIsEditMode={setIsEditMode}
            />
            <TaskDetails task={task} />
            <TaskComments task={task} />
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
        <BackToHome />
        {loading ? renderLoading() : renderEditMode()}
    </div>
  );
}

export default TaskDetailsPage;
