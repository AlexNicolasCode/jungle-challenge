import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

export const dbConfig = TypeOrmModule.forRootAsync({
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      type: 'postgres',
      host: configService.get('DB_HOST', 'db'),
      port: configService.get<number>('DB_PORT', 5432),
      username: configService.get('DB_USER', 'postgres'),
      password: configService.get('DB_PASSWORD', 'password'),
      database: configService.get('DB_NAME', 'auth_db'),
      entities: ['dist/database/entities/*.entity.js'],
      migrations: ['dist/database/migrations/*.js'],
      migrationsRun: true,
    }),
});
