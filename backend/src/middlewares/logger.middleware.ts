import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { winstonLogger } from 'src/winston-logger';
import { jwtConstants } from '../auth/constants';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const start = Date.now();

    const token = req.headers.authorization?.split(' ')[1];

    let userId;

    if (token) {
      try {
        const payload = await this.jwtService.verifyAsync(token, {
          secret: jwtConstants.secret,
        });
        userId = payload.sub;
      } catch (error) {
        userId = null;
      }
    }

    const body = req.body;

    const copiedBody = { ...body };

    if (copiedBody.password) {
      copiedBody.password = '********';
    }

    const bodyString = JSON.stringify(copiedBody);

    res.on('finish', () => {
      const duration = Date.now() - start;
      winstonLogger.info(
        `HTTP ${method} ${originalUrl} ${res.statusCode} ${duration}ms - User ID: ${userId}${body ? ` - Body ${bodyString}` : ''}`,
      );
    });

    next();
  }
}
