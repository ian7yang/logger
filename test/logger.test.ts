import getLogger from '../logger';
import * as winston from 'winston';

describe('loggers', () => {
  test('create different loggers', () => {
    const defaultLogger = getLogger();
    const index = getLogger({module: 'index'});
    expect(winston.loggers.get('default')).toBe(defaultLogger);
    expect(winston.loggers.get('index')).toBe(index)
  })

  test('transports', () => {
    const logger = getLogger();
    expect(logger.transports.length).toBe(2);
    const loggerWithRotation = getLogger({rotate: true, module: 'rotate'})
    expect(loggerWithRotation.transports.length).toBe(2);
  })

})
