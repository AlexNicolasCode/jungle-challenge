import React from 'react';
import { FieldErrors, UseFormRegister } from 'react-hook-form';

import { TaskEntity } from '@/shared/types';
import { TaskPriorityEnum, TaskStatusEnum } from '@/shared/enums';
import { EditTaskForm } from '../-schemas';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type TaskDetailsProps = {
  task: TaskEntity;
  isEditMode: boolean;
  isSubmitting: boolean;
  register: UseFormRegister<EditTaskForm>;
  isUpdating: boolean;
  errors: FieldErrors<EditTaskForm>;
  setIsEditMode: (value: boolean) => void;
  deleteTask: () => void;
};

export const TaskDetails: React.FC<TaskDetailsProps> = ({
  task,
  isEditMode,
  isSubmitting,
  isUpdating,
  register,
  deleteTask,
  errors,
  setIsEditMode,
}) => {
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
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          {isEditMode ? (
            <Input
              type="text"
              {...register('title')}
              className={`border rounded px-2 py-1 text-lg font-medium ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isUpdating}
            />
          ) : (
            <h1 className="text-2xl font-semibold text-gray-900">{task.title}</h1>
          )}
        </div>

        <div className="flex items-center gap-3">
          {isEditMode ? (
            <button
              type="submit"
              disabled={isSubmitting || isUpdating}
            >
              Save
            </button>
          ) : (
            <>
              <Button
                onClick={() => setIsEditMode(true)}
              >
                Edit
              </Button>
              <Button
                onClick={() => deleteTask()}
              >
                Delete
              </Button>
            </>
          )}
        </div>
      </div>
      
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
        <div>
          <p className="font-medium">Priority</p>
          {isEditMode ? (
            <select
              defaultValue={task.priority}
              {...register('priority')}
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-1 text-sm"
            >
              {Object.values(TaskPriorityEnum).map((p) => (
                <option key={p} value={p}>
                  {p}
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
          {isEditMode ? (
            <select
              defaultValue={task.status}
              {...register('status')}
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-1 text-sm"
            >
              {Object.values(TaskStatusEnum).map((s) => (
                <option key={s} value={s}>
                  {s.replace('_', ' ')}
                </option>
              ))}
            </select>
          ) : (
            <span
              className={`mt-1 inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                task.status
              )}`}
            >
              {task.status.replace('_', ' ')}
            </span>
          )}
        </div>

        <div className="col-span-full">
          <p className="font-medium">Description</p>
          {isEditMode ? (
            <textarea
              defaultValue={task.description}
              {...register('description')}
              className="mt-1 w-full border border-gray-300 rounded-md p-2 text-sm"
              rows={3}
            />
          ) : (
            <p className="text-gray-600">{task.description}</p>
          )}
        </div>

        <div>
          <p className="font-medium">Deadline</p>
          {isEditMode ? (
            <Input
              type="datetime-local"
              defaultValue={new Date(task.deadline).toLocaleString()}
              {...register('deadline')}
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-1 text-sm"
            />
          ) : (
            <p className="text-gray-600">
              {new Date(task.deadline).toLocaleString()}
            </p>
          )}
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
    </>
  );
};
