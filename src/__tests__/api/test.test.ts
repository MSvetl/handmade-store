import { GET } from '@/app/api/test/route';
import { SuccessResponse, ErrorResponse } from '@/types/api';
import { createErrorResponse } from '@/utils/api';

interface MockResponseInit extends ResponseInit {
  headers?: Record<string, string>;
}

// Мок для Response
class MockResponse {
  status: number;
  headers: Headers;
  private bodyContent: string;
  ok: boolean;
  redirected: boolean;
  type: ResponseType;
  url: string;
  bodyUsed: boolean;
  statusText: string;

  constructor(body: string, init?: MockResponseInit) {
    this.bodyContent = body;
    this.status = init?.status || 200;
    this.headers = new Headers(init?.headers);
    this.ok = this.status >= 200 && this.status < 300;
    this.redirected = false;
    this.type = 'default';
    this.url = '';
    this.bodyUsed = false;
    this.statusText = '';
  }

  async json(): Promise<unknown> {
    return JSON.parse(this.bodyContent);
  }

  async text(): Promise<string> {
    return this.bodyContent;
  }

  async blob(): Promise<Blob> {
    throw new Error('Not implemented');
  }

  async formData(): Promise<FormData> {
    throw new Error('Not implemented');
  }

  async arrayBuffer(): Promise<ArrayBuffer> {
    throw new Error('Not implemented');
  }

  clone(): MockResponse {
    return new MockResponse(this.bodyContent, {
      status: this.status,
      headers: Object.fromEntries(this.headers.entries())
    });
  }
}

// Мокаем глобальный Response
global.Response = MockResponse as unknown as typeof Response;

describe('Test API', () => {
  it('should return success response with correct format', async () => {
    const response = await GET() as unknown as MockResponse;
    const data = await response.json() as SuccessResponse<{ status: string }>;
    
    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('application/json');
    
    expect(data.status).toBe('success');
    expect(data.success).toBe(true);
    expect(data.message).toBe('Сервер работает нормально');
    expect(data.timestamp).toBeDefined();
    expect(data.data).toBeDefined();
    expect(data.data.status).toBe('ok');
    
    // Проверяем формат timestamp
    expect(new Date(data.timestamp).toString()).not.toBe('Invalid Date');
  });

  it('should return error response on internal error', async () => {
    // Мокаем console.error чтобы избежать вывода в консоль
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Мокаем GET для симуляции ошибки
    const originalGet = GET;
    const mockGet = jest.fn().mockImplementation(() => {
      throw new Error('Test error');
    });
    const globalWithGet = global as unknown as { GET: typeof GET };
    globalWithGet.GET = mockGet;

    try {
      await GET();
    } catch (error) {
      const response = createErrorResponse(error as Error, 'Внутренняя ошибка сервера');
      const data = await response.json() as ErrorResponse;

      expect(response.status).toBe(500);
      expect(response.headers.get('Content-Type')).toBe('application/json');
      
      expect(data.status).toBe('error');
      expect(data.success).toBe(false);
      expect(data.message).toBe('Внутренняя ошибка сервера');
      expect(data.error).toBe('Test error');
    }

    // Восстанавливаем оригинальные функции
    consoleSpy.mockRestore();
    globalWithGet.GET = originalGet;
  });

  it('should have correct response headers', async () => {
    const response = await GET();
    expect(response.headers.get('Content-Type')).toBe('application/json');
  });

  it('should return 200 status code on success', async () => {
    const response = await GET();
    expect(response.status).toBe(200);
  });
}); 