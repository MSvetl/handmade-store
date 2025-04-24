import { NextResponse } from 'next/server';
import type { SuccessResponse } from '@/types/api';

export async function GET() {
  try {
    const response: SuccessResponse = {
      status: 'success',
      message: 'Сервер работает нормально',
      timestamp: new Date().toISOString()
    };

    return new Response(JSON.stringify(response), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Test endpoint error:', error);
    return new Response(
      JSON.stringify({
        status: 'error',
        message: 'Внутренняя ошибка сервера',
        timestamp: new Date().toISOString(),
        code: 500
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
} 