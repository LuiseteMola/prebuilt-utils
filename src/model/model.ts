import { cache } from '../cache';
import { getModelMetadata } from './modelMetadata';
import { logger } from './index';

export class Model {
    modelName: string;
    constructor (modelName: string) {
        this.modelName = modelName;
    }

    public async init (): Promise<Model> {
        logger.debug('GET');
        let metadata: Metadata ; // = await cache.getObjKey('model', this.modelName);
        if (!metadata) {
            logger.debug(`Model cache miss for model "${this.modelName}". Fetching database metadata...`);
            metadata = await getModelMetadata(this.modelName);
            this.saveMetadataToCache(metadata);
        }
        logger.debug('GET');
        logger.silly('Model: ', metadata);
        return this;
    }

    private async saveMetadataToCache (metadata: Metadata) {
        await cache.saveKey('model', this.modelName, metadata);
    }

    public async select (filters: SelectFilters = {}) {}
    public async insert () {}
    public async update () {}
    public async delete () {}
}