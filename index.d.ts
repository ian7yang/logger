import * as winston from 'winston';
import type { DailyRotateFileTransportOptions } from 'winston-daily-rotate-file';
import 'winston-daily-rotate-file';
interface LogOptions {
    module?: string;
    level?: string;
    filename?: string;
    rotate?: boolean | DailyRotateFileTransportOptions;
}
export default function getLogger(logOptions?: LogOptions): winston.Logger;
export {};
