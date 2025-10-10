import { Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';

@Catch()
export class TcpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(TcpExceptionFilter.name);

  catch(exception: unknown): {
    message: string;
    code: number;
  } {
    if (exception instanceof HttpException) {
      const response = exception.getResponse() as Record<string, any>;
      const errorMessage =
        typeof response === 'string'
          ? response
          : (response?.message ?? exception.message);
      return {
        message: errorMessage,
        code: exception.getStatus(),
      };
    }
    this.logger.error(`Internal processo Error`);
    return {
      message: 'Internal Server Error',
      code: 500,
    };
  }
}
