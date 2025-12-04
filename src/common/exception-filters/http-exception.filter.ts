import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ErrorMessages } from '../constants/error-messages.enum';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = ErrorMessages.INTERNAL_SERVER_ERROR;

    if (exception instanceof QueryFailedError) {
      const msg = exception.message;
      this.logger.error(`[${request.method} ${request.url}] QueryFailedError Message: ${msg}`, exception.stack);
      if (msg.startsWith('Duplicate')) {
        status = HttpStatus.BAD_REQUEST;
        message = ErrorMessages.DUP;
      }
      if (msg.includes(`doesn't have a default value`)) {
        status = HttpStatus.BAD_REQUEST;
        message = ErrorMessages.INVALID_REQUEST_PARAMETER;
      }
    }
    if (exception instanceof EntityNotFoundError) {
      message = ErrorMessages.NOT_FOUND_DATA;
    }

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        const resMessage = (res as any).message;
        message = Array.isArray(resMessage) ? resMessage[0] : resMessage || ErrorMessages.INTERNAL_SERVER_ERROR;
      }
    }

    if (status === 404) {
      const isDefaultNotFound = typeof message === 'string' && message.startsWith('Cannot ');

      if (isDefaultNotFound) {
        message = ErrorMessages.NOT_FOUND_REQUEST;
      }
    }

    const allErrorMessages = Object.values(ErrorMessages);
    if (Array.isArray(message)) {
      message = message.map((msg) => (allErrorMessages.includes(msg as any) ? msg : ErrorMessages.INTERNAL_SERVER_ERROR));
    } else if (typeof message === 'string' && message.startsWith(ErrorMessages.SERVICE_ERROR)) {
      const parts = message.split(':');
      if (parts.length > 1) {
        message = parts.slice(1).join(':').trim();
      } else {
        message = ErrorMessages.INTERNAL_SERVER_ERROR;
      }
    } else {
      if (!allErrorMessages.includes(message as any)) {
        message = ErrorMessages.INTERNAL_SERVER_ERROR;
      }
    }

    if (status >= 500) {
      this.logger.error(`[${request.method} ${request.url}] StatusCode: ${status} Message: ${JSON.stringify(message)}`, exception instanceof Error ? exception.stack : '');
    } else {
      this.logger.warn(`[${request.method} ${request.url}] StatusCode: ${status} Message: ${JSON.stringify(message)}`, exception instanceof Error ? exception.stack : '');
    }

    response.status(status).json({ statusCode: status, message });
  }
}
