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
// 👈 your custom error class

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

    // ---------- 1️⃣ AppError (custom controlled errors) ----------
    if (exception instanceof AppError) {
      status = exception.getStatus();
      message = exception.message;
    }

    // ---------- 2️⃣ HttpException (Nest built-in) ----------
    else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (exception instanceof BadRequestException) {
        if (typeof exceptionResponse === 'string') {
          message = exceptionResponse;
        } else if (isErrorObject(exceptionResponse)) {
          const responseMessage = exceptionResponse.message;
          if (typeof responseMessage === 'string') message = responseMessage;
          else if (Array.isArray(responseMessage))
            message = responseMessage[0]; // class-validator first message
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

    // ---------- 3️⃣ Prisma unique constraint ----------
    else if (
      exception instanceof Prisma.PrismaClientKnownRequestError &&
      exception.code === 'P2002'
    ) {
      status = HttpStatus.BAD_REQUEST;
      const targetFields = exception.meta?.target as string[] | undefined;
      if (targetFields && targetFields.length > 0)
        message = `${targetFields.join(', ')} is already registered`;
      else message = 'Duplicate key error';
    }

    // ---------- 4️⃣ Prisma validation ----------
    else if (exception instanceof Prisma.PrismaClientValidationError) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Database validation error';
      if (hasMessage(exception)) errorDetails = exception.message;
    }

    // ---------- 5️⃣ Invalid JSON body ----------
    else if (exception instanceof SyntaxError && 'body' in exception) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Invalid JSON payload';
    }

    // ---------- 6️⃣ TypeError or general errors ----------
    else if (exception instanceof TypeError) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Type error occurred';
      if (hasMessage(exception)) errorDetails = exception.message;
    } else if (exception instanceof Error) {
      // fallback for unhandled errors
      message = exception.message || message;
      errorDetails = isDev
        ? { name: exception.name, stack: exception.stack }
        : undefined;
    }

    // ---------- 7️⃣ Fallback (unknown or undefined exception) ----------
    if (!exception) {
      Logger.error('Caught undefined exception!');
    }

    // ---------- 🔚 Send structured JSON response ----------
    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      path: request?.url,
      method: request?.method,
      ...(isDev && errorDetails ? { errorDetails } : {}),
    });

    // ---------- 🧾 Log full error stack ----------
    Logger.error(
      `❌ Exception caught at ${request.method} ${request.url}`,
      exception instanceof Error ? exception.stack : JSON.stringify(exception),
    );
  }
}
