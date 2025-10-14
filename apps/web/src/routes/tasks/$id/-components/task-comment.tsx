import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React, { useEffect, useRef, useState } from 'react';
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
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [commentSubmitting, setCommentSubmitting] = useState<boolean>(false);
  const [loadingComments, setLoadingComments] = useState<boolean>(false);

  const observerRef = useRef<HTMLDivElement | null>(null);
  const commentsContainerRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    if (task?.id) {
      loadCommentsByTaskId(task.id, 1);
    }
  }, [task?.id]);

  useEffect(() => {
    if (!task?.id || !tokens?.accessToken) return;
    const socket = io('http://localhost:3000/notifications', {
      extraHeaders: { authorization: `Bearer ${tokens.accessToken}` },
    });
    socket.on(`comment:new`, addComment);
    return () => socket.close();
  }, [task?.id, tokens?.accessToken]);

  const addComment = (payload: {
      task: {
        id: string;
        title: string;
      };
      comment: CommentEntity;
    }) => {
        if (task.id !== payload.task.id) {
            return;
        }
        setComments((prev) => [payload.comment, ...prev]);
        if (commentsContainerRef.current) {
            commentsContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
  }

  const loadCommentsByTaskId = async (taskId: string, pageNumber: number) => {
    try {
      setLoadingComments(true);
      const response = await taskApiClient.get(`${taskId}/comments`, {
        params: { page: pageNumber, size: 10 },
      });
      const newComments: CommentEntity[] = response.data?.list ?? [];
      const total = response.data?.totalPages ?? 1;
      setComments((prev) =>
        pageNumber === 1 ? newComments : [...prev, ...newComments]
      );
      setTotalPages(total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingComments(false);
    }
  };

  useEffect(() => {
    if (loadingComments || page >= totalPages) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1.0 }
    );
    if (observerRef.current) observer.observe(observerRef.current);
    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [loadingComments, totalPages, page]);

  useEffect(() => {
    if (page > 1 && page <= totalPages && task?.id) {
      loadCommentsByTaskId(task.id, page);
    }
  }, [page]);

  const handleAddComment = async () => {
    if (!newComment.trim() || !task) return;
    try {
      setCommentSubmitting(true);
      await taskApiClient.post<void>(`${task.id}/comments`, { content: newComment });
      setNewComment('');
    } catch (err: any) {
      alert(err.message || 'Failed to add comment');
    } finally {
      setCommentSubmitting(false);
    }
  };

  return (
    <div className="mt-8">
      <p className="font-medium text-gray-800 mb-2">Comments</p>
      <div className="mt-4 flex gap-2">
        <Input
          type="text"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1 border border-gray-300 rounded px-3 py-2"
          disabled={commentSubmitting}
        />
        <Button
          onClick={handleAddComment}
          disabled={commentSubmitting || !newComment.trim()}
        >
          {commentSubmitting ? 'Adding...' : 'Add'}
        </Button>
      </div>
      {comments.length > 0 ? (
        <ul
          ref={commentsContainerRef}
          className="space-y-2 mt-4 overflow-y-auto max-h-[400px]"
        >
          {comments.map((comment) => (
            <li
              key={comment.id}
              className="border border-gray-100 rounded-lg p-3 bg-gray-50 text-gray-800"
            >
              <p className="text-sm text-gray-700">{comment.content}</p>
              <p className="text-xs text-gray-500 mt-1">— {comment.authorName}</p>
            </li>
          ))}
          {page < totalPages && (
            <div ref={observerRef} className="h-10 flex justify-center items-center">
              <span className="text-gray-500 text-sm">Loading more...</span>
            </div>
          )}
        </ul>
      ) : (
        <p className="text-gray-500 italic mt-4">No comments yet</p>
      )}
      {loadingComments && page === 1 && (
        <div className="mt-4 animate-pulse">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="border border-gray-100 rounded-lg p-3 bg-gray-50 mb-2">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/3" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
