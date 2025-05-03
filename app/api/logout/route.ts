import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function GET() {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });

  response.headers.append(
    'Set-Cookie',
    serialize('authToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'strict',
      expires: new Date(0), 
    })
  );

  return response;
}
