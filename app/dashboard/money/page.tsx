'use client';

import React from 'react';
import { useFinance } from '@/context/FinanceContext';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { SmartLiabilityAdvisor } from '@/components/money/SmartLiabilityAdvisor';
import { ExpensePlanSection } from '@/components/money/ExpensePlanSection';
import { CashFlowForecast } from '@/components/money/CashFlowForecast';
import { SavingsGoalsSection } from '@/components/money/SavingsGoalsSection';
import {
  Wallet,
  Building2,
  Sparkles,
  ArrowRightLeft,
  PlusCircle,
  TrendingUp,
  History,
  ShieldCheck,
  Calendar,
} from 'lucide-react';

export default function MoneyManagementPage() {
  const {
    balances,
    transfers,
    balanceHistory,
    setIsTransferOpen,
    setIsAddMoneyOpen,
  } = useFinance();
  const { user } = useAuth();

  const currency = user?.currency || 'INR';
  const formatStyle = user?.numberFormat || 'indian';

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Smart Money Assistant & Liquidity Hub</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Household Money Management
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Monitor Bank & Wallet balances, smart liability repayment advice, and monthly cash flow plans.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsAddMoneyOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-xl font-bold text-xs border border-slate-200 dark:border-slate-700 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Adjust Balance</span>
          </button>

          <button
            onClick={() => setIsTransferOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-700 hover:to-indigo-700 text-white rounded-xl font-bold text-xs shadow-md transition-all"
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span>Bank ↔ Wallet Transfer</span>
          </button>
        </div>
      </div>

      {/* 3 Primary Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Bank Balance Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Bank Balance
            </span>
            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-2xl">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {formatCurrency(balances.bankBalance, currency, formatStyle)}
          </h3>
          <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
            Primary bank accounts (HDFC / SBI / ICICI)
          </p>
        </div>

        {/* Wallet Balance Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Wallet / Cash Balance
            </span>
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-2xl">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {formatCurrency(balances.walletBalance, currency, formatStyle)}
          </h3>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            Physical cash in wallet & drawer
          </p>
        </div>

        {/* Total Available Card */}
        <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white rounded-3xl p-6 shadow-md border border-indigo-800/60 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-200 uppercase tracking-wider">
              Total Available Money
            </span>
            <div className="p-2.5 bg-indigo-500/20 text-indigo-300 rounded-2xl">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-white tracking-tight">
            {formatCurrency(balances.totalAvailable, currency, formatStyle)}
          </h3>
          <p className="text-xs text-indigo-300 font-semibold">
            Bank Balance + Wallet Balance combined
          </p>
        </div>
      </div>

      {/* 1. Smart Liability Payment Advisor */}
      <SmartLiabilityAdvisor />

      {/* 2. Monthly Expense Plan Section (Fixed & Planned) */}
      <ExpensePlanSection />

      {/* 3. Cash Flow Forecast & Upcoming Due Dates */}
      <CashFlowForecast />

      {/* 4. Financial Savings Goals */}
      <SavingsGoalsSection />

      {/* 5. Chronological Balance History Ledger */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100 font-extrabold text-base">
            <History className="w-5 h-5 text-indigo-500" />
            <span>Balance History Audit Trail</span>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Running Bank & Wallet balances
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-semibold text-xs border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Account</th>
                <th className="py-3 px-4 text-right">Amount Change</th>
                <th className="py-3 px-4 text-right">Running Bank</th>
                <th className="py-3 px-4 text-right">Running Wallet</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {balanceHistory.slice(0, 15).map(entry => (
                <tr key={entry.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="py-3 px-4 text-xs font-medium text-slate-600 dark:text-slate-400">
                    {formatDate(entry.date)}
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                      {entry.title}
                    </p>
                    <p className="text-[10px] text-slate-400">{entry.type}</p>
                  </td>
                  <td className="py-3 px-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {entry.account}
                  </td>
                  <td
                    className={`py-3 px-4 text-right font-extrabold text-xs ${
                      entry.amountChange > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {entry.amountChange > 0 ? '+' : ''}
                    {formatCurrency(entry.amountChange, currency, formatStyle)}
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-xs text-slate-800 dark:text-slate-200">
                    {formatCurrency(entry.runningBankBalance, currency, formatStyle)}
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-xs text-slate-800 dark:text-slate-200">
                    {formatCurrency(entry.runningWalletBalance, currency, formatStyle)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
