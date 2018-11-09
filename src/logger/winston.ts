import { createLogger, transports, LoggerOptions } from 'winston';
import * as winston from 'winston';
import { winstonFormats } from './formats';

function getLogLevel (level?: string) {
    if (level) return level;
    if (process.env.LOG_LEVEL) return process.env.LOG_LEVEL;
    if (process.env.NODE_ENV == 'production') return 'info';
    return 'debug';
}

function loggerOptions (opts: LoggerOptions = {}) {
    if (!opts.level) opts.level = getLogLevel();
    if (!opts.format) opts.format = winstonFormats.defaultFormat;
    if (!opts.transports) opts.transports = [new transports.Console()];
    return opts;
}

export function createNamespace (name: string, opts?: LoggerOptions) {
    const logger = winston.loggers.add(name, loggerOptions(opts));
    logger.info(`Logger enabled. LOG_LEVEL = ${getLogLevel(opts.level)}`);
    //    return winston.loggers.add(name, loggerOptions(opts));
}

function createDefaultLogger () {
    return winston.createLogger(loggerOptions());
}

export const logger = createDefaultLogger();

export type Logger = winston.Logger;