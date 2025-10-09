import { Module } from '@nestjs/common';

import { NotificationModule } from './modules/notifications/notification.module';

@Module({
  imports: [NotificationModule],
})
export class AppModule {}
