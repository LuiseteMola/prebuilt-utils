import { logger } from './index';
import { db } from '../db';

async function getFieldsMetadata(modelName: string): Promise<MetadataColumns> {
    const sql = db.sql.select().from('models_det')
        .where({ id_model: modelName.toUpperCase() });
    const result = await db.query(sql);
    return result.rows.map((row) => {
        return <MetadataField>{
            field: row.field,
            type: row.type,
            columnName: row.column_name || row.field,
            required: (row.required == 'Y'),
            baseTable: row.base_table == 'Y',
            maxLength: row.length,
            primaryKey: row.primary_key == 'Y',
            uppercase: row.uppercase == 'Y',
            defaultValue: row.default_value
        };
    });
}


async function getHeaderMetadata(modelName: string): Promise<Metadata> {
    logger.silly('Get Header metadata');
    const sql = db.sql.select().from('models')
        .where({ id_model: modelName.toUpperCase() });
    let result;
    try {
        result = await db.query(sql);
    }
    catch (err) {
        if (err.code == '42P01') {
            logger.error('MODEL database tables are not configured. Please create MODELS and MODELS_DET table on your database');
            throw 'ERRMODELNOTCONFIGURED';
        }
        logger.error('Unhandled error when looking for model tables:');
        logger.error('Code: ', err.code);
        logger.error('Stack: ', err);
        throw err;
    }
    logger.silly('Fetch model query result: ', result);
    if (result.rowCount == 0) throw 'ERRMODELNOTFOUND';
    const row = result.rows[0];
    return {
        schema: row.schema_name,
        table: row.table_name,
        permissions: {
            select: row.sel == 'Y',
            insert: row.ins == 'Y',
            update: row.upd == 'Y',
            delete: row.del == 'Y'
        },
        rowLimit: row.row_limit,
        columns: [],
        fieldList: {},
        primaryKey: [],
        sql: row.sql
    };
}

export async function getModelMetadata(modelName: string): Promise<Metadata> {
    const metadata: Metadata = await getHeaderMetadata(modelName);
    metadata.columns = await getFieldsMetadata(modelName);
    metadata.columns.map((column) => metadata.fieldList[column.field] = column);
    metadata.primaryKey = metadata.columns.filter((column) => column.primaryKey).map((column) => column.field);
    return metadata;
}