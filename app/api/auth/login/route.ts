import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { comparePassword, createSessionToken, getSessionCookieConfig } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    const users = await query(
      `SELECT id, name, email, password_hash, currency, number_format, theme FROM users WHERE email = ?`,
      [cleanEmail]
    );

    if (!users || users.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const user = users[0];
    const isPasswordValid = await comparePassword(password, user.password_hash);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const userPayload = { userId: user.id, email: user.email, name: user.name };
    const token = await createSessionToken(userPayload);
    const cookieConfig = getSessionCookieConfig(token);

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        currency: user.currency || '₹',
        numberFormat: user.number_format || 'indian',
        theme: user.theme || 'dark',
      },
    });

    response.cookies.set(cookieConfig.name, cookieConfig.value, {
      httpOnly: cookieConfig.httpOnly,
      secure: cookieConfig.secure,
      sameSite: cookieConfig.sameSite,
      path: cookieConfig.path,
      maxAge: cookieConfig.maxAge,
    });

    return response;
  } catch (error: any) {
    console.error('Login Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to authenticate user.', error: error?.message },
      { status: 500 }
    );
  }
}
