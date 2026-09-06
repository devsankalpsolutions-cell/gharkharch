'use client';

import React from 'react';
import { useFinance } from '@/context/FinanceContext';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency, formatMonthYear, getAvailableMonthsList } from '@/lib/formatters';
import { ProgressBar } from '@/components/ui/ProgressBar';
import {
  PieChart as PieChartIcon,
  Printer,
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  Wallet,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

export default function MonthlySummaryPage() {
  const { metrics, selectedMonth, setSelectedMonth } = useFinance();
  const { user } = useAuth();

  const currency = user?.currency || 'INR';
  const formatStyle = user?.numberFormat || 'indian';
  const months = getAvailableMonthsList();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-full overflow-hidden">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xs print:hidden">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-xs uppercase tracking-wider">
            <PieChartIcon className="w-4 h-4 shrink-0" />
            <span>Monthly Statement</span>
          </div>
          <h2 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight break-words">
            Financial Health Statement ({formatMonthYear(selectedMonth)})
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Comprehensive household budget summary, cashflow breakdown, and savings analysis.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
          {/* Month Switcher */}
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 sm:py-2 rounded-xl border border-slate-200 dark:border-slate-700">
            <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              className="bg-transparent text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 cursor-pointer focus:outline-none"
            >
              {months.map(m => (
                <option key={m.key} value={m.key} className="bg-white dark:bg-slate-900">
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-3.5 py-1.5 sm:py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all shrink-0 cursor-pointer"
          >
            <Printer className="w-4 h-4 shrink-0" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-4 sm:p-8 shadow-xs space-y-6 sm:space-y-8 print:border-none print:shadow-none print:p-0 overflow-hidden">
        {/* Document Title Header */}
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4 sm:pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight break-words">
              Famvexa Financial Report
            </h1>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
              Household Financial Statement for {formatMonthYear(selectedMonth)}
            </p>
          </div>
          <div className="text-left sm:text-right shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-bold text-xs rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Balanced</span>
            </span>
            <p className="text-[11px] text-slate-400 mt-1">Generated for {user?.name || 'User'}</p>
          </div>
        </div>

        {/* Core Financial Totals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-900/60 rounded-2xl">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs mb-1">
              <TrendingUp className="w-4 h-4 shrink-0" />
              <span>Total Income</span>
            </div>
            <p className="text-xl sm:text-2xl font-black text-emerald-900 dark:text-emerald-200 truncate">
              {formatCurrency(metrics.totalIncome, currency, formatStyle)}
            </p>
          </div>

          <div className="p-4 bg-rose-50/60 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-900/60 rounded-2xl">
            <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-xs mb-1">
              <TrendingDown className="w-4 h-4 shrink-0" />
              <span>Total Expenses</span>
            </div>
            <p className="text-xl sm:text-2xl font-black text-rose-900 dark:text-rose-200 truncate">
              {formatCurrency(metrics.totalExpenses, currency, formatStyle)}
            </p>
          </div>

          <div className="p-4 bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/60 rounded-2xl">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-xs mb-1">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>Liability Payments</span>
            </div>
            <p className="text-xl sm:text-2xl font-black text-amber-900 dark:text-amber-200 truncate">
              {formatCurrency(metrics.totalLiabilityPaymentsThisMonth, currency, formatStyle)}
            </p>
          </div>

          <div className="p-4 bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-900/60 rounded-2xl">
            <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-bold text-xs mb-1">
              <Wallet className="w-4 h-4 shrink-0" />
              <span>Remaining Surplus</span>
            </div>
            <p className="text-xl sm:text-2xl font-black text-indigo-900 dark:text-indigo-200 truncate">
              {formatCurrency(metrics.remainingBalance, currency, formatStyle)}
            </p>
          </div>
        </div>

        {/* Income Allocation Breakdown (%) */}
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base sm:text-lg">
            Income Outflow Distribution
          </h3>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                <span>Living Expenses Percentage</span>
                <span>{metrics.expensePercentage.toFixed(1)}%</span>
              </div>
              <ProgressBar progress={metrics.expensePercentage} colorClass="bg-rose-500" showPercentage={false} />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                <span>Liability EMI Payments Percentage</span>
                <span>{metrics.liabilityPaymentPercentage.toFixed(1)}%</span>
              </div>
              <ProgressBar progress={metrics.liabilityPaymentPercentage} colorClass="bg-amber-500" showPercentage={false} />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                <span>Net Savings Rate</span>
                <span>{metrics.savingsPercentage.toFixed(1)}%</span>
              </div>
              <ProgressBar progress={Math.max(0, metrics.savingsPercentage)} colorClass="bg-emerald-500" showPercentage={false} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
