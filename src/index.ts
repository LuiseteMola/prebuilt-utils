import { Model } from './model/model';
import { logger } from './logger';
import { configure } from './configure';

configure();

async function testModel () {
    logger.debug('Comprobando model');
    const model = new Model('models');
    logger.debug('Inicializando model');
    await model.init();
}

testModel();
