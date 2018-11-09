import {Sql, QueryBuilder} from 'knex';
import {Notification, PoolClient } from 'pg';

interface PGQuerySQLReturn {
    sql: string;
    bindings: Array<string>;
}

interface PGQuerySQL extends Sql {
    toNative(): PGQuerySQLReturn;
}

interface PGQueryBuilder extends QueryBuilder {
    toSQL(): PGQuerySQL;
}

interface PGQueryParameters {
    text: string;
    values: string[];
}

interface TransactionClient {
    client: PoolClient;
    notifications: Array<Notification>;
    errors: Array<Error>;
}
