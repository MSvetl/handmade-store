import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    return NextResponse.json({
      status: 'success',
      message: 'Запрос успешно обработан',
      receivedData: body,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Ошибка при обработке запроса',
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
} 