import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, resetCode, newPassword } = body;

    if (!email || !resetCode || !newPassword) {
      return NextResponse.json(
        { success: false, message: 'Email, reset code, and new password are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Verify reset record
    const resets = await query(
      `SELECT id FROM password_resets WHERE email = ? AND token = ? ORDER BY created_at DESC LIMIT 1`,
      [cleanEmail, resetCode.trim()]
    );

    if (!resets || resets.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired reset PIN code.' },
        { status: 400 }
      );
    }

    // Update user password
    const newHash = await hashPassword(newPassword);
    await query(`UPDATE users SET password_hash = ? WHERE email = ?`, [newHash, cleanEmail]);

    // Clean up reset token
    await query(`DELETE FROM password_resets WHERE email = ?`, [cleanEmail]);

    return NextResponse.json({
      success: true,
      message: 'Password reset successful! You can now log in with your new password.',
    });
  } catch (error: any) {
    console.error('Reset Password API Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to reset password.', error: error?.message },
      { status: 500 }
    );
  }
}
