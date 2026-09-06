import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { hashPassword, createSessionToken, getSessionCookieConfig } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Name, email, and password are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existing = await query(`SELECT id FROM users WHERE email = ?`, [cleanEmail]);
    if (existing && existing.length > 0) {
      return NextResponse.json(
        { success: false, message: 'An account with this email address already exists.' },
        { status: 400 }
      );
    }

    const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const hashedPassword = await hashPassword(password);

    // Insert user record
    await query(
      `INSERT INTO users (id, name, email, password_hash, currency, number_format, theme)
       VALUES (?, ?, ?, ?, '₹', 'indian', 'dark')`,
      [userId, name.trim(), cleanEmail, hashedPassword]
    );

    // Initialize user balances
    await query(
      `INSERT INTO account_balances (user_id, bank_balance, wallet_balance)
       VALUES (?, 50000.00, 5000.00)
       ON DUPLICATE KEY UPDATE user_id=user_id`,
      [userId]
    );

    // Initialize user settings
    await query(
      `INSERT INTO financial_settings (user_id, salary_date, expected_monthly_salary, minimum_safety_balance, repayment_strategy)
       VALUES (?, 5, 145000.00, 5000.00, 'balanced')
       ON DUPLICATE KEY UPDATE user_id=user_id`,
      [userId]
    );

    // Create Session Token
    const userPayload = { userId, email: cleanEmail, name: name.trim() };
    const token = await createSessionToken(userPayload);
    const cookieConfig = getSessionCookieConfig(token);

    const response = NextResponse.json({
      success: true,
      user: {
        id: userId,
        name: name.trim(),
        email: cleanEmail,
        currency: '₹',
        numberFormat: 'indian',
        theme: 'dark',
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
    console.error('Registration Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create user account.', error: error?.message },
      { status: 500 }
    );
  }
}
