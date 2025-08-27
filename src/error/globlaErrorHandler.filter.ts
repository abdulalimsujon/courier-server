/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { Response, Request } from 'express';

import { Prisma } from '@prisma/client';

@Catch()
export class GlobalErrorHandlerFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errorDetails: unknown;

    // Type guards
    const isErrorObject = (
      response: unknown,
    ): response is { message?: string | string[]; error?: string } =>
      typeof response === 'object' &&
      response !== null &&
      ('message' in response || 'error' in response);

    const hasMessage = (err: unknown): err is { message: string } =>
      typeof err === 'object' &&
      err !== null &&
      'message' in err &&
      typeof (err as any).message === 'string';

    if (!exception) {
      Logger.error('Caught undefined exception!');
      response.status(status).json({
        success: false,
        statusCode: status,
        message,
        path: request?.url || 'unknown',
        method: request?.method || 'unknown',
      });
      return;
    }

    // Handle HttpException and subclasses
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (exception instanceof BadRequestException) {
        if (typeof exceptionResponse === 'string') {
          message = exceptionResponse;
        } else if (isErrorObject(exceptionResponse)) {
          const responseMessage = exceptionResponse.message;

          if (typeof responseMessage === 'string') {
            message = responseMessage;
          } else if (Array.isArray(responseMessage)) {
            message = responseMessage[0];
          } else {
            message = exceptionResponse.error || 'Bad Request';
          }
        }
      } else {
        if (typeof exceptionResponse === 'string') {
          message = exceptionResponse;
        } else if (isErrorObject(exceptionResponse)) {
          const responseMessage = exceptionResponse.message;

          if (typeof responseMessage === 'string') {
            message = responseMessage;
          } else if (Array.isArray(responseMessage)) {
            message = responseMessage[0];
          }
        }
      }
    }

    // Prisma known request error (e.g., unique constraint violation)
    if (
      exception instanceof Prisma.PrismaClientKnownRequestError &&
      exception.code === 'P2002'
    ) {
      status = HttpStatus.BAD_REQUEST;

      const targetFields = exception.meta?.target as string[] | undefined;
      if (targetFields && targetFields.length > 0) {
        message = `${targetFields.join(', ')} is already used`;
      } else {
        message = 'Duplicate key error';
      }

      // Do NOT expose errorDetails to frontend to keep it clean
      errorDetails = undefined;
    }
    // Prisma client validation error
    else if (exception instanceof Prisma.PrismaClientValidationError) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Validation Error';
      if (hasMessage(exception)) {
        errorDetails = exception.message;
      }
    }
    // Unsupported file type error (example)
    else if (
      exception instanceof Error &&
      exception.message?.startsWith('Unsupported file type')
    ) {
      status = HttpStatus.BAD_REQUEST;
      message = exception.message;
    }
    // SyntaxError (invalid JSON body)
    else if (exception instanceof SyntaxError && 'body' in exception) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Invalid JSON payload';
      errorDetails = hasMessage(exception) ? exception.message : undefined;
    }
    // TypeError
    else if (exception instanceof TypeError) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'A type error occurred';
      errorDetails = hasMessage(exception) ? exception.message : undefined;
    }
    // General error (only override message if not customized yet)
    else if (exception instanceof Error) {
      if (message === 'Internal server error' || message === '') {
        message = exception.message || message;
      }

      // Toggle isDev flag for exposing stack traces
      const isDev = process.env.NODE_ENV !== 'production';

      errorDetails = isDev
        ? {
            name: exception.name,
            stack: exception.stack,
          }
        : undefined;
    }

    // Send JSON error response
    response.status(status).json({
      success: false,
      message,
      statusCode: status,
      errorDetails,
      path: request?.url || 'unknown',
      method: request?.method || 'unknown',
    });

    // Log full error stack
    Logger.error(
      `Exception caught at ${request.method} ${request.url}`,
      exception instanceof Error ? exception.stack : JSON.stringify(exception),
    );
  }
}
