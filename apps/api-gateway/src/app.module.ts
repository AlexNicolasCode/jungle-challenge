import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule, TaskModule } from './modules';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    TaskModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
