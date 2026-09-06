import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getAuthenticatedUserId } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const authenticatedUserId = await getAuthenticatedUserId(request);

    const users = await query(
      `SELECT id, name, email, currency, number_format as numberFormat, theme, is_monthly_carry_forward_enabled as isMonthlyCarryForwardEnabled, default_month as defaultMonth, created_at as createdAt FROM users WHERE id = ?`,
      [authenticatedUserId]
    );

    if (!users || users.length === 0) {
      return NextResponse.json({ success: false, authenticated: false }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      authenticated: true,
      user: users[0],
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, authenticated: false }, { status: 401 });
  }
}
