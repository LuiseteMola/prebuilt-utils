import { format, transports } from 'winston';
import { TransformableInfo } from 'logform';
import * as util from 'util';
import { Z_TEXT } from 'zlib';

function formatType(type: any) {
    switch (typeof (type)) {
        case 'undefined': return 'undefined';
        case 'object': return util.inspect(type);
    }
    return type;
}

function formatMeta(meta: any) {
    if (Array.isArray(meta)) return meta.map((cur, idx) => `\n${idx}: ${formatType(cur)}`);
    return formatType(meta);
}

const mergeArguments = format((info: TransformableInfo, opts) => {
    if (info.meta) info.message = `${info.message}${formatMeta(info.meta)}`;
    return info;
});

function formatLabel(label: string) {
    if (label) return `[${label}]: `;
    return '';
}

/** Winston formats */
function defaultFormat(opts: any = {}) {
    return format.combine(
        format.label({label: opts.label}),
        format.colorize(),
        format.splat(),
        format.timestamp({ format: 'DD/MM/YYYY HH:mm:ss.SSS' }),
        mergeArguments(),
        format.printf(info => `${info.timestamp} ${formatLabel(info.label)}${info.level}: ${info.message}`)
    );
}
export const winstonFormats = {
    /** defaultFormat
     * Merge all arguments into one single line.
     * Format description: timestamp - level - message
     */
    defaultFormat: defaultFormat
};

