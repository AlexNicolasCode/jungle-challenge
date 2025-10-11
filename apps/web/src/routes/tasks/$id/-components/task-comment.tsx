import React, { memo, useEffect, useState } from 'react';

import { useTasks } from '../../../../hooks';
import { CommentEntity, TaskEntity } from '../../../../shared/types';

interface TaskCommentsProps {
  task: TaskEntity,
}

const TaskCommentsComponent: React.FC<TaskCommentsProps> = ({
    task,
}) => {
    const { createCommentByTaskId, loadCommentsByTaskId } = useTasks();
    const [newComment, setNewComment] = useState<string>('');
    const [comments, setComments] = useState<CommentEntity[]>([]);
    const [commentSubmitting, setCommentSubmitting] = useState<boolean>(false);

    useEffect(() => {
        handleStarts();
    }, [task.id]);

    const handleStarts = async () => {
        if (!task || !task.id) {
            return;
        }
        const comments = await loadCommentsByTaskId(task.id);
        setComments(comments);
    }

    const handleAddComment = async () => {
        if (!newComment.trim() || !task) return;
        try {
            setCommentSubmitting(true);
            await createCommentByTaskId({ taskId: task.id, content: newComment });
            const fetchedComments = await loadCommentsByTaskId(task.id);
            setComments(fetchedComments);
            setNewComment('');
        } catch (err) {
            alert(err.message || 'Failed to add comment');
        } finally {
            setCommentSubmitting(false);
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

      {comments.length > 0 ? (
        <ul className="space-y-2 mt-4">
          {comments.map((comment) => (
            <li key={comment.id} className="border border-gray-100 rounded-lg p-3 bg-gray-50 text-gray-800">
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

export const TaskComments = memo(TaskCommentsComponent);
