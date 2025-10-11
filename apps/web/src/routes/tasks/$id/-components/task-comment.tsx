import React from 'react';

import { CommentEntity } from '../../../../shared/types';

interface TaskCommentsProps {
  comments: CommentEntity[];
  newComment: string;
  setNewComment: (value: string) => void;
  handleAddComment: () => void;
  commentSubmitting: boolean;
}

export const TaskComments: React.FC<TaskCommentsProps> = ({
  comments,
  newComment,
  setNewComment,
  handleAddComment,
  commentSubmitting,
}) => {
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
