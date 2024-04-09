import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    const status = exception.getStatus();

    // customize errorResponse : nicer for thrown errors in controllers
    const errorResponse = {
      statusCode: status,
      message: exception.message,
      method: request.method,
      path: request.url,
      timestamp: new Date(),
    };

    // // use default errorResponse (see BaseExceptionFilter)
    // const errorResponse = exception.getResponse();

    response.status(status).json(errorResponse); // this will be sent to client

    // Logging
    this.logger.error(
      `${request.method} ${request.url}`,
      JSON.stringify(errorResponse),
    );
  }
}
