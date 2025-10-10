import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule, TaskModule } from './modules';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, TaskModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
