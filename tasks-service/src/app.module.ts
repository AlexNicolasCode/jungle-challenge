import { Module } from '@nestjs/common';

import { dbConfig } from './database/config';
import { TaskModule } from './modules/tasks/task.module';
import { CommentModule } from './modules/comments';

@Module({
  imports: [dbConfig, TaskModule, CommentModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
