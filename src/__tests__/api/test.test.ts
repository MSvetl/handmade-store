import { GET } from '@/app/api/test/route';
import { SuccessResponse } from '@/types/api';

describe('Test API', () => {
  it('should return success response with correct format', async () => {
    const response = await GET();
    const data = await response.json() as SuccessResponse;
    
    expect(data.status).toBe('success');
    expect(data.message).toBe('Сервер работает нормально');
    expect(data.timestamp).toBeDefined();
    
    // Проверяем формат timestamp
    expect(new Date(data.timestamp).toString()).not.toBe('Invalid Date');
  });
}); 