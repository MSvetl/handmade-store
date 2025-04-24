import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'success',
    message: 'Сервер работает нормально',
    timestamp: new Date().toISOString()
  });
} 