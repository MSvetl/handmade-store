import { middleware } from '@/middleware';
import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { HTTP_STATUS } from '@/config/constants';

// Мокаем логгер
jest.mock('@/lib/logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

// Мокаем глобальный Response
const originalResponse = global.Response;
beforeAll(() => {
  // @ts-ignore
  global.Response = class MockResponse {
    public headers: Headers;
    public status: number;
    private body: string;

    constructor(body?: BodyInit | null, init?: ResponseInit) {
      this.headers = new Headers(init?.headers);
      this.status = init?.status || 200;
      this.body = body?.toString() || '';
    }

    json() {
      return Promise.resolve(JSON.parse(this.body));
    }
  };
});

afterAll(() => {
  global.Response = originalResponse;
});

// Мок для NextRequest
class MockNextRequest {
  private _url: string;
  private _method: string;
  private _headers: Map<string, string>;

  constructor(url: string, method: string = 'GET') {
    this._url = url;
    this._method = method;
    this._headers = new Map();
  }

  get nextUrl() {
    return new URL(this._url);
  }

  get method() {
    return this._method;
  }

  get url() {
    return this._url;
  }

  get headers() {
    return this._headers;
  }
}

describe('Middleware', () => {
  let mockRequest: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest = new MockNextRequest('https://example.com/api/test');
  });

  it('should handle valid GET request', () => {
    mockRequest = new MockNextRequest('https://example.com/api/test', 'GET');

    const response = middleware(mockRequest);

    expect(response.status).toBe(200);
    expect(logger.info).toHaveBeenCalledWith('Incoming request: GET https://example.com/api/test');
    
    // Проверяем заголовки безопасности
    expect(response.headers.get('X-Frame-Options')).toBe('DENY');
    expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
    expect(response.headers.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin');
    expect(response.headers.get('Permissions-Policy')).toBe('camera=(), microphone=(), geolocation=()');
  });

  it('should handle valid POST request', () => {
    mockRequest = new MockNextRequest('https://example.com/api/test', 'POST');

    const response = middleware(mockRequest);

    expect(response.status).toBe(200);
    expect(logger.info).toHaveBeenCalledWith('Incoming request: POST https://example.com/api/test');
  });

  it('should reject invalid HTTP method', async () => {
    mockRequest = new MockNextRequest('https://example.com/api/test', 'PATCH');

    const response = middleware(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
    expect(logger.warn).toHaveBeenCalledWith('Method not allowed: PATCH');
    expect(data.status).toBe('error');
    expect(data.message).toBe('Method not allowed');
  });

  it('should handle errors gracefully', async () => {
    // Симулируем ошибку
    mockRequest = {
      method: 'GET',
      url: 'https://example.com/api/test',
      headers: new Map(),
      nextUrl: new URL('https://example.com/api/test'),
    };

    // Делаем метод недоступным для чтения
    Object.defineProperty(mockRequest, 'method', {
      get: () => { throw new Error('Test error'); }
    });

    const response = middleware(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
    expect(data.status).toBe('error');
    expect(data.message).toBe('Internal Server Error');
    expect(logger.error).toHaveBeenCalledWith('Middleware error:', expect.any(Error));
  });

  it('should set security headers for all responses', () => {
    const methods = ['GET', 'POST', 'PUT', 'DELETE'];

    methods.forEach(method => {
      mockRequest = new MockNextRequest('https://example.com/api/test', method);

      const response = middleware(mockRequest);

      expect(response.headers.get('X-Frame-Options')).toBe('DENY');
      expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
      expect(response.headers.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin');
      expect(response.headers.get('Permissions-Policy')).toBe('camera=(), microphone=(), geolocation=()');
    });
  });
}); 