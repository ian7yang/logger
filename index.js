"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var winston = require("winston");
var path = require("path");
require("winston-daily-rotate-file");
var format = winston.format;
var BASE_DIR = path.resolve(__dirname);
var LOG_DIR = path.join(BASE_DIR, 'logs');
var LOG_FILE_NAME = 'combined.log';
var logFormat = format.printf(function (info) { return "".concat(info.timestamp, " ").concat(info.level, " [").concat(info.label, "]: ").concat(info.message, ". ").concat(JSON.stringify(info.metadata)); });
var defaultLogOptions = {
    module: 'default',
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    filename: path.join(LOG_DIR, LOG_FILE_NAME),
    rotate: true
};
function getLogger(logOptions) {
    var _a = __assign(__assign({}, defaultLogOptions), logOptions), module = _a.module, level = _a.level, filename = _a.filename, rotate = _a.rotate;
    if (!winston.loggers.has(module)) {
        var transports = [
            new winston.transports.Console({
                format: format.combine(format.colorize(), logFormat),
            }),
        ];
        if (rotate) {
            var defaultRotateOptions = {
                filename: "".concat(filename, ".%DATE%"),
                datePattern: 'YYYY-MM-DD',
                zippedArchive: true,
                level: level,
                format: format.combine(format.json()),
            };
            var rotateOptions = rotate === true ? defaultRotateOptions : __assign(__assign({}, defaultLogOptions), rotate);
            var rotateTransport = new winston.transports.DailyRotateFile(rotateOptions);
            transports.push(rotateTransport);
        }
        else {
            transports.push(new winston.transports.File({
                filename: filename,
                format: format.combine(format.json()),
            }));
        }
        winston.loggers.add(module, {
            level: level,
            format: format.combine(format.label({ label: module }), format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] })),
            transports: transports,
            exitOnError: false,
        });
    }
    return winston.loggers.get(module);
}
exports.default = getLogger;
//# sourceMappingURL=index.js.map