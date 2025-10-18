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
import { AppError } from '../errors/app-errors';

@Catch()
export class GlobalErrorHandlerFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errorDetails: unknown;
    const isDev = process.env.NODE_ENV !== 'production';

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

    // ---------- AppError ----------
    if (exception instanceof AppError) {
      status = exception.getStatus();
      message = exception.message;
    }

    // ---------- HttpException ----------
    else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (exception instanceof BadRequestException) {
        if (typeof exceptionResponse === 'string') {
          message = exceptionResponse;
        } else if (isErrorObject(exceptionResponse)) {
          const responseMessage = exceptionResponse.message;
          if (typeof responseMessage === 'string') message = responseMessage;
          else if (Array.isArray(responseMessage)) message = responseMessage[0];
          else message = exceptionResponse.error || 'Bad Request';
        }
      } else {
        if (typeof exceptionResponse === 'string') {
          message = exceptionResponse;
        } else if (isErrorObject(exceptionResponse)) {
          const responseMessage = exceptionResponse.message;
          if (typeof responseMessage === 'string') message = responseMessage;
          else if (Array.isArray(responseMessage)) message = responseMessage[0];
        }
      }
    }

    // ---------- Prisma Unique (P2002) ----------
    else if (
      exception instanceof Prisma.PrismaClientKnownRequestError &&
      exception.code === 'P2002'
    ) {
      status = HttpStatus.BAD_REQUEST;
      const targetFields = exception.meta?.target as string[] | undefined;
      message = targetFields?.length
        ? `${targetFields.join(', ')} is already registered`
        : 'Duplicate key error';
    }

    // ---------- Prisma Validation ----------
    else if (exception instanceof Prisma.PrismaClientValidationError) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Database validation error';
      if (hasMessage(exception)) errorDetails = exception.message;
    }

    // ---------- JSON Syntax Error ----------
    else if (exception instanceof SyntaxError && 'body' in exception) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Invalid JSON payload';
    }

    // ---------- TypeError / Other Errors ----------
    else if (exception instanceof TypeError) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Type error occurred';
      if (hasMessage(exception)) errorDetails = exception.message;
    } else if (exception instanceof Error) {
      message = exception.message || message;
      errorDetails = isDev
        ? { name: exception.name, stack: exception.stack }
        : undefined;
    }

    // ---------- Send Response ----------
    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      path: request.url,
      method: request.method,
      ...(isDev && errorDetails ? { errorDetails } : {}),
    });

    // ---------- Log Error ----------
    Logger.error(
      `❌ ${request.method} ${request.url}`,
      exception instanceof Error ? exception.stack : JSON.stringify(exception),
    );
  }
}
