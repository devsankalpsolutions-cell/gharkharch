'use client';

import React, { useState } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { useAuth } from '@/context/AuthContext';
import { Income, IncomeCategory } from '@/lib/types';
import { formatCurrency, formatDate, formatMonthYear } from '@/lib/formatters';
import { IncomeModal } from '@/components/income/IncomeModal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import {
  TrendingUp,
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  DollarSign,
  Wallet,
} from 'lucide-react';

const CATEGORIES: (IncomeCategory | 'All')[] = ['All', 'Salary', 'Business', 'Freelance', 'Rent', 'Interest', 'Other'];

export default function IncomePage() {
  const { incomes, selectedMonth, deleteIncome, setIsAddIncomeOpen } = useFinance();
  const { user } = useAuth();

  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const currency = user?.currency || 'INR';
  const formatStyle = user?.numberFormat || 'indian';

  // Filter incomes by selected month, category, and search query
  const monthIncomes = incomes.filter(inc => {
    const matchesMonth = inc.date.startsWith(selectedMonth);
    const matchesCategory = selectedCategory === 'All' || inc.category === selectedCategory;
    const matchesSearch =
      inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inc.description && inc.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesMonth && matchesCategory && matchesSearch;
  });

  const totalMonthlyIncome = monthIncomes.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">
            <TrendingUp className="w-4 h-4" />
            <span>Income Management</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Income Records ({formatMonthYear(selectedMonth)})
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage salary, freelance payments, rental income, and investments.
          </p>
        </div>

        <button
          onClick={() => setIsAddIncomeOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Income</span>
        </button>
      </div>

      {/* Summary Stat Card & Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-gradient-to-tr from-emerald-600 to-teal-700 text-white rounded-2xl shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-100 uppercase tracking-wider">
              Total {formatMonthYear(selectedMonth)} Income
            </span>
            <h3 className="text-2xl font-black mt-1">
              {formatCurrency(totalMonthlyIncome, currency, formatStyle)}
            </h3>
            <p className="text-[11px] text-emerald-200 mt-1">
              {monthIncomes.length} Income transaction(s) recorded
            </p>
          </div>
          <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
            <Wallet className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-1/2">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search income title..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="relative w-full sm:w-1/2 flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Income Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        {monthIncomes.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-700 dark:text-slate-200 text-base">
              No Income Records Found
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              No income entries match your selected month or filter. Click "+ Add Income" to add your salary or earnings.
            </p>
          </div>
        ) : (
          <div>
            {/* Mobile Compact Transaction Cards (Rule 15) */}
            <div className="sm:hidden divide-y divide-slate-100 dark:divide-slate-800">
              {monthIncomes.map(inc => (
                <div key={inc.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                        {inc.title}
                      </h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                        {inc.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {formatDate(inc.date)} • {inc.paymentMethod || 'Bank'} Account
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-base text-emerald-600 dark:text-emerald-400">
                      +{formatCurrency(inc.amount, currency, formatStyle)}
                    </span>
                    <button
                      onClick={() => setEditingIncome(inc)}
                      className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg min-w-[36px] min-h-[36px]"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingId(inc.id)}
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
                    <th className="py-3.5 px-4">Income Title</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Payment Method</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4 text-right">Amount</th>
                    <th className="py-3.5 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {monthIncomes.map(inc => (
                    <tr
                      key={inc.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-800 dark:text-slate-100">
                          {inc.title}
                        </p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/50">
                          {inc.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 text-xs">
                        {inc.paymentMethod}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 text-xs">
                        {formatDate(inc.date)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-extrabold text-emerald-600 dark:text-emerald-400">
                        +{formatCurrency(inc.amount, currency, formatStyle)}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setEditingIncome(inc)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Edit Income"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingId(inc.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Delete Income"
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

      {/* Edit Modal */}
      {editingIncome && (
        <IncomeModal
          isOpen={!!editingIncome}
          onClose={() => setEditingIncome(null)}
          initialData={editingIncome}
        />
      )}

      {/* Confirmation Dialog */}
      {deletingId && (
        <ConfirmDialog
          isOpen={!!deletingId}
          onClose={() => setDeletingId(null)}
          onConfirm={() => deleteIncome(deletingId)}
          title="Delete Income Record"
          message="Are you sure you want to delete this income entry? This calculation will be dynamically updated across your dashboard."
        />
      )}
    </div>
  );
}
