import * as cache from './cache';
import * as logger from './logger';
import * as db from './db';
import * as model from './model';

export function configure() {
    // Redis cache configuration
    cache.cacheConfigure('RedisCache', { logger: logger.createNamespace('REDIS', { level: 'debug' }) });

    // Postgres database configuration
    db.dbConfigure('postgres', { host: 'localhost', port: 5432, username: 'postgres', password: 'temporal', database: 'cw', logger: logger.createNamespace('DB', { level: 'silly' }) });

    model.modelConfigure({logger: logger.createNamespace('MODEL', {level: 'info'})});
}
