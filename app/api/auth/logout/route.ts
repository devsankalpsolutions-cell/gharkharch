import { NextResponse } from 'next/server';
import { getClearSessionCookieConfig } from '@/lib/auth';

export async function POST() {
  const cookieConfig = getClearSessionCookieConfig();
  const response = NextResponse.json({ success: true, message: 'Logged out successfully.' });
  response.cookies.set(cookieConfig.name, cookieConfig.value, {
    httpOnly: cookieConfig.httpOnly,
    secure: cookieConfig.secure,
    sameSite: cookieConfig.sameSite,
    path: cookieConfig.path,
    maxAge: 0,
  });
  return response;
}
