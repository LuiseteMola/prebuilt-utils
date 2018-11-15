import { createLogger, transports, LoggerOptions } from 'winston';
import * as winston from 'winston';
import { winstonFormats } from './formats';

function getLogLevel (level?: string) {
    if (level) return level;
    if (process.env.LOG_LEVEL) return process.env.LOG_LEVEL;
    if (process.env.NODE_ENV == 'production') return 'info';
    return 'debug';
}

function loggerOptions (opts: LoggerOptions = {}, label?: string) {
    if (!opts.level) opts.level = getLogLevel();
    if (!opts.format) opts.format = winstonFormats.defaultFormat({label: label});
    if (!opts.transports) opts.transports = [new transports.Console()];
    return opts;
}

export function createNamespace (name: string, opts?: LoggerOptions): Logger {
    const logger = winston.loggers.add(name, loggerOptions(opts, name));
    logger.info(`Logger "${name}" enabled. LOG_LEVEL = ${getLogLevel(opts.level)}`);
    return logger;
    //    return winston.loggers.add(name, loggerOptions(opts));
}

// Default logger creation
export const logger = winston.createLogger(loggerOptions());

export type Logger = winston.Logger;