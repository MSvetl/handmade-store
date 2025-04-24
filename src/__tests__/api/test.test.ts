import { GET } from '@/app/api/test/route';
import { SuccessResponse, ErrorResponse } from '@/types/api';

// Мок для Response
class MockResponse {
  status: number;
  headers: Map<string, string>;
  body: any;

  constructor(body: any, init?: ResponseInit) {
    this.body = body;
    this.status = init?.status || 200;
    this.headers = new Map(Object.entries(init?.headers || {}));
  }

  json() {
    return Promise.resolve(JSON.parse(this.body));
  }
}

// Мокаем глобальный Response
global.Response = MockResponse as any;

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
    
    // Симулируем ошибку
    jest.spyOn(Date.prototype, 'toISOString').mockImplementationOnce(() => {
      throw new Error('Test error');
    });

    const response = await GET() as unknown as MockResponse;
    const data = await response.json() as ErrorResponse;

    expect(response.status).toBe(500);
    expect(response.headers.get('Content-Type')).toBe('application/json');
    
    expect(data.status).toBe('error');
    expect(data.success).toBe(false);
    expect(data.message).toBe('Внутренняя ошибка сервера');
    expect(data.error).toBe('Internal Server Error');
    expect(data.code).toBe(500);

    // Очищаем моки
    consoleSpy.mockRestore();
    jest.restoreAllMocks();
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