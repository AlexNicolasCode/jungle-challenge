import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useLoading, useTasks } from '../../../hooks';
import { TaskPriorityEnum, TaskStatusEnum } from '../../../shared/enums';
import { CommentEntity, TaskEntity } from '../../../shared/types';

export const Route = createFileRoute('/tasks/$id/')({
  component: TaskDetailsPage,
});

const editTaskSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  priority: z.enum(TaskPriorityEnum),
  status: z.enum(TaskStatusEnum),
});

type EditTaskForm = z.infer<typeof editTaskSchema>;

function TaskDetailsPage() {
  const { id } = useParams({ from: '/tasks/$id/' });
  const { loading: globalLoading, renderLoading } = useLoading();
  const { loadTaskById, updateTask, loadCommentsByTaskId, createCommentByTaskId } = useTasks();
  const navigate = useNavigate();

  const [task, setTask] = useState<TaskEntity | null>(null);
  const [comments, setComments] = useState<CommentEntity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [newComment, setNewComment] = useState<string>('');
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditTaskForm>({
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
      } catch (err: any) {
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
    } catch (err: any) {
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
    } catch (err: any) {
      alert(err.message || 'Failed to add comment');
    } finally {
      setCommentSubmitting(false);
    }
  };

  if (loading || globalLoading) return renderLoading('Loading task details...');
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

  const getPriorityColor = (priority: TaskPriorityEnum) => {
    switch (priority) {
      case TaskPriorityEnum.URGENT:
        return 'bg-red-100 text-red-800';
      case TaskPriorityEnum.HIGH:
        return 'bg-orange-100 text-orange-800';
      case TaskPriorityEnum.MEDIUM:
        return 'bg-yellow-100 text-yellow-800';
      case TaskPriorityEnum.LOW:
      default:
        return 'bg-gray-100 text-gray-700';
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

      <div className="bg-white rounded-2xl shadow p-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              {isEditMode ? (
                <input
                  type="text"
                  {...register('title')}
                  className={`border rounded px-2 py-1 text-lg font-medium ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={updating}
                />
              ) : (
                <h1 className="text-2xl font-semibold text-gray-900">{task.title}</h1>
              )}
            </div>

            <div className="flex items-center gap-3">
              {isEditMode ? (
                <>
                  <select
                    {...register('status')}
                    disabled={updating}
                    className="border border-gray-300 rounded px-2 py-1"
                  >
                    {Object.values(TaskStatusEnum).map((status) => (
                      <option key={status} value={status}>
                        {status.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    disabled={isSubmitting || updating}
                    className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                  >
                    Save
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditMode(true)}
                  className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                >
                  Edit
                </button>
              )}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
            <div>
              <p className="font-medium">Priority</p>
              {isEditMode ? (
                <select
                  {...register('priority')}
                  disabled={updating}
                  className="mt-1 border border-gray-300 rounded px-3 py-2 w-full bg-white"
                >
                  {Object.values(TaskPriorityEnum).map((priority) => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </select>
              ) : (
                <span
                  className={`mt-1 inline-block px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(
                    task.priority
                  )}`}
                >
                  {task.priority}
                </span>
              )}
            </div>

            <div>
              <p className="font-medium">Status</p>
              {!isEditMode && (
                <span
                  className={`mt-1 inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    task.status
                  )}`}
                >
                  {task.status.replace('_', ' ')}
                </span>
              )}
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
        </form>

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

        <div className="mt-8">
          <p className="font-medium text-gray-800 mb-2">Comments</p>

            <div className="mt-4 flex gap-2">
            <input
              type="text"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 border border-gray-300 rounded px-3 py-2"
              disabled={commentSubmitting}
            />
            <button
              onClick={handleAddComment}
              disabled={commentSubmitting || !newComment.trim()}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {commentSubmitting ? 'Adding...' : 'Add'}
            </button>
          </div>

          {comments.length > 0 ? (
            <ul className="space-y-2">
              {comments.map((comment) => (
                <li
                  key={comment.id}
                  className="border border-gray-100 rounded-lg p-3 bg-gray-50 text-gray-800"
                >
                  <p className="text-sm text-gray-700">{comment.content}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    — {comment.authorName}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No comments yet</p>
          )}
        </div>
      </div>
    </div>
  );

  return loading ? renderLoading('Editing Task') : renderPage();
}

export default TaskDetailsPage;
