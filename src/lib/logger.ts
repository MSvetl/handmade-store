type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: unknown;
}

class Logger {
  private formatMessage(level: LogLevel, message: string, data?: unknown): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      data
    };
  }

  info(message: string, data?: unknown): void {
    const logEntry = this.formatMessage('info', message, data);
    console.info(`[${logEntry.timestamp}] [INFO] ${message}`, data || '');
  }

  warn(message: string, data?: unknown): void {
    const logEntry = this.formatMessage('warn', message, data);
    console.warn(`[${logEntry.timestamp}] [WARN] ${message}`, data || '');
  }

  error(message: string, error?: unknown): void {
    const logEntry = this.formatMessage('error', message, error);
    console.error(`[${logEntry.timestamp}] [ERROR] ${message}`, error || '');
  }

  debug(message: string, data?: unknown): void {
    if (process.env.NODE_ENV === 'development') {
      const logEntry = this.formatMessage('debug', message, data);
      console.debug(`[${logEntry.timestamp}] [DEBUG] ${message}`, data || '');
    }
  }
}

export const logger = new Logger(); 