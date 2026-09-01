'use client';

import React, { useState } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { useAuth } from '@/context/AuthContext';
import { Expense } from '@/lib/types';
import { formatCurrency, formatDate, formatMonthYear } from '@/lib/formatters';
import { ExpenseModal } from '@/components/expenses/ExpenseModal';
import { CategoryManagerModal } from '@/components/expenses/CategoryManagerModal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import {
  TrendingDown,
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  Flame,
  Calendar,
  Tag,
  Building2,
  Wallet,
} from 'lucide-react';

export default function ExpensesPage() {
  const { expenses, selectedMonth, deleteExpense, setIsAddExpenseOpen, metrics, categories } = useFinance();
  const { user } = useAuth();

  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const currency = user?.currency || 'INR';
  const formatStyle = user?.numberFormat || 'indian';

  // Filter expenses by month, category, and search query
  const monthExpenses = expenses.filter(exp => {
    const matchesMonth = exp.date.startsWith(selectedMonth);
    const matchesCategory = selectedCategory === 'All' || exp.category === selectedCategory;
    const matchesSearch =
      exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (exp.description && exp.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesMonth && matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-wider mb-1">
            <TrendingDown className="w-4 h-4" />
            <span>Expense Management</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Expense Records ({formatMonthYear(selectedMonth)})
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track daily household spending, utility bills, groceries, and family expenses.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsCategoryManagerOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-xl font-bold text-xs border border-slate-200 dark:border-slate-700 transition-all"
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Manage Categories</span>
          </button>

          <button
            onClick={() => setIsAddExpenseOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Expense</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards for Expense Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Expenses */}
        <div className="p-5 bg-gradient-to-tr from-rose-600 to-red-700 text-white rounded-2xl shadow-md">
          <span className="text-xs font-semibold text-rose-100 uppercase tracking-wider">
            Total Monthly Expenses
          </span>
          <h3 className="text-2xl font-black mt-1">
            {formatCurrency(metrics.totalExpenses, currency, formatStyle)}
          </h3>
          <p className="text-[11px] text-rose-200 mt-1">
            {monthExpenses.length} Expense item(s) in {formatMonthYear(selectedMonth)}
          </p>
        </div>

        {/* Highest Expense Category */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Highest Spending Category
            </span>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
              {metrics.highestExpenseCategory?.category || 'None'}
            </h3>
            <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold mt-0.5">
              {metrics.highestExpenseCategory
                ? formatCurrency(metrics.highestExpenseCategory.amount, currency, formatStyle)
                : '₹0'}
            </p>
          </div>
          <div className="p-3 bg-rose-50 dark:bg-rose-950/60 rounded-2xl text-rose-600 dark:text-rose-400">
            <Flame className="w-6 h-6" />
          </div>
        </div>

        {/* Daily Expense Average */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Daily Expense Avg.
            </span>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
              {formatCurrency(metrics.dailyExpenseAverage, currency, formatStyle)}
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Based on 30-day average
            </p>
          </div>
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/60 rounded-2xl text-indigo-600 dark:text-indigo-400">
            <Calendar className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:w-1/2">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search expenses by title or note..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        <div className="relative w-full sm:w-1/2 flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <option value="All">All Expense Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        {monthExpenses.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-3">
              <TrendingDown className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-700 dark:text-slate-200 text-base">
              No Expenses Recorded
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              No expense items match your criteria for {formatMonthYear(selectedMonth)}.
            </p>
          </div>
        ) : (
          <div>
            {/* Mobile Compact Transaction Cards (Rule 15) */}
            <div className="sm:hidden divide-y divide-slate-100 dark:divide-slate-800">
              {monthExpenses.map(exp => (
                <div key={exp.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                        {exp.title}
                      </h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                        {exp.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {formatDate(exp.date)} • {exp.paymentMethod} ({exp.account || 'Bank'})
                    </p>
                    {exp.description && (
                      <p className="text-[11px] text-slate-400 italic">{exp.description}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-base text-rose-600 dark:text-rose-400">
                      -{formatCurrency(exp.amount, currency, formatStyle)}
                    </span>
                    <button
                      onClick={() => setEditingExpense(exp)}
                      className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg min-w-[36px] min-h-[36px]"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingId(exp.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-lg min-w-[36px] min-h-[36px]"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-semibold text-xs border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4">Expense Title</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Account / Method</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4 text-right">Amount</th>
                    <th className="py-3.5 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {monthExpenses.map(exp => (
                    <tr
                      key={exp.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-800 dark:text-slate-100">
                          {exp.title}
                        </p>
                        {exp.description && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {exp.description}
                          </p>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200/50 dark:border-rose-900/50">
                          {exp.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 text-xs">
                        <span className="flex items-center gap-1 font-medium">
                          {exp.account === 'Bank' ? <Building2 className="w-3.5 h-3.5 text-indigo-500" /> : <Wallet className="w-3.5 h-3.5 text-emerald-500" />}
                          <span>{exp.paymentMethod} ({exp.account || 'Bank'})</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 text-xs">
                        {formatDate(exp.date)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-extrabold text-rose-600 dark:text-rose-400">
                        -{formatCurrency(exp.amount, currency, formatStyle)}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setEditingExpense(exp)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Edit Expense"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingId(exp.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Delete Expense"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Category Manager Modal */}
      <CategoryManagerModal
        isOpen={isCategoryManagerOpen}
        onClose={() => setIsCategoryManagerOpen(false)}
      />

      {/* Edit Modal */}
      {editingExpense && (
        <ExpenseModal
          isOpen={!!editingExpense}
          onClose={() => setEditingExpense(null)}
          initialData={editingExpense}
        />
      )}

      {/* Confirmation Dialog */}
      {deletingId && (
        <ConfirmDialog
          isOpen={!!deletingId}
          onClose={() => setDeletingId(null)}
          onConfirm={() => deleteExpense(deletingId)}
          title="Delete Expense Record"
          message="Are you sure you want to delete this expense? The deducted amount will be restored to your account balance automatically."
        />
      )}
    </div>
  );
}
