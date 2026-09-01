'use client';

import React from 'react';
import { useFinance } from '@/context/FinanceContext';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/lib/formatters';
import {
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Flame,
  Calendar,
  Clock,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

export const SmartAdviceCard: React.FC = () => {
  const { metrics } = useFinance();
  const { user } = useAuth();

  const currency = user?.currency || 'INR';
  const formatStyle = user?.numberFormat || 'indian';

  const healthColor =
    metrics.moneyHealthScore === 'Good'
      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
      : metrics.moneyHealthScore === 'Needs Attention'
      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
      : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';

  return (
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white rounded-3xl p-6 shadow-xl border border-indigo-800/40 relative overflow-hidden mb-6">
      {/* Glow effect background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-0 pointer-events-none" />

      <div className="relative z-10 space-y-5">
        {/* Header line with Health Score */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-500/20 rounded-xl text-indigo-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-lg text-white tracking-tight">
                Smart Money Assistant
              </h3>
              <p className="text-xs text-indigo-200">
                Personalized Household Liquidity & Safety Analysis
              </p>
            </div>
          </div>

          <div className={`px-3 py-1 rounded-xl text-xs font-black border flex items-center gap-1.5 shrink-0 ${healthColor}`}>
            {metrics.moneyHealthScore === 'Good' ? (
              <ShieldCheck className="w-4 h-4" />
            ) : (
              <AlertTriangle className="w-4 h-4" />
            )}
            <span>Financial Status: {metrics.moneyHealthScore}</span>
          </div>
        </div>

        {/* Dynamic Safe Spending & Next Salary Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Safe Spending Box */}
          <div className="p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 space-y-1">
            <span className="text-[11px] font-bold text-indigo-200 uppercase tracking-wider">
              Safe Spending Until Salary
            </span>
            <div className="text-2xl font-black text-emerald-300">
              {formatCurrency(metrics.safeSpendingUntilNextSalary, currency, formatStyle)}
            </div>
            <p className="text-xs text-indigo-300 font-semibold">
              Daily Limit: ~₹{metrics.dailySafeSpendingLimit.toLocaleString('en-IN')}/day
            </p>
          </div>

          {/* Next Salary Countdown */}
          <div className="p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 space-y-1">
            <span className="text-[11px] font-bold text-indigo-200 uppercase tracking-wider">
              Next Expected Salary
            </span>
            <div className="text-2xl font-black text-white flex items-center gap-2">
              <span>{metrics.daysToNextSalary} Days</span>
              <span className="text-xs font-medium text-indigo-300">({metrics.nextSalaryDateFormatted})</span>
            </div>
            <p className="text-xs text-emerald-400 font-semibold">
              Expected Salary: ₹{metrics.expectedMonthlySalary.toLocaleString('en-IN')}
            </p>
          </div>

          {/* Safe Liability Payment Capacity */}
          <div className="p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 space-y-1">
            <span className="text-[11px] font-bold text-indigo-200 uppercase tracking-wider">
              Safe Liability Capacity
            </span>
            <div className="text-2xl font-black text-amber-300">
              {formatCurrency(metrics.smartRecommendation.totalRecommended, currency, formatStyle)}
            </div>
            <p className="text-xs text-amber-200 font-semibold">
              Protected Reserve: ₹{metrics.minimumSafetyBalance.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {/* Explanation Footer & Link */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-white/10">
          <p className="text-xs text-indigo-200/90 font-medium max-w-2xl leading-relaxed">
            {metrics.moneyHealthReason}
          </p>

          <Link
            href="/dashboard/money"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-extrabold shadow-md flex items-center justify-center gap-1.5 shrink-0 transition-transform active:scale-95"
          >
            <span>Open Money Advisor</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
