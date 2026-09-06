import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { hashPassword, createSessionToken, getSessionCookieConfig } from '@/lib/auth';

function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let email = body.email;
    let name = body.name || 'Google User';

    // If Google GSI credential (JWT ID token) is passed
    if (body.credential) {
      const decoded = parseJwt(body.credential);
      if (decoded && decoded.email) {
        email = decoded.email;
        if (decoded.name) name = decoded.name;
      }
    }

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Google account email could not be verified.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if user already exists
    let users = await query(
      `SELECT id, name, email, currency, number_format, theme, is_initial_setup_completed FROM users WHERE email = ?`,
      [cleanEmail]
    );

    let user: any;
    let isCompleted = false;

    if (users && users.length > 0) {
      user = users[0];
      isCompleted = user.is_initial_setup_completed === 1 || user.is_initial_setup_completed === true;

      // Legacy auto-heal for existing accounts
      if (!isCompleted) {
        const existingSettings = await query(
          `SELECT expected_monthly_salary FROM financial_settings WHERE user_id = ? AND expected_monthly_salary > 0`,
          [user.id]
        );
        if (existingSettings && existingSettings.length > 0) {
          isCompleted = true;
          await query(`UPDATE users SET is_initial_setup_completed = 1 WHERE id = ?`, [user.id]);
        }
      }
    } else {
      // Create new tenant user for Google authentication
      const userId = `user_g_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const randomPassword = Math.random().toString(36).slice(-10) + Date.now();
      const hashedPassword = await hashPassword(randomPassword);

      await query(
        `INSERT INTO users (id, name, email, password_hash, currency, number_format, theme, is_initial_setup_completed)
         VALUES (?, ?, ?, ?, '₹', 'indian', 'dark', 0)`,
        [userId, name.trim(), cleanEmail, hashedPassword]
      );

      // Initialize isolated tenant balances as 0.00
      await query(
        `INSERT INTO account_balances (user_id, bank_balance, wallet_balance)
         VALUES (?, 0.00, 0.00)
         ON DUPLICATE KEY UPDATE user_id=user_id`,
        [userId]
      );

      // Initialize isolated tenant settings with 0.00 defaults
      await query(
        `INSERT INTO financial_settings (user_id, salary_date, expected_monthly_salary, minimum_safety_balance, repayment_strategy)
         VALUES (?, 5, 0.00, 0.00, 'balanced')
         ON DUPLICATE KEY UPDATE user_id=user_id`,
        [userId]
      );

      user = {
        id: userId,
        name: name.trim(),
        email: cleanEmail,
        currency: '₹',
        numberFormat: 'indian',
        theme: 'dark',
      };
      isCompleted = false;
    }

    // Create session token and set HTTP-only cookie
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
        isInitialSetupCompleted: isCompleted,
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
    console.error('Google Auth Route Error:', error);
    return NextResponse.json(
      { success: false, message: 'Google authentication failed.', error: error?.message },
      { status: 500 }
    );
  }
}
