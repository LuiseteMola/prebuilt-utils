import { logger as defaultLogger, Logger } from './logger';
import { RedisCache } from './cache/RedisCache';

/** Sets middleware function to use as cache. Currently only supports RedisCache */
export type CacheType = 'RedisCache';

/** Optional configuration for middleware */
export interface CacheConfiguration {
    /** Set custom logger. Create it from logger utils */
    logger?: Logger;
}

/** Cache middleware configuration */
export function cacheConfigure (cacheType: CacheType = 'RedisCache', conf?: CacheConfiguration) {
    // Check for custom logging functions on cache (debug)
    if (conf && conf.logger) cacheLogger = conf.logger;

    else cacheLogger = defaultLogger;

    switch (cacheType) {
        case 'RedisCache': cache = new RedisCache(conf);
    }
}
export let cache: RedisCache;
export let cacheLogger: Logger;
