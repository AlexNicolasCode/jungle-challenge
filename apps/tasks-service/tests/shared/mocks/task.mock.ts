import { faker } from '@faker-js/faker';

import { TaskPriorityEnum, TaskStatusEnum } from 'src/shared/enums';
import { createLoggedUserMock } from './logged-user.input.mock';

export const createTaskMock = () => {
  const numberOfUsers = faker.number.int({ min: 1, max: 5 });
  return {
    id: faker.string.uuid(),
    title: faker.lorem.sentence(),
    deadline: faker.date.future(),
    priority: faker.helpers.arrayElement(Object.values(TaskPriorityEnum)),
    status: faker.helpers.arrayElement(Object.values(TaskStatusEnum)),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    users: Array.from({ length: numberOfUsers }, () => createLoggedUserMock()),
  };
};
