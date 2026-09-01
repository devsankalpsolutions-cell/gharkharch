'use client';

import React, { useState } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { useAuth } from '@/context/AuthContext';
import { Liability } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { LiabilityModal } from '@/components/liabilities/LiabilityModal';
import { PayEmiModal } from '@/components/liabilities/PayEmiModal';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import {
  ShieldAlert,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  CreditCard,
  Building2,
} from 'lucide-react';

export default function LiabilitiesPage() {
  const { liabilities, deleteLiability, setIsAddLiabilityOpen } = useFinance();
  const { user } = useAuth();

  const [editingLiability, setEditingLiability] = useState<Liability | null>(null);
  const [payingLiability, setPayingLiability] = useState<Liability | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const currency = user?.currency || 'INR';
  const formatStyle = user?.numberFormat || 'indian';

  // Overall totals
  const totalOriginal = liabilities.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalPaid = liabilities.reduce((acc, curr) => acc + curr.paidAmount, 0);
  const totalRemaining = liabilities.reduce(
    (acc, curr) => acc + (curr.totalAmount - curr.paidAmount),
    0
  );
  const overallProgress = totalOriginal > 0 ? (totalPaid / totalOriginal) * 100 : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>Liability & Loan Portfolio</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Liabilities, Loans & Credit Dues
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track active home loans, car EMIs, credit card statements, and borrowed amounts.
          </p>
        </div>

        <button
          onClick={() => setIsAddLiabilityOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-sm shadow-md transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Liability</span>
        </button>
      </div>

      {/* Overall Portfolio Progress Card */}
      <div className="p-6 bg-gradient-to-tr from-amber-600 via-orange-600 to-amber-700 text-white rounded-3xl shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <span className="text-xs font-bold text-amber-100 uppercase tracking-wider">
              Total Debt Portfolio Repayment Progress
            </span>
            <div className="flex items-baseline gap-3 mt-1">
              <h3 className="text-3xl font-black">
                {formatCurrency(totalRemaining, currency, formatStyle)}
              </h3>
              <span className="text-xs text-amber-200">Remaining Loan Principal</span>
            </div>
          </div>

          <div className="flex gap-4 text-xs font-semibold bg-white/10 p-3 rounded-2xl backdrop-blur-md">
            <div>
              <p className="text-amber-200">Total Borrowed</p>
              <p className="text-base font-bold">{formatCurrency(totalOriginal, currency, formatStyle)}</p>
            </div>
            <div className="w-[1px] bg-amber-300/30" />
            <div>
              <p className="text-amber-200">Total Cleared</p>
              <p className="text-base font-bold">{formatCurrency(totalPaid, currency, formatStyle)}</p>
            </div>
          </div>
        </div>

        <ProgressBar progress={overallProgress} colorClass="bg-white" heightClass="h-3" />
      </div>

      {/* Liabilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {liabilities.map(lia => {
          const remaining = Math.max(0, lia.totalAmount - lia.paidAmount);
          const percentPaid = (lia.paidAmount / lia.totalAmount) * 100;

          return (
            <div
              key={lia.id}
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-xl">
                      {lia.type === 'Loan' ? (
                        <Building2 className="w-5 h-5" />
                      ) : (
                        <CreditCard className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-800 dark:text-slate-100 text-base">
                          {lia.name}
                        </h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {lia.priority || 'Medium'} Priority
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {lia.type} • {lia.dueDate}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      lia.status === 'Paid'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200'
                        : lia.status === 'Overdue'
                        ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200'
                        : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200'
                    }`}
                  >
                    {lia.status === 'Paid' && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {lia.status === 'Overdue' && <AlertCircle className="w-3.5 h-3.5" />}
                    {lia.status === 'Active' && <Clock className="w-3.5 h-3.5" />}
                    <span>{lia.status}</span>
                  </span>
                </div>

                {/* Numbers */}
                <div className="grid grid-cols-2 gap-3 my-4 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-400 uppercase">
                      Remaining Principal
                    </span>
                    <p className="text-lg font-black text-slate-800 dark:text-slate-100 mt-0.5">
                      {formatCurrency(remaining, currency, formatStyle)}
                    </p>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-400 uppercase">
                      Monthly EMI
                    </span>
                    <p className="text-lg font-black text-amber-600 dark:text-amber-400 mt-0.5">
                      {lia.type === 'Friend Borrow' ? 'Flexible' : formatCurrency(lia.monthlyEmi, currency, formatStyle)}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <ProgressBar progress={percentPaid} colorClass="bg-amber-500" />
                </div>

                {/* Loan Metadata */}
                <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400 mb-4">
                  <div className="flex justify-between">
                    <span>Original Loan Amount:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {formatCurrency(lia.totalAmount, currency, formatStyle)}
                    </span>
                  </div>
                  {lia.interestRate ? (
                    <div className="flex justify-between">
                      <span>Interest Rate:</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {lia.interestRate}% p.a.
                      </span>
                    </div>
                  ) : null}
                  {lia.notes && <p className="italic text-slate-400 pt-1">{lia.notes}</p>}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setPayingLiability(lia)}
                  disabled={lia.status === 'Paid' || remaining <= 0}
                  className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
                >
                  + Pay EMI
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditingLiability(lia)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Edit Liability"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeletingId(lia.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Delete Liability"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Modal */}
      {editingLiability && (
        <LiabilityModal
          isOpen={!!editingLiability}
          onClose={() => setEditingLiability(null)}
          initialData={editingLiability}
        />
      )}

      {/* Pay EMI Modal */}
      {payingLiability && (
        <PayEmiModal
          isOpen={!!payingLiability}
          onClose={() => setPayingLiability(null)}
          liability={payingLiability}
        />
      )}

      {/* Confirmation Dialog */}
      {deletingId && (
        <ConfirmDialog
          isOpen={!!deletingId}
          onClose={() => setDeletingId(null)}
          onConfirm={() => deleteLiability(deletingId)}
          title="Delete Liability Record"
          message="Are you sure you want to remove this liability record? All associated EMI payment records will be permanently removed."
        />
      )}
    </div>
  );
}
