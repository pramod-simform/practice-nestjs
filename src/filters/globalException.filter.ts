import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

export const getStatusCode = <T>(exception: T): number => {
  return exception instanceof HttpException
    ? exception.getStatus()
    : HttpStatus.INTERNAL_SERVER_ERROR;
};

export interface HttpExceptionResponse {
  statusCode: number;
  message: any;
  error: string;
}
export const getErrorMessage = <T>(exception: T): any => {
  if (exception instanceof HttpException) {
    const errorResponse = exception.getResponse();
    const errorMessage =
      (errorResponse as HttpExceptionResponse).message ||
      exception.message ||
      '';

    const formattedErrorMessage = Array.isArray(errorMessage)
      ? errorMessage.join(', ')
      : errorMessage;

    return formattedErrorMessage;
  } else {
    return String(exception);
  }
};

@Catch()
export class GlobalExceptionFilter<T> implements ExceptionFilter {
  constructor(private readonly logService: Logger) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let statusCode = getStatusCode<T>(exception);
    statusCode = isNaN(statusCode) ? 500 : statusCode;

    const message = getErrorMessage<T>(exception);
    let formattedResponse = {
      message: message || 'Something went wrong. Please try again.',
      errorCode: statusCode,
    };

    response.status(statusCode).json(formattedResponse);

    const [req] = host.getArgs();

    const startTime = +req.startTime;
    const endTime = +new Date();
    const reqTime = endTime - startTime;

    this.logService.error(
      message,
      JSON.stringify(
        {
          requestMethod: req.method,
          requestUrl: req.url,
          requestHeaders: req.headers,
          requestBody: req.body,
          statusCode,
          responseBody: formattedResponse,
          startTime: new Date(startTime),
          endTime: new Date(endTime),
          executionTimeMS: reqTime,
        },
        null,
        2,
      ),
    );
  }
}
