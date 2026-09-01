'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { House, OverpaymentAction } from '@/lib/types';
import { useFinance } from '@/context/FinanceContext';
import { Sparkles, CheckSquare, Square, Info, Loader2 } from 'lucide-react';

interface HouseIncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  house: House;
}

const HOUSE_INCOME_CATEGORIES = [
  'Monthly PG Contribution',
  'Rent contribution',
  'Deposit',
  'Refund',
  'Shared reimbursement',
  'Extra contribution',
  'Other',
];

export const HouseIncomeModal: React.FC<HouseIncomeModalProps> = ({
  isOpen,
  onClose,
  house,
}) => {
  const { addHouseIncome } = useFinance();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [requiredShare, setRequiredShare] = useState('836');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paidBy, setPaidBy] = useState(house.members[1]?.id || house.members[0]?.id || '');
  const [receivedBy, setReceivedBy] = useState(house.members[0]?.id || '');
  const [category, setCategory] = useState('Monthly PG Contribution');
  const [overpaymentAction, setOverpaymentAction] = useState<OverpaymentAction>('Save as Advance Credit');
  const [description, setDescription] = useState('');
  const [syncToPersonal, setSyncToPersonal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const numAmount = parseFloat(amount) || 0;
  const numReqShare = parseFloat(requiredShare) || 0;
  const overpaymentAmount = Math.max(0, numAmount - numReqShare);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !title || isNaN(numAmount) || numAmount <= 0) return;

    setIsSubmitting(true);

    addHouseIncome(
      {
        houseId: house.id,
        title,
        amount: numAmount,
        date,
        paidByMemberId: paidBy,
        receivedByMemberId: receivedBy,
        category,
        requiredShare: numReqShare,
        overpaymentAction: overpaymentAmount > 0 ? overpaymentAction : undefined,
        advanceCreditGenerated: overpaymentAction === 'Save as Advance Credit' ? overpaymentAmount : 0,
        description,
      },
      syncToPersonal
    );

    setIsSubmitting(false);
    setTitle('');
    setAmount('');
    setRequiredShare('836');
    setDescription('');
    setSyncToPersonal(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="💰 Record House Income / Contribution"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Transaction Tag */}
        <div className="p-3 bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 rounded-2xl flex items-center justify-between text-xs">
          <span className="font-bold text-teal-900 dark:text-teal-200 uppercase tracking-wider">
            Transaction Type
          </span>
          <span className="font-black px-3 py-1 bg-teal-600 text-white rounded-xl shadow-xs">
            House Income / Contribution
          </span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Contribution Title *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Dhrupi Monthly PG Contribution"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Paid / Contributed By *
            </label>
            <select
              value={paidBy}
              onChange={e => setPaidBy(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
            >
              {house.members.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Received By *
            </label>
            <select
              value={receivedBy}
              onChange={e => setReceivedBy(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
            >
              {house.members.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Required Share (₹)
            </label>
            <input
              type="number"
              inputMode="decimal"
              min="0"
              placeholder="e.g. 836"
              value={requiredShare}
              onChange={e => setRequiredShare(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Actual Amount Paid (₹) *
            </label>
            <input
              type="number"
              inputMode="decimal"
              required
              min="1"
              placeholder="e.g. 1000"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-base font-bold text-emerald-600 dark:text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* OVERPAYMENT CONFIRMATION BOX */}
        {overpaymentAmount > 0 && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-2xl space-y-3">
            <div className="flex items-start gap-2 text-xs text-emerald-900 dark:text-emerald-200">
              <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-extrabold">
                  Overpayment Detected: ₹{overpaymentAmount.toLocaleString('en-IN')} Extra!
                </p>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-300 mt-0.5">
                  Paid ₹{numAmount.toLocaleString('en-IN')} for required share ₹{numReqShare.toLocaleString('en-IN')}. What would you like to do with the ₹{overpaymentAmount.toLocaleString('en-IN')} extra?
                </p>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              {[
                { key: 'Save as Advance Credit', label: `1. Save ₹${overpaymentAmount} as Advance Credit (Recommended)` },
                { key: 'Treat as House Income', label: `2. Treat ₹${overpaymentAmount} as House Income Pool` },
                { key: 'Refund', label: `3. Refund ₹${overpaymentAmount} to Member` },
                { key: 'Custom Adjustment', label: `4. Custom Adjustment` },
              ].map(opt => (
                <label key={opt.key} className="flex items-center gap-2 font-medium text-slate-800 dark:text-slate-200 cursor-pointer">
                  <input
                    type="radio"
                    name="overpaymentAction"
                    value={opt.key}
                    checked={overpaymentAction === opt.key}
                    onChange={() => setOverpaymentAction(opt.key as OverpaymentAction)}
                    className="accent-emerald-600"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
            >
              {HOUSE_INCOME_CATEGORIES.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
            />
          </div>
        </div>

        {/* Optional Personal Bank Confirmation */}
        <div className="p-3 bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-900/60 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                Record ₹{amount || '0'} into my Personal Bank Account?
              </p>
              <p className="text-[11px] text-indigo-700 dark:text-indigo-400">
                Check if money was physically received into your bank.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSyncToPersonal(!syncToPersonal)}
            className="text-indigo-600 dark:text-indigo-400 shrink-0"
          >
            {syncToPersonal ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
          </button>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-6 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-xl shadow-md flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>Record House Income</span>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
