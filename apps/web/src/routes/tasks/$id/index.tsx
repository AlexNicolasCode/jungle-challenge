import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';

import { useLoading, useTasks } from '../../../hooks';
import { TaskPriorityEnum, TaskStatusEnum } from '../../../shared/enums';
import { CommentEntity, TaskEntity } from '../../../shared/types';
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
  const { loading: globalLoading, renderLoading } = useLoading();
  const { loadTaskById, updateTask, loadCommentsByTaskId, createCommentByTaskId } = useTasks();
  const navigate = useNavigate();

  const [task, setTask] = useState<TaskEntity | undefined>();
  const [comments, setComments] = useState<CommentEntity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [isEditMode, setIsEditMode] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(editTaskSchema),
  });

  useEffect(() => {
    const fetchTask = async () => {
      if (loading) return;
      try {
        setLoading(true);
        const fetchedTask = await loadTaskById(id);
        if (!fetchedTask) {
          navigate({ to: '/' });
          return;
        }
        const fetchedComments = await loadCommentsByTaskId(id);
        setTask(fetchedTask);
        setComments(fetchedComments || []);
        reset({
          title: fetchedTask.title,
          priority: fetchedTask.priority,
          status: fetchedTask.status,
        });
      } catch (err) {
        setError(err.message || 'Failed to load task');
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id]);

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

  const handleAddComment = async () => {
    if (!newComment.trim() || !task) return;
    try {
      setCommentSubmitting(true);
      await createCommentByTaskId({ taskId: task.id, content: newComment });
      const fetchedComments = await loadCommentsByTaskId(id);
      setComments(fetchedComments);
      setNewComment('');
    } catch (err) {
      alert(err.message || 'Failed to add comment');
    } finally {
      setCommentSubmitting(false);
    }
  };

  if (loading || globalLoading) return renderLoading('Loading task details...');
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;
  if (!task) return <div className="p-6 text-gray-600">Task not found.</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <button onClick={() => navigate({ to: '/' })} className="mb-4 inline-flex items-center gap-2 text-sm text-gray-700 hover:text-black">
        ← Back to Tasks
      </button>

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

        <TaskComments
          comments={comments}
          newComment={newComment}
          setNewComment={setNewComment}
          handleAddComment={handleAddComment}
          commentSubmitting={commentSubmitting}
        />
      </div>
    </div>
  );
}

export default TaskDetailsPage;
