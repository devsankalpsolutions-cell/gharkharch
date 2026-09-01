'use client';

import React from 'react';
import { useFinance } from '@/context/FinanceContext';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/lib/formatters';
import {
  TrendingUp,
  CalendarClock,
  ArrowRight,
  Sparkles,
  Building2,
  Clock,
} from 'lucide-react';

export const CashFlowForecast: React.FC = () => {
  const { metrics, recurringExpenses, liabilities } = useFinance();
  const { user } = useAuth();

  const currency = user?.currency || 'INR';
  const formatStyle = user?.numberFormat || 'indian';

  // Filter active liabilities for upcoming due dates
  const activeLiabilities = liabilities.filter(l => l.status === 'Active' || l.status === 'Overdue');
  const activeRecurring = recurringExpenses.filter(r => r.isEnabled);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Monthly Cashflow Projection */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Monthly Cash Flow Forecast</span>
          </div>
          <span className="text-[11px] font-semibold text-slate-400">Projected Closing Balance</span>
        </div>

        <div className="p-4 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white rounded-2xl shadow-md border border-indigo-800/50 space-y-3">
          <div className="flex justify-between items-center text-xs text-indigo-200 border-b border-indigo-800/60 pb-2">
            <span>Opening Balance (Current Available)</span>
            <span className="font-bold text-white">+{formatCurrency(metrics.totalAvailable, currency, formatStyle)}</span>
          </div>
          <div className="flex justify-between items-center text-xs text-indigo-200 border-b border-indigo-800/60 pb-2">
            <span>Expected Salary Income</span>
            <span className="font-bold text-emerald-400">+{formatCurrency(metrics.expectedMonthlySalary, currency, formatStyle)}</span>
          </div>
          <div className="flex justify-between items-center text-xs text-indigo-200 border-b border-indigo-800/60 pb-2">
            <span>Expected Fixed & Planned Expenses</span>
            <span className="font-bold text-rose-400">-{formatCurrency(metrics.totalExpectedMonthlyExpenses, currency, formatStyle)}</span>
          </div>
          <div className="flex justify-between items-center text-xs text-indigo-200 border-b border-indigo-800/60 pb-2">
            <span>Recommended Liability Repayments</span>
            <span className="font-bold text-amber-400">-{formatCurrency(metrics.smartRecommendation.totalRecommended, currency, formatStyle)}</span>
          </div>

          <div className="flex justify-between items-center pt-1">
            <span className="font-black text-sm text-white">Projected Month-End Balance</span>
            <span className="font-black text-xl text-emerald-300">
              {formatCurrency(metrics.expectedClosingBalanceForecast, currency, formatStyle)}
            </span>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
          * Forecast simulates full income arrival, planned expenses, and recommended liability repayments.
        </p>
      </div>

      {/* 2. Upcoming Expenses & Liability Due Dates */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-wider">
            <CalendarClock className="w-4 h-4" />
            <span>Upcoming Bills & Liabilities</span>
          </div>
          <span className="text-[11px] font-semibold text-slate-400">Ordered by Due Date</span>
        </div>

        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {activeRecurring.map(rec => (
            <div
              key={rec.id}
              className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl flex items-center justify-between hover:bg-slate-100/60 dark:hover:bg-slate-800/70 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center font-black text-xs">
                  {rec.dueDateDay}
                </div>
                <div>
                  <h5 className="font-bold text-xs text-slate-800 dark:text-slate-200">
                    {rec.name}
                  </h5>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Fixed Bill • {rec.category}
                  </p>
                </div>
              </div>
              <span className="font-extrabold text-xs text-slate-900 dark:text-slate-100">
                {formatCurrency(rec.expectedAmount || rec.amount || 0, currency, formatStyle)}
              </span>
            </div>
          ))}

          {activeLiabilities.map(lia => (
            <div
              key={lia.id}
              className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl flex items-center justify-between hover:bg-slate-100/60 dark:hover:bg-slate-800/70 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black text-xs">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h5 className="font-bold text-xs text-slate-800 dark:text-slate-200">
                      {lia.name}
                    </h5>
                    {lia.type === 'Friend Borrow' && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                        Flexible
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {lia.type === 'Friend Borrow' ? `Remaining ₹${lia.remainingAmount.toLocaleString('en-IN')}` : `Due ${lia.dueDate}`}
                  </p>
                </div>
              </div>

              <span className="font-extrabold text-xs text-amber-600 dark:text-amber-400">
                {lia.type === 'Friend Borrow' ? 'Flexible' : formatCurrency(lia.monthlyEmi, currency, formatStyle)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
