import * as winston from 'winston';
import * as path from 'path';
import type {DailyRotateFileTransportOptions} from 'winston-daily-rotate-file';
import 'winston-daily-rotate-file'

const {format} = winston;

const BASE_DIR = path.resolve(__dirname);
const LOG_DIR = path.join(BASE_DIR, 'logs');
const LOG_FILE_NAME = 'combined.log';

const logFormat = format.printf(
    info => `${info.timestamp} ${info.level} [${info.label}]: ${info.message}. ${JSON.stringify(info.metadata)}`);

interface LogOptions {
    module?: string,
    level?: string,
    filename?: string,
    rotate?: boolean | DailyRotateFileTransportOptions,
}

const defaultLogOptions = {
    module: 'default',
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    filename: path.join(LOG_DIR, LOG_FILE_NAME),
    rotate: true
}

export default function getLogger(logOptions?: LogOptions) {
    let {
        module, level, filename, rotate,
    } = {...defaultLogOptions, ...logOptions};
    if (!winston.loggers.has(module)) {
        const transports: winston.transport[] = [
            new winston.transports.Console({
                format: format.combine(format.colorize(), logFormat),
            }),];

        if (rotate) {
            const defaultRotateOptions = {
                filename: `${filename}.%DATE%`,
                datePattern: 'YYYY-MM-DD',
                zippedArchive: true,
                level,
                format: format.combine(format.json()),
            }
            const rotateOptions =  rotate === true ? defaultRotateOptions : {...defaultLogOptions, ...rotate};
            const rotateTransport = new winston.transports.DailyRotateFile(rotateOptions as DailyRotateFileTransportOptions);
            transports.push(rotateTransport);
        } else {
            transports.push(new winston.transports.File({
                filename,
                format: format.combine(format.json()),
            }))
        }

        winston.loggers.add(module, {
            level,
            format: format.combine(format.label({label: module}),
                format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}), format.metadata(
                    {fillExcept: ['message', 'level', 'timestamp', 'label']})),
            transports,
            exitOnError: false,
        });
    }
    return winston.loggers.get(module);
}
