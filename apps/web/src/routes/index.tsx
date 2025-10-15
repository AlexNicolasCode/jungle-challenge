import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { useCallback, useEffect, useState } from 'react';

import { FilterProps } from '@/shared/types';
import { useTasks } from '../hooks';
import { TaskPriorityEnum, TaskStatusEnum } from '../shared/enums';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
    const query: FilterProps = useSearch({ from: '/' });
    const navigate = useNavigate();
    const { tasks, loading, loadTasks, handleNextPage } = useTasks();
    const [filters, setFilters] = useState<FilterProps>({
        status: query?.status,
        priority: query?.priority,
        search: query?.search,
    });

    useEffect(() => {
        const handler = setTimeout(() => {
            if (loading) {
                return;
            }
            loadTasks(filters);
        }, 200);
        return () => clearTimeout(handler);
    }, [filters]);

    const handleScroll = useCallback(() => {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        const shouldRenderNextPage = scrollTop + clientHeight >= scrollHeight - 10 && !loading;
        if (shouldRenderNextPage) handleNextPage();
    }, [loading, handleNextPage]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    const handleViewDetails = (taskId: string) => {
        navigate({ to: `/tasks/${taskId}` });
    };

    const handleFilterChange = (key: 'status' | 'priority' | 'search', value: string) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value === '' ? undefined : (value as any),
        }));
    };

    const getStatusColor = (status: TaskStatusEnum) => {
        const colors: Record<TaskStatusEnum, string> = {
            [TaskStatusEnum.TODO]: 'bg-gray-100 text-gray-800',
            [TaskStatusEnum.IN_PROGRESS]: 'bg-blue-100 text-blue-800',
            [TaskStatusEnum.REVIEW]: 'bg-yellow-100 text-yellow-800',
            [TaskStatusEnum.DONE]: 'bg-green-100 text-green-800',
        };
        return colors[status] ?? 'bg-gray-100 text-gray-800';
    };

    const renderSearchFilters = () => {
        return (
            <div className="flex flex-wrap gap-4 mb-6 items-end">
                <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium mb-1">Search</label>
                <Input
                    type="text"
                    placeholder="Search tasks..."
                    value={filters.search ?? ''}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <Select
                        value={filters.status ?? ''}
                        onValueChange={(e) => handleFilterChange('status', e)}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="ALL" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">ALL</SelectItem>
                            {Object.values(TaskStatusEnum).map((status) => (
                                <SelectItem key={status} value={status}>{status.replace('_', ' ')}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Priority</label>
                    <Select
                        value={filters.priority ?? ''}
                        onValueChange={(e) => handleFilterChange('priority', e)}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="ALL" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">ALL</SelectItem>
                            {Object.values(TaskPriorityEnum).map((priority) => (
                                <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        )
    }

    const renderLoading = () => {
       return (
            <ul className="space-y-4 animate-pulse">
                {Array.from({ length: 5 }).map((_, idx) => (
                    <li
                    key={idx}
                    className="bg-white p-4 rounded shadow flex justify-between items-center"
                    >
                    <div className="flex-1">
                        <div className="h-5 bg-gray-200 rounded w-1/2 mb-2 shimmer" />
                        <div className="h-4 bg-gray-200 rounded w-3/4 shimmer" />
                    </div>
                    <div className="h-6 w-20 bg-gray-200 rounded shimmer" />
                    </li>
                ))}
            </ul>
       )
    }

    const renderTasks = () => {
        return (
            <ul className="space-y-4">
                {tasks.map((task) => (
                    <li
                    key={task.id}
                    className="relative bg-white p-4 rounded shadow flex justify-between items-center"
                    >
                    <div>
                        <h2
                        className={`text-lg font-semibold ${
                            task.status === TaskStatusEnum.DONE ? 'line-through text-gray-500' : ''
                        }`}
                        >
                        {task.title}
                        </h2>
                        {task.description && <p className="text-gray-600">{task.description}</p>}
                    </div>

                    <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 rounded text-sm ${getStatusColor(task.status)}`}>
                        {task.status.replace('_', ' ')}
                        </span>

                        <div className="relative">
                        <Button
                            onClick={() => handleViewDetails(task.id)}
                            className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
                        >
                            Details
                        </Button>
                        </div>
                    </div>
                    </li>
                ))}
            </ul>
        )
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6 relative">
            {renderSearchFilters()}
            {loading ? renderLoading() : renderTasks()}
        </div>
    );
}

export default HomePage;
