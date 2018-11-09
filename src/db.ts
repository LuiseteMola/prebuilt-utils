import { logger as defaultLogger, Logger } from './logger';
import { Postgres } from './db/pg';

/** Sets middleware function to use as database connector. Currently only supports postgres */
export type dbConnector = 'postgres';

export interface DbConfiguration {
    logger?: Logger;
    host?: string;
    port?: number;
    database?: string;
    username?: string;
    password?: string;
}

/** Cache middleware configuration */
export function dbConfigure (connector: dbConnector = 'postgres', conf: DbConfiguration = {}) {
    // Check for custom logging functions on database (debug)
    if (conf && conf.logger) dbLogger = conf.logger;
    else dbLogger = defaultLogger;

    switch (connector) {
        case 'postgres': db = new Postgres(conf);
    }
}
export let db: Postgres;
export let dbLogger: Logger;
