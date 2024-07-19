import { Injectable, NestMiddleware } from '@nestjs/common';
import * as morgan from 'morgan';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const logsDirectory = path.join(__dirname, '..', 'logs');

    if (!fs.existsSync(logsDirectory)) {
      fs.mkdirSync(logsDirectory, { recursive: true });
    }

    const accessLogStream = fs.createWriteStream(
      path.join(logsDirectory, 'access.log'),
      { flags: 'a' },
    );

    morgan('combined', { stream: accessLogStream })(req, res, next);
  }
}
