import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email address is required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if user exists
    const users = await query(`SELECT id, name FROM users WHERE email = ?`, [cleanEmail]);
    if (!users || users.length === 0) {
      return NextResponse.json(
        { success: false, message: 'If an account exists with this email, reset instructions have been issued.' },
        { status: 200 }
      );
    }

    // Generate 6-digit PIN reset code
    const resetPin = Math.floor(100000 + Math.random() * 900000).toString();
    const resetId = `reset_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' ');

    await query(
      `INSERT INTO password_resets (id, email, token, expires_at) VALUES (?, ?, ?, ?)`,
      [resetId, cleanEmail, resetPin, expiresAt]
    );

    return NextResponse.json({
      success: true,
      resetCode: resetPin, // Returned for instant demo/testing verification
      message: `Password reset PIN code generated for ${cleanEmail}. (Code: ${resetPin})`,
    });
  } catch (error: any) {
    console.error('Forgot Password API Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to generate reset request.', error: error?.message },
      { status: 500 }
    );
  }
}
