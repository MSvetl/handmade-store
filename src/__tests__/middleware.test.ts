import { middleware } from '@/middleware';
import type { NextRequest } from 'next/server';

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
  // @ts-expect-error - Мокаем Response для тестов
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

// Мокаем логгер
jest.mock('@/lib/logger');

// Создаем минимальный мок для NextRequest
const createMockRequest = (method: string, urlString: string): NextRequest => {
  const url = new URL(urlString);
  return {
    method,
    url: urlString,
    nextUrl: url,
    headers: new Headers(),
  } as unknown as NextRequest;
};

describe('Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should allow GET requests', async () => {
    const request = createMockRequest('GET', 'http://localhost:3000/api/test');
    const response = middleware(request);
    
    expect(response.status).toBe(200);
    expect(response.headers.get('X-Frame-Options')).toBe('DENY');
  });

  it('should allow POST requests', async () => {
    const request = createMockRequest('POST', 'http://localhost:3000/api/test');
    const response = middleware(request);
    
    expect(response.status).toBe(200);
  });

  it('should reject invalid HTTP methods', async () => {
    const request = createMockRequest('INVALID', 'http://localhost:3000/api/test');
    const response = middleware(request);
    
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.message).toBe('Method not allowed');
  });

  it('should handle errors gracefully', async () => {
    const request = createMockRequest('GET', 'http://localhost:3000/api/test');
    
    // Мокаем конструктор Response, чтобы он выбрасывал ошибку при первом вызове
    const originalResponse = global.Response;
    let firstCall = true;
    
    // @ts-expect-error - Мокаем Response для тестов
    global.Response = class MockErrorResponse {
      public headers: Headers;
      public status: number;
      private body: string;

      constructor(body?: BodyInit | null, init?: ResponseInit) {
        if (firstCall) {
          firstCall = false;
          throw new Error('Test error');
        }
        this.headers = new Headers(init?.headers);
        this.status = init?.status || 200;
        this.body = body?.toString() || '';
      }

      json() {
        return Promise.resolve(JSON.parse(this.body));
      }
    };

    const response = middleware(request);
    
    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.message).toBe('Internal Server Error');

    // Восстанавливаем оригинальный Response
    global.Response = originalResponse;
  });

  it('should set security headers for all responses', async () => {
    const request = createMockRequest('GET', 'http://localhost:3000/api/test');
    const response = middleware(request);
    
    expect(response.headers.get('X-Frame-Options')).toBe('DENY');
    expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
    expect(response.headers.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin');
    expect(response.headers.get('Permissions-Policy')).toBe('camera=(), microphone=(), geolocation=()');
  });
}); 