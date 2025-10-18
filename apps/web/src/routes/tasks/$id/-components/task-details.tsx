import React from 'react';
import { TaskPriorityEnum, TaskStatusEnum } from '../../../../shared/enums';
import { TaskEntity } from '../../../../shared/types';

interface TaskDetailsProps {
  task: TaskEntity;
}

export const TaskDetails: React.FC<TaskDetailsProps> = ({ task }) => {
  const statusColors: Record<TaskStatusEnum, string> = {
    [TaskStatusEnum.DONE]: 'bg-green-100 text-green-800',
    [TaskStatusEnum.IN_PROGRESS]: 'bg-yellow-100 text-yellow-800',
    [TaskStatusEnum.REVIEW]: 'bg-blue-100 text-blue-800',
    [TaskStatusEnum.TODO]: 'bg-gray-100 text-gray-700',
  };

  const priorityColors: Record<TaskPriorityEnum, string> = {
    [TaskPriorityEnum.URGENT]: 'bg-red-100 text-red-800',
    [TaskPriorityEnum.HIGH]: 'bg-orange-100 text-orange-800',
    [TaskPriorityEnum.MEDIUM]: 'bg-yellow-100 text-yellow-800',
    [TaskPriorityEnum.LOW]: 'bg-gray-100 text-gray-700',
  };

  const getStatusColor = (status: TaskStatusEnum) =>
    statusColors[status] ?? 'bg-gray-100 text-gray-700';

  const getPriorityColor = (priority: TaskPriorityEnum) =>
    priorityColors[priority] ?? 'bg-gray-100 text-gray-700';


  if (!task) {
    return (
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-pulse">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div key={idx}>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2 shimmer" />
            <div className="h-5 bg-gray-200 rounded w-1/2 shimmer" />
          </div>
        ))}
        <div className="mt-8 col-span-full">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-3 shimmer" />
          {Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="border border-gray-100 rounded-lg p-3 bg-gray-50 mb-2 shimmer"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
      <div>
        <p className="font-medium">Priority</p>
        <span
          className={`mt-1 inline-block px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(
            task.priority
          )}`}
        >
          {task.priority}
        </span>
      </div>
      <div>
        <p className="font-medium">Status</p>
        <span
          className={`mt-1 inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
            task.status
          )}`}
        >
          {task.status.replace('_', ' ')}
        </span>
      </div>
      <div>
        <p className="font-medium">Deadline</p>
        <p className="text-gray-600">
          {new Date(task.deadline).toLocaleString()}
        </p>
      </div>
      <div>
        <p className="font-medium">Created At</p>
        <p className="text-gray-600">
          {new Date(task.createdAt).toLocaleString()}
        </p>
      </div>
      <div>
        <p className="font-medium">Last Update</p>
        <p className="text-gray-600">
          {new Date(task.updatedAt).toLocaleString()}
        </p>
      </div>

      <div className="mt-8 col-span-full">
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
    </div>
  );
};
