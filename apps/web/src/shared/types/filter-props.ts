import { TaskPriorityEnum, TaskStatusEnum } from "../enums";

export type FilterProps = {
    status?: TaskStatusEnum;
    priority?: TaskPriorityEnum;
    search?: string;
}
