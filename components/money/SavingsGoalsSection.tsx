'use client';

import React, { useState } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/lib/formatters';
import { SavingsGoal } from '@/lib/types';
import { Target, Plus, Trash2, CheckCircle2, PiggyBank, Sparkles } from 'lucide-react';

export const SavingsGoalsSection: React.FC = () => {
  const { savingsGoals, addSavingsGoal, updateSavingsGoal, deleteSavingsGoal, metrics } = useFinance();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');

  const currency = user?.currency || 'INR';
  const formatStyle = user?.numberFormat || 'indian';

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFloat(targetAmount);
    const curr = parseFloat(currentAmount) || 0;
    if (!title || isNaN(target) || target <= 0) return;

    addSavingsGoal({
      title,
      targetAmount: target,
      currentAmount: curr,
      targetDate: targetDate || undefined,
    });

    setTitle('');
    setTargetAmount('');
    setCurrentAmount('');
    setTargetDate('');
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
      {/* Header & Monthly Savings Advisory */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">
            <PiggyBank className="w-4 h-4" />
            <span>Savings Goals & Asset Building</span>
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            Financial Savings Goals
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Track progress toward your Emergency Fund, vehicle purchase, travel, or big expenses.
          </p>
        </div>

        {metrics.savingsSurplus > 0 && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/60 rounded-2xl flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 shrink-0">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Suggested: Allocate up to ₹{metrics.savingsSurplus.toLocaleString('en-IN')} surplus this month!</span>
          </div>
        )}
      </div>

      {/* Add New Goal Form */}
      <form onSubmit={handleAddGoal} className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-700">
        <div>
          <label className="block text-[11px] font-bold text-slate-500 mb-1">Goal Title *</label>
          <input
            type="text"
            required
            placeholder="e.g. Emergency Reserve"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-slate-500 mb-1">Target Amount (₹) *</label>
          <input
            type="number"
            required
            min="1"
            placeholder="e.g. 100000"
            value={targetAmount}
            onChange={e => setTargetAmount(e.target.value)}
            className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-slate-500 mb-1">Current Saved (₹)</label>
          <input
            type="number"
            min="0"
            placeholder="e.g. 45000"
            value={currentAmount}
            onChange={e => setCurrentAmount(e.target.value)}
            className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Goal</span>
          </button>
        </div>
      </form>

      {/* Savings Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {savingsGoals.map(goal => {
          const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
          const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);

          return (
            <div
              key={goal.id}
              className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 rounded-2xl space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-xl">
                    <Target className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                      {goal.title}
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Target Date: {goal.targetDate || 'Flexible'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => deleteSavingsGoal(goal.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                  title="Delete goal"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-600 dark:text-slate-400">Progress ({pct}%)</span>
                  <span className="text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(goal.currentAmount, currency, formatStyle)} / {formatCurrency(goal.targetAmount, currency, formatStyle)}
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-500 rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                <span>Remaining: {formatCurrency(remaining, currency, formatStyle)}</span>
                {pct >= 100 && (
                  <span className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Goal Achieved!
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
