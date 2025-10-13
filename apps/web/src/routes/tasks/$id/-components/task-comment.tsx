import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

import { taskApiClient } from '../../../../clients/tasks';
import { useAuth } from '../../../../hooks';
import { CommentEntity, TaskEntity } from '../../../../shared/types';

interface TaskCommentsProps {
  task: TaskEntity;
}

export const TaskComments: React.FC<TaskCommentsProps> = ({ task }) => {
  const { tokens } = useAuth();
  const [newComment, setNewComment] = useState<string>('');
  const [comments, setComments] = useState<CommentEntity[]>([]);
  const [commentsPage, setCommentPage] = useState<number>(1);
  const [commentSubmitting, setCommentSubmitting] = useState<boolean>(false);
  const [loadingComments, setLoadingComments] = useState<boolean>(false);

  useEffect(() => {
    const handleStarts = async () => {
        const hasComments = comments.length > 0;
        if (!task || !task.id || hasComments) return;
        await loadCommentsByTaskId(task.id);
        connectCommentsWebsocket();
    };
    handleStarts();
  }, []);

  const connectCommentsWebsocket = () => {
        const socket = io('http://localhost:3000/notifications', {
            extraHeaders: {
                authorization: `Bearer ${tokens?.accessToken}`,
            }
        });
        socket.on(`tasks/${task.id}/comments`, addComment);
  }

  const addComment = (comment: CommentEntity) => {
    setComments(prev => [comment, ...prev]);
  }

  const loadCommentsByTaskId = async (taskId: string) => {
    try {
      setLoadingComments(true);
      const response = await taskApiClient.get(`${taskId}/comments`, {
        params: { page: commentsPage, size: 10 },
      });
      const updatedComments: CommentEntity[] = response.data?.list ?? [];
      const totalPages: number = response.data?.totalPagess ?? 1;
      setComments(updatedComments);
      setCommentPage(totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !task) return;
    try {
      setCommentSubmitting(true);
      await createCommentByTaskId({ taskId: task.id, content: newComment });
      setNewComment('');
    } catch (err) {
      alert(err.message || 'Failed to add comment');
    } finally {
      setCommentSubmitting(false);
    }
  };

  const createCommentByTaskId = async ({
    taskId,
    content,
  }: {
    taskId: string;
    content: string;
  }) => {
    try {
      await taskApiClient.post<void>(`${taskId}/comments`, { content });
    } catch (err) {
      console.error(err);
    }
  };

  return (
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

      {loadingComments ? (
        <ul className="space-y-2 mt-4 animate-pulse">
          {Array.from({ length: 3 }).map((_, idx) => (
            <li
              key={idx}
              className="border border-gray-100 rounded-lg p-3 bg-gray-50"
            >
              <div className="h-4 bg-gray-200 rounded w-3/4 shimmer mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/3 shimmer" />
            </li>
          ))}
        </ul>
      ) : comments.length > 0 ? (
        <ul className="space-y-2 mt-4">
          {comments.map((comment) => (
            <li
              key={comment.id}
              className="border border-gray-100 rounded-lg p-3 bg-gray-50 text-gray-800"
            >
              <p className="text-sm text-gray-700">{comment.content}</p>
              <p className="text-xs text-gray-500 mt-1">— {comment.authorName}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 italic mt-4">No comments yet</p>
      )}
    </div>
  );
};
