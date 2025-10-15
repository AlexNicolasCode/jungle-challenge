import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import React from 'react';
import { TaskPriorityEnum, TaskStatusEnum } from '../../../../shared/enums';

interface TaskEditModeProps {
  isEditMode: boolean;
  updating: boolean;
  register: any;
  handleSubmit: any;
  onSubmit: (data) => void;
  errors: any;
  isSubmitting: boolean;
  taskTitle: string;
  setIsEditMode: (value: boolean) => void;
}

export const TaskEditMode: React.FC<TaskEditModeProps> = ({
  isEditMode,
  updating,
  register,
  handleSubmit,
  onSubmit,
  errors,
  isSubmitting,
  taskTitle,
  setIsEditMode,
}) => {
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          {isEditMode ? (
            <Input
              type="text"
              {...register('title')}
              className={`border rounded px-2 py-1 text-lg font-medium ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={updating}
            />
          ) : (
            <h1 className="text-2xl font-semibold text-gray-900">{taskTitle}</h1>
          )}
        </div>

        <div className="flex items-center gap-3">
          {isEditMode ? (
            <>
                <Select {...register('priority')} disabled={updating}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.values(TaskPriorityEnum).map((priority) => (
                            <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select {...register('status')} disabled={updating}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.values(TaskStatusEnum).map((status) => (
                            <SelectItem key={status} value={status}>{status.replace('_', ' ')}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button
                    type="submit"
                    disabled={isSubmitting || updating}
                >
                    Save
                </Button>
            </>
          ) : (
            <Button
              onClick={() => setIsEditMode(true)}
            >
              Edit
            </Button>
          )}
        </div>
      </div>
    </form>
  );
};
