interface MetadataField {
    /** Field name. Can be table column name or another identifier */
    field: string;
    /** Field type */
    type: string;
    required: boolean;
    /** Tells whether this column belongs to base table or from an sql expression */
    baseTable: boolean;
    /** Database column name. If not provided it will be equal as field */
    columnName: string;
    /** Field max length */
    maxLength?: number;
    /** This field belongs to table primary key? */
    primaryKey: boolean;
    /** This field should be always on uppercase (informative for frontend) */
    uppercase: boolean;
    /** Model field default value */
    defaultValue: string;
}

type MetadataColumns = Array<MetadataField>;
type MetadataFieldList = {[fieldName: string]: MetadataField}

interface Metadata {
    /** Base table schema */
    schema?: string;
    /** Model table for data operations (insert/update/delete). It will be used for select when sql is not provided */
    table: string;
    /** Model permissions (select/insert/update/delete) */
    permissions: {
        select: boolean;
        insert: boolean;
        delete: boolean;
        update: boolean;
    };
    /** Array of model columns */
    columns: MetadataColumns;
    /** Field list direct access */
    fieldList: MetadataFieldList;
    /** Fetch row limit */
    rowLimit?: number;
    /** Primary key field list. Used for update/delete */
    primaryKey: Array<string>;
    /** SQL used for query */
    sql: string;
}

type SQLOperator = '=' | '!=' | '>' | '<' | '>=' | '<=' | 'LIKE' | 'IN' | 'NOT IN';

interface SelectFilterPredicate {
    /** Query filter value */
    value: string;
    /** Query operator. Defaults to = */
    operator?: SQLOperator;
    function?: string;
    multipleValues?: Array<string>;
}

interface SelectFilters {
    [fieldName: string]: string | SelectFilterPredicate;
}