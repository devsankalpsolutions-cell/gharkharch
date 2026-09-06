import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getAuthenticatedUserId } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const authenticatedUserId = await getAuthenticatedUserId(request);

    const users = await query(
      `SELECT id, name, email, currency, number_format as numberFormat, theme, is_monthly_carry_forward_enabled as isMonthlyCarryForwardEnabled, is_initial_setup_completed as isInitialSetupCompleted, default_month as defaultMonth, created_at as createdAt FROM users WHERE id = ?`,
      [authenticatedUserId]
    );

    if (!users || users.length === 0) {
      return NextResponse.json({ success: false, authenticated: false }, { status: 401 });
    }

    const user = users[0];
    let isCompleted = user.isInitialSetupCompleted === 1 || user.isInitialSetupCompleted === true;

    // Legacy Auto-Heal: If onboarding status is 0/null in MySQL, check if user has existing financial setup
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

    return NextResponse.json({
      success: true,
      authenticated: true,
      user: {
        ...user,
        isInitialSetupCompleted: isCompleted,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, authenticated: false }, { status: 401 });
  }
}
