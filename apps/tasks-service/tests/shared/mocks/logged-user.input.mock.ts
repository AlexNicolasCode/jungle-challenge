import { faker } from '@faker-js/faker';

import { LoggedUserInputDto } from 'src/shared/dtos';

export const createLoggedUserMock = (): LoggedUserInputDto => {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
  };
};
