import { Module } from '@nestjs/common';

import { dbConfig } from './database/config';
import { TaskModule } from './modules/tasks/task.module';

@Module({
  imports: [dbConfig, TaskModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
