import { logger } from '@/lib/logger';

describe('Logger', () => {
  let consoleInfoSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  let consoleDebugSpy: jest.SpyInstance;
  let originalEnv: NodeJS.ProcessEnv;

  const setNodeEnv = (env: string) => {
    Object.defineProperty(process, 'env', {
      value: { ...originalEnv, NODE_ENV: env }
    });
  };

  beforeEach(() => {
    originalEnv = process.env;
    consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    consoleDebugSpy = jest.spyOn(console, 'debug').mockImplementation();
  });

  afterEach(() => {
    Object.defineProperty(process, 'env', {
      value: originalEnv
    });
    consoleInfoSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    consoleDebugSpy.mockRestore();
  });

  it('should log info messages in development', () => {
    setNodeEnv('development');
    const message = 'Test info message';
    const data = { test: 'data' };

    logger.info(message, data);

    expect(consoleInfoSpy).toHaveBeenCalledTimes(1);
    const [logMessage, logData] = consoleInfoSpy.mock.calls[0];
    expect(logMessage).toMatch(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[INFO\] Test info message$/);
    expect(logData).toEqual(data);
  });

  it('should log warning messages in development', () => {
    setNodeEnv('development');
    const message = 'Test warning message';
    const data = { test: 'data' };

    logger.warn(message, data);

    expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
    const [logMessage, logData] = consoleWarnSpy.mock.calls[0];
    expect(logMessage).toMatch(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[WARN\] Test warning message$/);
    expect(logData).toEqual(data);
  });

  it('should log error messages in development', () => {
    setNodeEnv('development');
    const message = 'Test error message';
    const error = new Error('Test error');

    logger.error(message, error);

    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    const [logMessage, logError] = consoleErrorSpy.mock.calls[0];
    expect(logMessage).toMatch(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[ERROR\] Test error message$/);
    expect(logError).toBe(error);
  });

  it('should not log info messages in production', () => {
    setNodeEnv('production');
    logger.info('Test message');
    expect(consoleInfoSpy).toHaveBeenCalledTimes(1);
    const [logMessage] = consoleInfoSpy.mock.calls[0];
    expect(logMessage).toMatch(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[INFO\] Test message$/);
  });

  it('should log warning messages in production', () => {
    setNodeEnv('production');
    const message = 'Test warning';
    logger.warn(message);
    expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
    const [logMessage] = consoleWarnSpy.mock.calls[0];
    expect(logMessage).toMatch(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[WARN\] Test warning$/);
  });

  it('should log error messages in production', () => {
    setNodeEnv('production');
    const message = 'Test error';
    const error = new Error('Test error');
    logger.error(message, error);
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    const [logMessage, logError] = consoleErrorSpy.mock.calls[0];
    expect(logMessage).toMatch(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[ERROR\] Test error$/);
    expect(logError).toBe(error);
  });

  it('should log debug message only in development', () => {
    setNodeEnv('development');
    const message = 'Test debug';
    logger.debug(message);
    expect(consoleDebugSpy).toHaveBeenCalledTimes(1);
    const [logMessage] = consoleDebugSpy.mock.calls[0];
    expect(logMessage).toMatch(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[DEBUG\] Test debug$/);

    setNodeEnv('production');
    logger.debug('Another test');
    expect(consoleDebugSpy).toHaveBeenCalledTimes(1);
  });

  it('should handle undefined data in logs', () => {
    setNodeEnv('development');
    const message = 'Test message';
    
    logger.info(message);
    logger.warn(message);
    logger.error(message);
    logger.debug(message);

    expect(consoleInfoSpy).toHaveBeenCalledTimes(1);
    expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(consoleDebugSpy).toHaveBeenCalledTimes(1);

    const [infoMessage] = consoleInfoSpy.mock.calls[0];
    const [warnMessage] = consoleWarnSpy.mock.calls[0];
    const [errorMessage] = consoleErrorSpy.mock.calls[0];
    const [debugMessage] = consoleDebugSpy.mock.calls[0];

    expect(infoMessage).toMatch(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[INFO\] Test message$/);
    expect(warnMessage).toMatch(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[WARN\] Test message$/);
    expect(errorMessage).toMatch(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[ERROR\] Test message$/);
    expect(debugMessage).toMatch(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[DEBUG\] Test message$/);
  });
}); 