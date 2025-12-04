import * as winston from 'winston';
import { WinstonModuleOptions } from 'nest-winston';
import 'winston-daily-rotate-file';

const logFormat = winston.format.printf(({ timestamp, level, message, stack }) => {
  // Error 객체라면 message 대신 stack 사용
  return `[${timestamp}] [${level}] ${stack || message}`;
});

const isProd = process.env.NODE_ENV === 'production';

export const winstonConfig: WinstonModuleOptions = {
  transports: [
    new winston.transports.Console({
      level: isProd ? 'info' : 'debug',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.colorize(),
        logFormat
      )
    }),

    ...(isProd
      ? [
          new winston.transports.File({
            filename: 'logs/app.log',
            level: 'info',
            format: winston.format.combine(winston.format.errors({ stack: true }), winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat),
            maxsize: 10 * 1024 * 1024,
            maxFiles: 5
          }),

          new (winston.transports as any).DailyRotateFile({
            filename: 'logs/request-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            level: 'info',
            format: winston.format.combine(winston.format.errors({ stack: true }), winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat),
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d'
          })
        ]
      : [])
  ]
};
