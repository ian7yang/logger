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
var format = winston.format;
var BASE_DIR = path.resolve(__dirname);
var LOG_DIR = path.join(BASE_DIR, 'logs');
var LOG_FILE_NAME = 'combined.log';
var logFormat = format.printf(function (info) { return "".concat(info.timestamp, " ").concat(info.level, " [").concat(info.label, "]: ").concat(info.message, ". ").concat(JSON.stringify(info.metadata)); });
function getLogger(logOptions, rotateOptions) {
    var module = logOptions.module, level = logOptions.level, filename = logOptions.filename, rotate = logOptions.rotate;
    module = module || 'default';
    var logger = winston.loggers.get(module);
    if (logger)
        return logger;
    filename = filename || path.join(LOG_DIR, LOG_FILE_NAME);
    var transports = [
        new winston.transports.Console({
            format: format.combine(format.colorize(), logFormat),
        }), new winston.transports.File({
            filename: filename,
            format: format.combine(format.json()),
        })
    ];
    if (rotate) {
        rotateOptions = rotateOptions || {};
        var rotateTransport = new winston.transports.DailyRotateFile(__assign({ filename: "".concat(filename, ".%DATE%"), datePattern: 'YYYY-MM-DD', zippedArchive: true }, rotateOptions));
        transports.push(rotateTransport);
    }
    winston.loggers.add(module, {
        level: level || process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        format: format.combine(format.label({ label: module }), format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] })),
        transports: transports,
        exitOnError: false,
    });
    return winston.loggers.get(module);
}
exports.default = getLogger;
//# sourceMappingURL=index.js.map