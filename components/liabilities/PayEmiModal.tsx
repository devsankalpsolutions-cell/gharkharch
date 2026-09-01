'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Liability, PaymentMethod } from '@/lib/types';
import { useFinance } from '@/context/FinanceContext';
import { getAccountFromPaymentMethod } from '@/lib/storage';
import { Building2, Wallet } from 'lucide-react';

interface PayEmiModalProps {
  isOpen: boolean;
  onClose: () => void;
  liability: Liability | null;
}

const PAYMENT_METHODS: PaymentMethod[] = ['Bank Transfer', 'UPI', 'Cash', 'Credit Card', 'Debit Card', 'Cheque', 'Other'];

export const PayEmiModal: React.FC<PayEmiModalProps> = ({ isOpen, onClose, liability }) => {
  const { payEmi, selectedMonth, balances } = useFinance();

  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Bank Transfer');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (liability) {
      setAmount(liability.monthlyEmi ? liability.monthlyEmi.toString() : liability.remainingAmount.toString());
      const defaultDate = `${selectedMonth}-05`;
      setDate(defaultDate);
      setPaymentMethod('Bank Transfer');
      setNotes(`${liability.name} repayment`);
    }
  }, [liability, isOpen, selectedMonth]);

  if (!liability) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmt = parseFloat(amount);
    if (isNaN(numAmt) || numAmt <= 0) return;

    const success = payEmi(liability.id, numAmt, paymentMethod, date, notes);
    if (success) onClose();
  };

  const targetAccount = getAccountFromPaymentMethod(paymentMethod);
  const availableBal = targetAccount === 'Bank' ? balances.bankBalance : balances.walletBalance;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Repayment - ${liability.name}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-xl text-xs text-amber-800 dark:text-amber-300 flex justify-between items-center">
          <div>
            <p className="font-semibold">{liability.name}</p>
            <p className="mt-0.5">Remaining Principal: ₹{liability.remainingAmount.toLocaleString('en-IN')}</p>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400">
              {liability.type === 'Friend Borrow' ? 'Friend Loan' : 'Monthly EMI'}
            </span>
            <p className="font-extrabold text-sm">
              ₹{(liability.monthlyEmi || liability.remainingAmount).toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Payment Amount (₹) *
            </label>
            <input
              type="number"
              required
              min="1"
              max={liability.remainingAmount}
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Payment Date *
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Payment Method
          </label>
          <select
            value={paymentMethod}
            onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            {PAYMENT_METHODS.map(pm => (
              <option key={pm} value={pm}>
                {pm}
              </option>
            ))}
          </select>
        </div>

        {/* Account Indicator */}
        <div className="p-2.5 bg-slate-100 dark:bg-slate-800/80 rounded-xl flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-1.5 font-semibold">
            {targetAccount === 'Bank' ? <Building2 className="w-4 h-4 text-indigo-500" /> : <Wallet className="w-4 h-4 text-emerald-500" />}
            <span>Deducts from {targetAccount} Balance</span>
          </div>
          <span className="font-extrabold text-slate-900 dark:text-slate-100">
            Avail: ₹{availableBal.toLocaleString('en-IN')}
          </span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Payment Remarks / Reference
          </label>
          <input
            type="text"
            placeholder="e.g. Transaction ref ID #98721"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-md transition-colors"
          >
            Record Payment
          </button>
        </div>
      </form>
    </Modal>
  );
};
