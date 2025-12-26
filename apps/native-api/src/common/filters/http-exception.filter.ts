import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { MetricsService } from '../../metrics/metrics.service';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  constructor(private readonly metricsService: MetricsService) {}

  async catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : exception instanceof Error
          ? exception.message
          : 'Internal server error';

    const errorMessage = typeof message === 'string' ? message : (message as any).message || JSON.stringify(message);
    const stackTrace = exception instanceof Error ? exception.stack : undefined;

    // Determine error type
    let errorType = 'UnknownError';
    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      if (statusCode >= 400 && statusCode < 500) {
        errorType = statusCode === 401 ? 'AuthenticationError' : 
                   statusCode === 403 ? 'AuthorizationError' :
                   statusCode === 404 ? 'NotFoundError' :
                   statusCode === 400 ? 'ValidationError' : 'ClientError';
      } else if (statusCode >= 500) {
        errorType = 'ServerError';
      }
    } else if (exception instanceof Error) {
      errorType = exception.constructor.name;
    }

    // Determine severity
    const severity = status >= 500 ? 'critical' : status >= 400 ? 'error' : 'warning';

    // Extract user ID from request if available
    const userId = (request as any).user?.id;

    // Log error to database (non-blocking)
    // Use setTimeout to make it truly async and non-blocking
    if (this.metricsService) {
      this.metricsService
        .createErrorLog(
          {
            errorType,
            errorMessage,
            stackTrace,
            severity,
            source: 'server',
            route: request.url,
            method: request.method,
            statusCode: status,
            userAgent: request.get('user-agent') || undefined,
            ipAddress: request.ip || request.socket.remoteAddress || undefined,
            context: {
              userId,
              body: request.body,
              query: request.query,
              params: request.params,
            },
          },
          userId,
        )
        .catch((error) => {
          // If error logging fails, just log to console to prevent infinite loops
          this.logger.error('Failed to log error to database', error);
        });
    }

    // Log to console
    this.logger.error(
      `HTTP ${status} Error: ${errorMessage}`,
      stackTrace,
      `${request.method} ${request.url}`,
    );

    // Send response
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: errorMessage,
      ...(process.env.NODE_ENV === 'development' && stackTrace ? { stack: stackTrace } : {}),
    });
  }
}

