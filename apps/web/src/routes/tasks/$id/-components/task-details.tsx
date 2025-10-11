import React from 'react';

import { TaskPriorityEnum, TaskStatusEnum } from '../../../../shared/enums';
import { TaskEntity } from '../../../../shared/types';

interface TaskDetailsProps {
  task: TaskEntity;
}

export const TaskDetails: React.FC<TaskDetailsProps> = ({ task }) => {

  const getStatusColor = (status: TaskStatusEnum) => {
    switch (status) {
      case TaskStatusEnum.DONE: return 'bg-green-100 text-green-800';
      case TaskStatusEnum.IN_PROGRESS: return 'bg-yellow-100 text-yellow-800';
      case TaskStatusEnum.REVIEW: return 'bg-blue-100 text-blue-800';
      case TaskStatusEnum.TODO: default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: TaskPriorityEnum) => {
    switch (priority) {
      case TaskPriorityEnum.URGENT: return 'bg-red-100 text-red-800';
      case TaskPriorityEnum.HIGH: return 'bg-orange-100 text-orange-800';
      case TaskPriorityEnum.MEDIUM: return 'bg-yellow-100 text-yellow-800';
      case TaskPriorityEnum.LOW: default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
      <div>
        <p className="font-medium">Priority</p>
        <span className={`mt-1 inline-block px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </span>
      </div>
      <div>
        <p className="font-medium">Status</p>
        <span className={`mt-1 inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
          {task.status.replace('_', ' ')}
        </span>
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

      <div className="mt-8 col-span-full">
        <p className="font-medium text-gray-800 mb-2">Assigned Users</p>
        {task.users && task.users.length > 0 ? (
          <ul className="space-y-2">
            {task.users.map((user) => (
              <li key={user.id} className="border border-gray-100 rounded-lg p-3 bg-gray-50 text-gray-800">
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
