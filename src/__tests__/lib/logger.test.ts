import { logger } from '@/lib/logger';

describe('Logger', () => {
  let consoleInfoSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  let consoleDebugSpy: jest.SpyInstance;
  const originalEnv = process.env.NODE_ENV;

  beforeEach(() => {
    consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation(() => {});
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    consoleDebugSpy = jest.spyOn(console, 'debug').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
    process.env.NODE_ENV = originalEnv;
  });

  it('should log info message', () => {
    const message = 'Test info message';
    const data = { test: 'data' };
    
    logger.info(message, data);
    
    expect(consoleInfoSpy).toHaveBeenCalledTimes(1);
    expect(consoleInfoSpy.mock.calls[0][0]).toMatch(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[INFO\] Test info message$/);
    expect(consoleInfoSpy.mock.calls[0][1]).toBe(data);
  });

  it('should log warn message', () => {
    const message = 'Test warn message';
    const data = { test: 'data' };
    
    logger.warn(message, data);
    
    expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
    expect(consoleWarnSpy.mock.calls[0][0]).toMatch(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[WARN\] Test warn message$/);
    expect(consoleWarnSpy.mock.calls[0][1]).toBe(data);
  });

  it('should log error message', () => {
    const message = 'Test error message';
    const error = new Error('Test error');
    
    logger.error(message, error);
    
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy.mock.calls[0][0]).toMatch(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[ERROR\] Test error message$/);
    expect(consoleErrorSpy.mock.calls[0][1]).toBe(error);
  });

  it('should log debug message only in development', () => {
    const message = 'Test debug message';
    const data = { test: 'data' };
    
    // В production не должно быть логов
    process.env.NODE_ENV = 'production';
    logger.debug(message, data);
    expect(consoleDebugSpy).not.toHaveBeenCalled();
    
    // В development должны быть логи
    process.env.NODE_ENV = 'development';
    logger.debug(message, data);
    expect(consoleDebugSpy).toHaveBeenCalledTimes(1);
    expect(consoleDebugSpy.mock.calls[0][0]).toMatch(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[DEBUG\] Test debug message$/);
    expect(consoleDebugSpy.mock.calls[0][1]).toBe(data);
  });

  it('should handle undefined data in logs', () => {
    logger.info('Info without data');
    logger.warn('Warn without data');
    logger.error('Error without data');
    logger.debug('Debug without data');

    expect(consoleInfoSpy.mock.calls[0][1]).toBe('');
    expect(consoleWarnSpy.mock.calls[0][1]).toBe('');
    expect(consoleErrorSpy.mock.calls[0][1]).toBe('');
    
    process.env.NODE_ENV = 'development';
    logger.debug('Debug without data');
    expect(consoleDebugSpy.mock.calls[0][1]).toBe('');
  });
}); 