'use client';

import React, { useState } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/lib/formatters';
import { RepaymentStrategy } from '@/lib/types';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  Building2,
  Info,
  ArrowRight,
} from 'lucide-react';

export const SmartLiabilityAdvisor: React.FC = () => {
  const { metrics, liabilities, settings, updateSettings, payEmi } = useFinance();
  const { user } = useAuth();

  const [customAmounts, setCustomAmounts] = useState<Record<string, string>>({});
  const currency = user?.currency || 'INR';
  const formatStyle = user?.numberFormat || 'indian';

  const { smartRecommendation } = metrics;

  const handleStrategyChange = (strategy: RepaymentStrategy) => {
    updateSettings({ repaymentStrategy: strategy });
  };

  const handleCustomChange = (id: string, val: string) => {
    setCustomAmounts(prev => ({ ...prev, [id]: val }));
  };

  const handlePay = (liabilityId: string, defaultAmount: number) => {
    const customVal = customAmounts[liabilityId];
    const finalAmount = customVal ? parseFloat(customVal) : defaultAmount;
    if (isNaN(finalAmount) || finalAmount <= 0) return;

    payEmi(liabilityId, finalAmount, 'Bank Transfer', new Date().toISOString().split('T')[0], 'Smart Advisor repayment');
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
      {/* Advisor Title & Capacity Summary Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-gradient-to-r from-amber-900 via-orange-950 to-slate-950 text-white rounded-2xl shadow-md border border-amber-800/40">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Smart Payment Advisor</span>
          </div>
          <h3 className="text-xl font-black tracking-tight">
            Recommended Repayment Capacity: {formatCurrency(smartRecommendation.totalRecommended, currency, formatStyle)}
          </h3>
          <p className="text-xs text-amber-200/80 mt-1 max-w-xl">
            Calculated after reserving ₹{metrics.minimumSafetyBalance.toLocaleString('en-IN')} emergency reserve & ₹{(metrics.remainingFixedExpensesThisMonth + metrics.remainingPlannedExpensesThisMonth).toLocaleString('en-IN')} remaining monthly bills.
          </p>
        </div>

        {/* Strategy Selector */}
        <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-xl border border-amber-800/60 shrink-0">
          <Sliders className="w-4 h-4 text-amber-400 ml-2" />
          <span className="text-xs font-bold text-slate-300">Strategy:</span>
          <select
            value={settings.repaymentStrategy || 'balanced'}
            onChange={e => handleStrategyChange(e.target.value as RepaymentStrategy)}
            className="bg-transparent text-xs font-bold text-amber-400 cursor-pointer focus:outline-none pr-1"
          >
            <option value="balanced" className="bg-slate-900 text-white">Balanced Distribution</option>
            <option value="quick_win" className="bg-slate-900 text-white">Quick Win (Smallest First)</option>
            <option value="largest_first" className="bg-slate-900 text-white">Largest Loan First</option>
          </select>
        </div>
      </div>

      {/* Transparent Advisory Explanation */}
      <div className="p-4 bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/60 rounded-2xl text-xs text-amber-900 dark:text-amber-300 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold leading-relaxed">{smartRecommendation.explanation}</p>
          <div className="flex flex-wrap gap-4 text-[11px] font-bold text-amber-800 dark:text-amber-400 pt-1">
            <span>• Safety Reserve Protected: ₹{metrics.minimumSafetyBalance.toLocaleString('en-IN')}</span>
            <span>• Remaining Liabilities After Payment: ₹{Math.max(0, metrics.totalLiabilitiesRemaining - smartRecommendation.totalRecommended).toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Recommended Distribution Items */}
      {smartRecommendation.distributions.length === 0 ? (
        <div className="text-center py-6 text-slate-400 text-sm">
          No pending liabilities require repayment advice right now.
        </div>
      ) : (
        <div className="space-y-3">
          <h4 className="font-extrabold text-slate-800 dark:text-slate-200 text-sm">
            Suggested Payment Breakdown & Custom Control
          </h4>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {smartRecommendation.distributions.map(item => {
              const customVal = customAmounts[item.liabilityId];

              return (
                <div
                  key={item.liabilityId}
                  className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 px-2 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-xl">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h5 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                          {item.liabilityName}
                        </h5>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          Priority: {item.priority}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Remaining Principal: ₹{item.remainingAmount.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 justify-between sm:justify-end">
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        Recommended
                      </span>
                      <p className="font-extrabold text-sm text-emerald-600 dark:text-emerald-400">
                        ₹{item.recommendedAmount.toLocaleString('en-IN')}
                      </p>
                    </div>

                    <div className="w-28">
                      <input
                        type="number"
                        placeholder="Custom ₹"
                        value={customVal || ''}
                        onChange={e => handleCustomChange(item.liabilityId, e.target.value)}
                        className="w-full px-2.5 py-1 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 font-bold focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>

                    <button
                      onClick={() => handlePay(item.liabilityId, item.recommendedAmount)}
                      disabled={item.recommendedAmount <= 0 && !customVal}
                      className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs shadow-xs transition-all flex items-center gap-1 shrink-0"
                    >
                      <span>Pay Now</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
