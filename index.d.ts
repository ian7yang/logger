import * as winston from 'winston';
import { DailyRotateFileTransportOptions } from "winston-daily-rotate-file";
interface LogOptions {
    module?: string;
    level?: string;
    filename?: string;
    rotate?: boolean;
}
export default function getLogger(logOptions: LogOptions): winston.Logger;
export {};
