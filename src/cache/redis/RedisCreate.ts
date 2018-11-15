import * as Redis from 'ioredis';
import { cacheLogger as logger } from '..';

console.log('Using logger: ', logger);
export function showNoConfigWarn() {
    logger.warn('No REDIS configured. Check environment variables');
    logger.warn('For Cluster: REDIS_CLUSTER = [{"host": "127.0.0.1", "port": 6381}].');
    logger.warn('For single node: REDIS_HOST=127.0.0.1 / REDIS_PORT=6381.');
    logger.warn('Current values:');
    logger.warn(`REDIS_CLUSTER: ${process.env.REDIS_CLUSTER}`);
    logger.warn(`REDIS_HOST: ${process.env.REDIS_HOST}`);
    logger.warn(`REDIS_PORT: ${process.env.REDIS_PORT}`);
    logger.warn(`REDIS_APP_KEY: ${process.env.REDIS_APP_KEY}`);
    return;
}

export function createSingle(): Redis.Redis {
    logger.info('Configured REDIS in single-node environment');
    logger.info(`REDIS_HOST: ${process.env.REDIS_HOST}`);
    logger.info(`REDIS_PORT: ${process.env.REDIS_PORT}`);
    logger.info(`REDIS_APP_KEY: ${process.env.REDIS_APP_KEY}`);
    return new Redis();
}

export function createCluster(): Redis.Redis {
    logger.info('Configured REDIS in Cluster environment');
    const clusterConfig: Array<Redis.NodeConfiguration> = JSON.parse(process.env.REDIS_CLUSTER);
    clusterConfig.map((node, idx) => {
        logger.info(`Node ${idx}: ${node.host} - ${node.port}`);
    });
    logger.info(`REDIS_APP_KEY: ${process.env.REDIS_APP_KEY}`);
    return new Redis.Cluster(clusterConfig);
}


export function redisCreate() {
    if (process.env.REDIS_CLUSTER) return createCluster();
    else if (process.env.REDIS_HOST && process.env.REDIS_PORT) return createSingle();
    else return showNoConfigWarn();

}