import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    return NextResponse.json({
      status: 'success',
      message: 'API работает',
      receivedData: body
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Произошла ошибка при обработке запроса' },
      { status: 500 }
    );
  }
} 