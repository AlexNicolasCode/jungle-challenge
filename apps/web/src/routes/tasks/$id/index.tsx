import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { BackToHome } from '@/components';
import { useTasks } from '../../../hooks';
import { TaskEntity } from '../../../shared/types';
import { TaskComments, TaskDetails } from './-components';
import { EditTaskForm, editTaskSchema } from './-schemas';

export const Route = createFileRoute('/tasks/$id/')({
  component: TaskDetailsPage,
});

export function TaskDetailsPage() {
  const { id } = useParams({ from: '/tasks/$id/' });
  const { loadTaskById, updateTask, deleteTask } = useTasks();
  const navigate = useNavigate();

  const [task, setTask] = useState<TaskEntity | undefined>();
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditTaskForm>({
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
            deadline: fetchedTask.deadline,
            description: fetchedTask.description,
            priority: fetchedTask.priority,
            status: fetchedTask.status,
        });
    } catch (err) {
        navigate({ to: '/' });
    } finally {
        setLoading(false);
    }
  };

  const submitForm = async (form: EditTaskForm) => {
    if (!task) return;
    try {
      setIsUpdating(true);
      const updatedTask = { ...task, ...form };
      await updateTask(task.id, {
        title: form.title,
        description: form.description,
        deadline: form.deadline,
        priority: form.priority,
        status: form.status,
        users: []
      });
      setTask(updatedTask);
      setIsEditMode(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteTask = async () => {
    const taskId = task?.id;
    if (!taskId) {
      return;
    }
    await deleteTask(taskId);
    navigate({ to: '/' });
  }

  const renderLoading = () => {
    return (
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
    );
  }

  const renderEditMode = () => {
    if (!task) {
        return;
    }
    return (
        <div className="bg-white rounded-2xl shadow p-6">
          <form onSubmit={handleSubmit(submitForm)}>
            <TaskDetails
              task={task}
              isEditMode={isEditMode}
              isUpdating={isUpdating}
              isSubmitting={isSubmitting}
              register={register}
              errors={errors}
              setIsEditMode={setIsEditMode}
              deleteTask={handleDeleteTask}
            />
          </form>
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
