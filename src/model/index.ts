import { Logger, logger as defaultLogger } from '../logger';

interface ModelConfiguration {
    logger?: Logger;
}

export let logger: Logger;

/** Model middleware configuration */
export function modelConfigure (conf: ModelConfiguration = {}) {
    // Check for custom logging functions on model (debug)
    if (conf && conf.logger) logger = conf.logger;
    else logger = defaultLogger;

    // TODO
    // Put schema and table configuration for model metadata
}
