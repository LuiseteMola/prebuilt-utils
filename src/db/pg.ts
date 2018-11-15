import { Pool, Notification, QueryResult, types } from 'pg';
import { dbLogger as logger, DbConfiguration } from '.';
import * as knex from 'knex';
import { Logger } from '../logger';
import { PGQuerySQLReturn, PGQueryBuilder, PGQueryParameters, TransactionClient } from './pg/types';

// Postgresql column types for type parsing
const PGTYPE_TIMESTAMPTZ_OID = 1184;
const PGTYPE_TIMESTAMP_OID = 1114;
const PGTYPE_DATE = 1082;

const PGMAX_CONNECTIONS_DEFAULT = 10;
function createPool(opts: DbConfiguration = {}): Pool {
    const maxConnections = Number(process.env.PGMAX_CONNECTIONS) || PGMAX_CONNECTIONS_DEFAULT;
    const host = opts.host || process.env.PGHOST;
    const username = opts.username || process.env.PGUSER;
    const password = opts.password || process.env.PGPASSWORD;
    const database = opts.database || process.env.PGDATABASE;
    const port: number = opts.port || Number(process.env.PGPORT);

    if (!process.env.PGHOST) {
        logger.error('*****************************************************************************************************');
        logger.error('ERROR: database connection data is not configured. Please, export the following environment variables');
        logger.error('*****************************************************************************************************');
        logger.error('PGHOST: Database host | PGUSER: Database login username | PGPASSWORD: Database password | PGDATABASE: Database name | PGPORT: Database port');
        throw new Error('Database is not configured');
    }

    // Creates new connection pool
    logger.info('Starting database pool...');
    if (!maxConnections) logger.info(`Connection pool length is not set. Please export PGMAX_CONNECTIONS environment variable. Defaults to ${maxConnections}`);
    logger.info('Pool length: ', maxConnections);

    // Date parsing "as is". Do not convert to javascript date
    // Default format retrieved by database: YYYY-MM-DD
    types.setTypeParser(PGTYPE_DATE, val => val);

    return new Pool({
        host: host,
        user: username,
        password: password,
        database: database,
        port: port,
        max: maxConnections,
        idleTimeoutMillis: 60000 // Max idle time: 60 seconds
    });
}

export class Postgres {
    private _sql: knex = knex({
        dialect: 'postgresql',
        debug: false
    });

    /** Custom logger for database */
    public log: Logger = logger;
    /** Postgres native driver access */
    private pool: Pool;

    constructor(opts: DbConfiguration) {
        this.pool = createPool(opts);
        this.pool.on('error', ((err: Error) => {
            logger.error(`Database pool error: ${err.stack}`);
        }));
    }

    /** Query builder (knex) */
    public get sql(): knex {
        return this._sql;
    }

    private parseQueryToPostgres(query: PGQuerySQLReturn): PGQueryParameters {
        return {
            text: query.sql,
            values: query.bindings
        };
    }

    /** Parse string / knex query into postgresql native format */
    public buildSql(sql: knex.QueryBuilder | string): string | PGQueryParameters {
        if (typeof (sql) === 'string') return sql;
        // Query comes from knex builder. Convert to Postgresql format
        return this.parseQueryToPostgres((<PGQueryBuilder>sql).toSQL().toNative());
    }

    /** Runs a query from the connection pool */
    public async query(sql: knex.QueryBuilder | string): Promise<QueryResult> {
        const query = this.buildSql(sql);
        logger.debug('Query: ', query);
        const result: QueryResult = await this.pool.query(query);
        return result;
    }

    /** Gets a transaction client from query pool. **Important: Remember to call releaseTransaction() when finished!** */
    public async getTransaction(): Promise<TransactionClient> {
        const trx: TransactionClient = {
            client: await this.pool.connect(),
            notifications: [],
            errors: []
        };
        trx.client.on('error', ((err: Error) => {
            logger.warn('Error on transaction: ', err);
            trx.errors.push(err);
        }));
        trx.client.on('notification', ((msg: Notification) => {
            trx.notifications.push(msg);
            logger.silly(msg);
        }));
        return trx;
    }

    /** Release client from pool
     * @param trx: Postgresql client transaction
     */
    public releaseTransaction(trx: TransactionClient): void {
        trx.client.release();
    }
}