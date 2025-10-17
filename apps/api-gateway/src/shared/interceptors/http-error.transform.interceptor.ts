import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class HttpErrorTransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (data?.error && data?.statusCode) {
          throw new HttpException(
            data.error,
            this.mapStatusCode(data.statusCode),
          );
        }
        return data;
      }),
      catchError((err) => {
        if (err?.response?.error && err?.response?.statusCode) {
          return throwError(
            () =>
              new HttpException(
                err.response.error,
                this.mapStatusCode(err.response.statusCode),
              ),
          );
        }
        return throwError(() => err);
      }),
    );
  }

  private mapStatusCode(code: number): HttpStatus {
    return Object.values(HttpStatus).includes(code)
      ? code
      : HttpStatus.INTERNAL_SERVER_ERROR;
  }
}
