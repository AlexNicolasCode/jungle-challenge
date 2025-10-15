import { Module } from '@nestjs/common';

import { HealthzController } from './healthz.controller';
import { NotificationModule } from './modules/notifications/notification.module';

@Module({
  imports: [NotificationModule],
  controllers: [HealthzController],
})
export class AppModule {}
