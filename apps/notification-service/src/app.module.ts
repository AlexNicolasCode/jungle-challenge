import { Module } from '@nestjs/common';

import { NotificationModule } from './modules/notifications/notification.module';

@Module({
  imports: [NotificationModule],
  providers: [],
})
export class AppModule {}
