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
} from 'lucide-react';

export const SummaryCards: React.FC = () => {
  const { metrics, balances } = useFinance();
  const { user } = useAuth();

  const currency = user?.currency || 'INR';
  const formatStyle = user?.numberFormat || 'indian';

  // Ensure clean numeric values
  const safeBankBalance = Number(balances?.bankBalance || 0);
  const safeWalletBalance = Number(balances?.walletBalance || 0);
  const totalAvailable = safeBankBalance + safeWalletBalance;

  const safeSpendingAmount = Number(metrics?.safeSpendingUntilNextSalary || 0);
  const dailyLimit = Number(metrics?.dailySafeSpendingLimit || 0);

  return (
    <div className="space-y-3 mb-6">
      {/* HERO CARD: TOTAL AVAILABLE MONEY - Pastel Blue Theme */}
      <div className="p-6 bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-950 text-white rounded-3xl shadow-xl border border-sky-800/40 relative overflow-hidden">
        <div className="flex items-center justify-between text-sky-300 text-xs font-bold uppercase tracking-wider mb-1">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span>TOTAL AVAILABLE MONEY</span>
          </span>
          <span className="text-[11px] px-2.5 py-0.5 bg-sky-800/60 text-sky-200 font-semibold rounded-lg border border-sky-600/30">
            BANK + CASH
          </span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight my-2">
          {formatCurrency(totalAvailable, currency, formatStyle)}
        </h2>

        <div className="grid grid-cols-2 gap-3 pt-3 mt-3 border-t border-white/10 text-xs">
          <div className="flex items-center justify-between bg-white/5 p-3 rounded-2xl border border-white/5">
            <div>
              <p className="text-[10px] text-sky-200 font-bold uppercase">Bank Balance</p>
              <p className="font-extrabold text-sm text-white mt-0.5">
                {formatCurrency(safeBankBalance, currency, formatStyle)}
              </p>
            </div>
            <Building2 className="w-4 h-4 text-sky-400" />
          </div>

          <div className="flex items-center justify-between bg-white/5 p-3 rounded-2xl border border-white/5">
            <div>
              <p className="text-[10px] text-sky-200 font-bold uppercase">Wallet / Cash</p>
              <p className="font-extrabold text-sm text-white mt-0.5">
                {formatCurrency(safeWalletBalance, currency, formatStyle)}
              </p>
            </div>
            <Wallet className="w-4 h-4 text-sky-400" />
          </div>
        </div>
      </div>

      {/* SECONDARY STAT CARDS GRID - Pastel Accents */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* SAFE SPENDING */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] font-bold uppercase tracking-wider">Safe Spending</span>
            <ShieldCheck className="w-4 h-4 text-sky-500" />
          </div>
          <h4 className="text-lg font-black text-sky-600 dark:text-sky-400 mt-1">
            {formatCurrency(safeSpendingAmount, currency, formatStyle)}
          </h4>
          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
            ~₹{dailyLimit.toLocaleString('en-IN')}/day
          </p>
        </div>

        {/* EXPECTED SALARY */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] font-bold uppercase tracking-wider">Monthly Pay</span>
            <TrendingUp className="w-4 h-4 text-indigo-400" />
          </div>
          <h4 className="text-lg font-black text-slate-900 dark:text-white mt-1">
            {formatCurrency(metrics?.expectedMonthlySalary || 0, currency, formatStyle)}
          </h4>
          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Salary expected</p>
        </div>

        {/* DAYS TO NEXT SALARY */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] font-bold uppercase tracking-wider">Next Salary</span>
            <CalendarClock className="w-4 h-4 text-violet-400" />
          </div>
          <h4 className="text-lg font-black text-slate-900 dark:text-white mt-1">
            {metrics?.daysToNextSalary || 0} Days
          </h4>
          <p className="text-[10px] text-violet-600 dark:text-violet-400 font-semibold mt-0.5 truncate">
            {metrics?.nextSalaryDateFormatted || ''}
          </p>
        </div>

        {/* SAFETY RESERVE */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] font-bold uppercase tracking-wider">Safety Reserve</span>
            <PiggyBank className="w-4 h-4 text-purple-400" />
          </div>
          <h4 className="text-lg font-black text-purple-600 dark:text-purple-400 mt-1">
            {formatCurrency(metrics?.minimumSafetyBalance || 0, currency, formatStyle)}
          </h4>
          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Emergency pool</p>
        </div>
      </div>
    </div>
  );
};
