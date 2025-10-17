import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class ErrorTransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        let errorMessage = 'Internal server error';
        if (err instanceof HttpException) {
          statusCode = err.getStatus();
          const response = err.getResponse();
          if (typeof response === 'string') {
            errorMessage = response;
          } else if (
            response &&
            typeof response === 'object' &&
            'message' in response
          ) {
            errorMessage = (response as any).message;
          }
        } else if (err?.message) {
          errorMessage = err.message;
        }
        return of({
          error: errorMessage,
          statusCode,
        });
      }),
    );
  }
}
