import { NextResponse } from 'next/server';
import { query, testConnection } from '@/lib/db';
import { getAuthenticatedUserId } from '@/lib/auth';

export async function GET(request: Request) {
  let authenticatedUserId: string;
  try {
    authenticatedUserId = await getAuthenticatedUserId(request);
  } catch {
    return NextResponse.json(
      { success: false, message: 'UNAUTHORIZED: Please log in to access your financial data.' },
      { status: 401 }
    );
  }

  const connStatus = await testConnection();
  if (!connStatus.success) {
    return NextResponse.json(
      { success: false, connected: false, message: connStatus.message },
      { status: 200 }
    );
  }

  try {
    const [
      incomes,
      expenses,
      liabilities,
      liabilityPayments,
      transfers,
      adjustments,
      recurring,
      budgets,
      goals,
      balances,
      settings,
      allTrips,
      allHouses,
    ] = await Promise.all([
      query(`SELECT id, user_id as userId, title, amount, date, category, received_in as receivedIn, payment_method as paymentMethod, description, notes, created_at as createdAt FROM incomes WHERE user_id = ? ORDER BY date DESC`, [authenticatedUserId]),
      query(`SELECT id, user_id as userId, title, amount, date, category, payment_method as paymentMethod, account, description, created_at as createdAt FROM expenses WHERE user_id = ? ORDER BY date DESC`, [authenticatedUserId]),
      query(`SELECT id, user_id as userId, name, type, total_amount as totalAmount, remaining_amount as remainingAmount, paid_amount as paidAmount, monthly_emi as monthlyEmi, due_date as dueDate, priority, lender_name as lenderName, friend_name as friendName, interest_rate as interestRate, start_date as startDate, end_date as endDate, expected_return_date as expectedReturnDate, notes, status, created_at as createdAt FROM liabilities WHERE user_id = ?`, [authenticatedUserId]),
      query(`SELECT id, liability_id as liabilityId, user_id as userId, amount, date, payment_method as paymentMethod, account, notes FROM liability_payments WHERE user_id = ?`, [authenticatedUserId]),
      query(`SELECT id, user_id as userId, from_account as fromAccount, to_account as toAccount, amount, date, description, created_at as createdAt FROM money_transfers WHERE user_id = ?`, [authenticatedUserId]),
      query(`SELECT id, user_id as userId, account, old_balance as oldBalance, new_balance as newBalance, amount_change as amountChange, reason, date, created_at as createdAt FROM balance_adjustments WHERE user_id = ?`, [authenticatedUserId]),
      query(`SELECT id, user_id as userId, name, amount, expected_amount as expectedAmount, due_date_day as dueDateDay, category, is_enabled as isEnabled, is_fixed as isFixed FROM recurring_fixed_expenses WHERE user_id = ?`, [authenticatedUserId]),
      query(`SELECT id, user_id as userId, category, planned_amount as plannedAmount FROM planned_category_budgets WHERE user_id = ?`, [authenticatedUserId]),
      query(`SELECT id, user_id as userId, title, target_amount as targetAmount, current_amount as currentAmount, target_date as targetDate, icon_name as iconName FROM savings_goals WHERE user_id = ?`, [authenticatedUserId]),
      query(`SELECT bank_balance as bankBalance, wallet_balance as walletBalance FROM account_balances WHERE user_id = ?`, [authenticatedUserId]),
      query(`SELECT salary_date as salaryDate, expected_monthly_salary as expectedMonthlySalary, minimum_safety_balance as minimumSafetyBalance, repayment_strategy as repaymentStrategy FROM financial_settings WHERE user_id = ?`, [authenticatedUserId]),
      query(`SELECT id, name, destination, start_date as startDate, end_date as endDate, description, budget, currency, cover_image as coverImage, admin_participant_id as adminParticipantId, participants FROM trips`),
      query(`SELECT id, name, address, description, start_date as startDate, currency, monthly_budget as monthlyBudget, owner_member_id as ownerMemberId, creator_member_id as creatorMemberId, members FROM houses`),
    ]);

    // Attach payments to liabilities (isolated by authenticated user)
    const formattedLiabilities = (liabilities as any[]).map((l) => ({
      ...l,
      payments: (liabilityPayments as any[]).filter((p) => p.liabilityId === l.id),
    }));

    // Filter Trips: Only include trips where authenticatedUserId is in participants
    const userTrips = (allTrips as any[]).filter((t) => {
      const parts = typeof t.participants === 'string' ? JSON.parse(t.participants) : t.participants;
      return Array.isArray(parts) && parts.some((p: any) => p.id === authenticatedUserId || p.email === authenticatedUserId);
    }).map((t) => ({
      ...t,
      participants: typeof t.participants === 'string' ? JSON.parse(t.participants) : t.participants,
    }));

    // Filter Houses: Only include houses where authenticatedUserId is in members
    const userHouses = (allHouses as any[]).filter((h) => {
      const mems = typeof h.members === 'string' ? JSON.parse(h.members) : h.members;
      return Array.isArray(mems) && mems.some((m: any) => m.id === authenticatedUserId || m.email === authenticatedUserId);
    }).map((h) => ({
      ...h,
      members: typeof h.members === 'string' ? JSON.parse(h.members) : h.members,
    }));

    return NextResponse.json({
      success: true,
      connected: true,
      userId: authenticatedUserId,
      data: {
        incomes,
        expenses,
        liabilities: formattedLiabilities,
        transfers,
        adjustments,
        recurring,
        budgets,
        goals,
        balances: (balances as any[])[0] || { bankBalance: 50000, walletBalance: 5000 },
        settings: (settings as any[])[0] || { salaryDate: 5, expectedMonthlySalary: 145000, minimumSafetyBalance: 5000, repaymentStrategy: 'balanced' },
        trips: userTrips,
        houses: userHouses,
      },
    });
  } catch (error: any) {
    console.error('Error reading multi-tenant user data:', error);
    return NextResponse.json(
      { success: false, connected: true, error: error?.message || String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  let authenticatedUserId: string;
  try {
    authenticatedUserId = await getAuthenticatedUserId(request);
  } catch {
    return NextResponse.json(
      { success: false, message: 'UNAUTHORIZED: Session token invalid or expired.' },
      { status: 401 }
    );
  }

  const body = await request.json();
  const { action, data } = body;

  try {
    if (action === 'save_income') {
      await query(
        `INSERT INTO incomes (id, user_id, title, amount, date, category, received_in, payment_method, description, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE title=?, amount=?, date=?, category=?, received_in=?, payment_method=?, description=?, notes=?`,
        [
          data.id,
          authenticatedUserId,
          data.title,
          data.amount,
          data.date,
          data.category,
          data.receivedIn,
          data.paymentMethod || null,
          data.description || null,
          data.notes || null,
          data.title,
          data.amount,
          data.date,
          data.category,
          data.receivedIn,
          data.paymentMethod || null,
          data.description || null,
          data.notes || null,
        ]
      );
    } else if (action === 'delete_income') {
      await query(`DELETE FROM incomes WHERE id = ? AND user_id = ?`, [data.id, authenticatedUserId]);
    } else if (action === 'save_expense') {
      await query(
        `INSERT INTO expenses (id, user_id, title, amount, date, category, payment_method, account, description)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE title=?, amount=?, date=?, category=?, payment_method=?, account=?, description=?`,
        [
          data.id,
          authenticatedUserId,
          data.title,
          data.amount,
          data.date,
          data.category,
          data.paymentMethod,
          data.account,
          data.description || null,
          data.title,
          data.amount,
          data.date,
          data.category,
          data.paymentMethod,
          data.account,
          data.description || null,
        ]
      );
    } else if (action === 'delete_expense') {
      await query(`DELETE FROM expenses WHERE id = ? AND user_id = ?`, [data.id, authenticatedUserId]);
    } else if (action === 'save_liability') {
      await query(
        `INSERT INTO liabilities (id, user_id, name, type, total_amount, remaining_amount, paid_amount, monthly_emi, due_date, priority, lender_name, friend_name, interest_rate, notes, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE name=?, type=?, total_amount=?, remaining_amount=?, paid_amount=?, monthly_emi=?, due_date=?, priority=?, lender_name=?, friend_name=?, interest_rate=?, notes=?, status=?`,
        [
          data.id,
          authenticatedUserId,
          data.name,
          data.type,
          data.totalAmount,
          data.remainingAmount,
          data.paidAmount || 0,
          data.monthlyEmi || 0,
          data.dueDate,
          data.priority || 'Medium',
          data.lenderName || null,
          data.friendName || null,
          data.interestRate || null,
          data.notes || null,
          data.status || 'Active',
          data.name,
          data.type,
          data.totalAmount,
          data.remainingAmount,
          data.paidAmount || 0,
          data.monthlyEmi || 0,
          data.dueDate,
          data.priority || 'Medium',
          data.lenderName || null,
          data.friendName || null,
          data.interestRate || null,
          data.notes || null,
          data.status || 'Active',
        ]
      );
    } else if (action === 'delete_liability') {
      await query(`DELETE FROM liabilities WHERE id = ? AND user_id = ?`, [data.id, authenticatedUserId]);
    } else if (action === 'save_balance') {
      await query(
        `INSERT INTO account_balances (user_id, bank_balance, wallet_balance)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE bank_balance=?, wallet_balance=?`,
        [authenticatedUserId, data.bankBalance, data.walletBalance, data.bankBalance, data.walletBalance]
      );
    } else if (action === 'save_settings') {
      await query(
        `INSERT INTO financial_settings (user_id, salary_date, expected_monthly_salary, minimum_safety_balance, repayment_strategy)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE salary_date=?, expected_monthly_salary=?, minimum_safety_balance=?, repayment_strategy=?`,
        [
          authenticatedUserId,
          data.salaryDate,
          data.expectedMonthlySalary,
          data.minimumSafetyBalance,
          data.repaymentStrategy,
          data.salaryDate,
          data.expectedMonthlySalary,
          data.minimumSafetyBalance,
          data.repaymentStrategy,
        ]
      );
    } else if (action === 'save_transfer') {
      await query(
        `INSERT INTO money_transfers (id, user_id, from_account, to_account, amount, date, description)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [data.id, authenticatedUserId, data.fromAccount, data.toAccount, data.amount, data.date, data.description || null]
      );
    } else if (action === 'save_adjustment') {
      await query(
        `INSERT INTO balance_adjustments (id, user_id, account, old_balance, new_balance, amount_change, reason, date)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [data.id, authenticatedUserId, data.account, data.oldBalance, data.newBalance, data.amountChange, data.reason, data.date]
      );
    }

    return NextResponse.json({ success: true, action, userId: authenticatedUserId });
  } catch (error: any) {
    console.error('Error in multi-tenant POST sync:', error);
    return NextResponse.json({ success: false, error: error?.message || String(error) }, { status: 500 });
  }
}
