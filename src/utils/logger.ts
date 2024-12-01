import { createLogger, format, transports } from 'winston';

/**
 * @constant logger
 * @description Configures and exports a Winston logger instance for structured logging in the application.
 * The logger writes logs to both the console and a file.
 */
export const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ level, message, timestamp }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    }),
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'logs/app.log' }),
  ],
});
