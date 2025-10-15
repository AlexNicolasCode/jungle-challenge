import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { catchError, map, Observable } from 'rxjs';

import { AuditRepository } from 'src/database/repositories';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly auditRepository: AuditRepository) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    return next.handle().pipe(
      map(async (response) => {
        await this.auditRepository.save({
          userId: request.user?.id ?? '',
          ip: request.ip,
          method: request.method,
          url: request.url,
          body: request.body,
          response,
        });
        return response;
      }),
      catchError(async (error) => {
        await this.auditRepository.save({
          userId: request.user?.id ?? '',
          ip: request.ip,
          method: request.method,
          url: request.url,
          body: request.body,
          response: error.message,
        });
        throw error;
      }),
    );
  }
}
