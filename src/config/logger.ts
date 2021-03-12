import path from 'path';
import fs from 'fs';
import { createLogger, format, transports, Logger } from 'winston';
import { isObject } from 'lodash';

import { ENV, LOG_FILE_DIR } from './env';
import { EnhancedLogger } from '../types';

const { combine, printf, timestamp }: typeof format = format;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const t: any = require('winston-daily-rotate-file');

const logFileDir: string = path.join(__dirname, LOG_FILE_DIR);

if (!fs.existsSync(logFileDir)) {
  fs.mkdirSync(logFileDir);
}

const transport = new t({
  dirname: logFileDir,
  filename: 'app-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
});

const logMessage = (message: any): string => {
  if (isObject(message)) {
    // @ts-ignore
    return message.stack ? message.stack : JSON.stringify(message, null, 2);
  }

  return message.toString();
};

const myFormat = printf((info) => {
  const { level, message, timestamp } = info;

  return `${timestamp} ${level}: ${logMessage(message)}`;
});

const winstonLogger: Logger = createLogger({
  format: combine(timestamp(), myFormat),
  transports: [transport, new transports.Console()],
  silent: ENV === 'test',
});

const logger: EnhancedLogger = {
  info: (output: unknown) => winstonLogger.info(logMessage(output)),
  error: (output: unknown) => winstonLogger.error(logMessage(output)),
  warn: (output: unknown) => winstonLogger.warn(logMessage(output)),
};

export { logger };
