'use client';

import React from 'react';
import { useFinance } from '@/context/FinanceContext';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/lib/formatters';
import {
  Building2,
  Wallet,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  CalendarClock,
  PiggyBank,
  ShieldAlert,
} from 'lucide-react';

export const SummaryCards: React.FC = () => {
  const { metrics, balances } = useFinance();
  const { user } = useAuth();

  const currency = user?.currency || 'INR';
  const formatStyle = user?.numberFormat || 'indian';

  return (
    <div className="space-y-3 mb-6">
      {/* HERO CARD: TOTAL AVAILABLE MONEY (Rule 9 & 10) */}
      <div className="p-5 bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-950 text-white rounded-3xl shadow-lg border border-emerald-800/40 relative overflow-hidden">
        <div className="flex items-center justify-between text-emerald-300 text-xs font-bold uppercase tracking-wider mb-1">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>TOTAL AVAILABLE MONEY</span>
          </span>
          <span className="text-[11px] px-2 py-0.5 bg-emerald-800/60 text-emerald-200 rounded-lg">
            Bank + Cash
          </span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight my-1">
          {formatCurrency(balances.totalAvailable, currency, formatStyle)}
        </h2>

        <div className="grid grid-cols-2 gap-3 pt-3 mt-3 border-t border-white/10 text-xs">
          <div className="flex items-center justify-between bg-white/5 p-2.5 rounded-2xl">
            <div>
              <p className="text-[10px] text-emerald-200 font-bold uppercase">Bank Balance</p>
              <p className="font-extrabold text-sm text-white">
                {formatCurrency(balances.bankBalance, currency, formatStyle)}
              </p>
            </div>
            <Building2 className="w-4 h-4 text-emerald-400" />
          </div>

          <div className="flex items-center justify-between bg-white/5 p-2.5 rounded-2xl">
            <div>
              <p className="text-[10px] text-emerald-200 font-bold uppercase">Wallet / Cash</p>
              <p className="font-extrabold text-sm text-white">
                {formatCurrency(balances.walletBalance, currency, formatStyle)}
              </p>
            </div>
            <Wallet className="w-4 h-4 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* SECONDARY STAT CARDS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* SAFE SPENDING */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] font-bold uppercase tracking-wider">Safe Spending</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <h4 className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {formatCurrency(metrics.safeSpendingUntilNextSalary, currency, formatStyle)}
          </h4>
          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
            ~₹{metrics.dailySafeSpendingLimit.toLocaleString('en-IN')}/day
          </p>
        </div>

        {/* EXPECTED SALARY */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] font-bold uppercase tracking-wider">Monthly Pay</span>
            <TrendingUp className="w-4 h-4 text-teal-500" />
          </div>
          <h4 className="text-lg font-black text-slate-900 dark:text-white mt-1">
            {formatCurrency(metrics.expectedMonthlySalary, currency, formatStyle)}
          </h4>
          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Salary expected</p>
        </div>

        {/* DAYS TO NEXT SALARY */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] font-bold uppercase tracking-wider">Next Salary</span>
            <CalendarClock className="w-4 h-4 text-indigo-500" />
          </div>
          <h4 className="text-lg font-black text-slate-900 dark:text-white mt-1">
            {metrics.daysToNextSalary} Days
          </h4>
          <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5 truncate">
            {metrics.nextSalaryDateFormatted}
          </p>
        </div>

        {/* SAFETY RESERVE */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] font-bold uppercase tracking-wider">Safety Reserve</span>
            <PiggyBank className="w-4 h-4 text-purple-500" />
          </div>
          <h4 className="text-lg font-black text-purple-600 dark:text-purple-400 mt-1">
            {formatCurrency(metrics.minimumSafetyBalance, currency, formatStyle)}
          </h4>
          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Emergency pool</p>
        </div>
      </div>
    </div>
  );
};
