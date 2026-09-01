'use client';

import React, { useState } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency, formatMonthYear } from '@/lib/formatters';
import { RecurringFixedExpense } from '@/lib/types';
import {
  Calendar,
  Plus,
  CheckCircle2,
  AlertCircle,
  TrendingDown,
  Trash2,
  CheckSquare,
  Square,
  Edit2,
} from 'lucide-react';

export const ExpensePlanSection: React.FC = () => {
  const {
    recurringExpenses,
    addRecurringExpense,
    deleteRecurringExpense,
    toggleRecurringExpense,
    plannedBudgets,
    setPlannedBudget,
    metrics,
    selectedMonth,
    categories,
  } = useFinance();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'fixed' | 'planned'>('fixed');
  const [fixedName, setFixedName] = useState('');
  const [fixedAmount, setFixedAmount] = useState('');
  const [fixedCategory, setFixedCategory] = useState('Rent');
  const [fixedDueDate, setFixedDueDate] = useState('5');

  const [budgetCat, setBudgetCat] = useState('Grocery');
  const [budgetAmt, setBudgetAmt] = useState('');

  const currency = user?.currency || 'INR';
  const formatStyle = user?.numberFormat || 'indian';

  const handleAddFixed = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(fixedAmount);
    if (!fixedName || isNaN(amt) || amt <= 0) return;

    addRecurringExpense({
      name: fixedName,
      expectedAmount: amt,
      category: fixedCategory,
      dueDateDay: parseInt(fixedDueDate, 10) || 5,
      isFixed: true,
      isEnabled: true,
    });

    setFixedName('');
    setFixedAmount('');
  };

  const handleSetPlanned = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(budgetAmt);
    if (isNaN(amt) || amt < 0) return;

    setPlannedBudget(budgetCat, amt);
    setBudgetAmt('');
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            Monthly Expense Plan ({formatMonthYear(selectedMonth)})
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Define recurring fixed commitments & set target budgets for variable categories
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('fixed')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'fixed'
                ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Fixed Expenses (₹{metrics.fixedExpensesTotal.toLocaleString('en-IN')})
          </button>
          <button
            onClick={() => setActiveTab('planned')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'planned'
                ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Planned Budgets (₹{metrics.plannedExpensesTotal.toLocaleString('en-IN')})
          </button>
        </div>
      </div>

      {/* Tab 1: Fixed Recurring Expenses */}
      {activeTab === 'fixed' && (
        <div className="space-y-5">
          {/* Add Fixed Expense Form */}
          <form onSubmit={handleAddFixed} className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-700">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Bill Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. House Rent"
                value={fixedName}
                onChange={e => setFixedName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Expected Amount (₹) *</label>
              <input
                type="number"
                required
                min="1"
                placeholder="e.g. 15000"
                value={fixedAmount}
                onChange={e => setFixedAmount(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Due Day of Month</label>
              <input
                type="number"
                min="1"
                max="31"
                placeholder="e.g. 5"
                value={fixedDueDate}
                onChange={e => setFixedDueDate(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Fixed Bill</span>
              </button>
            </div>
          </form>

          {/* Fixed Expenses List */}
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recurringExpenses.map(item => (
              <div
                key={item.id}
                className="py-3 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/30 px-2 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => toggleRecurringExpense(item.id)}
                    className="text-slate-400 hover:text-emerald-500 transition-colors"
                  >
                    {item.isEnabled ? (
                      <CheckSquare className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <Square className="w-5 h-5" />
                    )}
                  </button>

                  <div>
                    <h5
                      className={`font-bold text-sm ${
                        item.isEnabled
                          ? 'text-slate-800 dark:text-slate-100'
                          : 'text-slate-400 line-through'
                      }`}
                    >
                      {item.name}
                    </h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Due on {item.dueDateDay}th of month • {item.category}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                    {formatCurrency(item.expectedAmount || item.amount || 0, currency, formatStyle)}
                  </span>
                  <button
                    onClick={() => deleteRecurringExpense(item.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                    title="Delete recurring bill"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Planned Budgets & Actual vs Planned Analysis */}
      {activeTab === 'planned' && (
        <div className="space-y-5">
          {/* Set Category Planned Budget Form */}
          <form onSubmit={handleSetPlanned} className="flex flex-col sm:flex-row items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-700">
            <div className="w-full sm:w-1/3">
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Select Category</label>
              <select
                value={budgetCat}
                onChange={e => setBudgetCat(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full sm:w-1/3">
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Monthly Planned Target (₹) *</label>
              <input
                type="number"
                required
                min="0"
                placeholder="e.g. 8000"
                value={budgetAmt}
                onChange={e => setBudgetAmt(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>

            <div className="w-full sm:w-1/3 flex items-end pt-4 sm:pt-0">
              <button
                type="submit"
                className="w-full py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Save Planned Budget</span>
              </button>
            </div>
          </form>

          {/* Actual vs Planned Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-semibold text-xs border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-right">Planned Target</th>
                  <th className="py-3 px-4 text-right">Actual Spent</th>
                  <th className="py-3 px-4 text-right">Remaining / Over</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {metrics.actualVsPlannedCategories.map(row => (
                  <tr key={row.category} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">
                      {row.category}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-slate-700 dark:text-slate-300">
                      {formatCurrency(row.plannedAmount, currency, formatStyle)}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900 dark:text-slate-100">
                      {formatCurrency(row.actualAmount, currency, formatStyle)}
                    </td>
                    <td
                      className={`py-3 px-4 text-right font-black ${
                        row.remainingAmount < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {row.remainingAmount < 0 ? 'Over: ' : ''}
                      {formatCurrency(Math.abs(row.remainingAmount), currency, formatStyle)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          row.status === 'Over Plan'
                            ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200'
                            : row.status === 'On Plan'
                            ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200'
                            : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200'
                        }`}
                      >
                        {row.status === 'Over Plan' ? <AlertCircle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                        <span>{row.status}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
